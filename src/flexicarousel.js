/*
 * carousel ten billion
 * https://github.com/apathetic/flexicarousel-3
 *
 * Copyright (c) 2013 Wes Hatch
 * Licensed under the MIT license.
 *
 */


var Carousel = function(container, options){

	this.handle = container;

	// default options
	// --------------------
	this.defaults = {
		activeClass: 'active',
		slideWrap: 'ul',			// for binding touch events
		slides: 'li',				// the slide
		infinite: true,				// infinite scrolling or not
		display: 1,					// the minimum # of slides to display at a time
		offscreen: 0,				// the # of slides to "view ahead" ie. position offscreen
		disableDragging: false
	};

	// state vars
	// --------------------
	this.current = 0;
	this.slides = [];
	this.sliding = false;
	this.cloned = 0;

	// touch vars
	// --------------------
	this.dragging = false;
	this.dragThreshold = 50;
	this.deltaX = 0;

	// feature detection
	// --------------------
	this.isTouch = 'ontouchend' in document;
	var style = document.body.style;
	var tests = {
		 'transform':'transitionend',
		 'OTransform': 'oTransitionEnd',
		 'MozTransform': 'transitionend',
		 'webkitTransform': 'webkitTransitionEnd'
	};
	// note: we don't test "ms" prefix, (as that gives us IE9 which doesn't support transforms3d anyway. IE10 test will work with "transform")
	for (var x in tests) {
		if ( style[x] !== undefined) {
			this.transform = x;
			this.transitionEnd = tests[x];
			break;
		}
	}

	// engage engines
	// --------------------
	this.init(options);
};

Carousel.prototype = {

	/**
	 * Initialize the carousel and set some defaults
	 * @param  {object} options List of key: value options
	 * @return {void}
	 */
	init: function(options){

		// set up options
		this.options = this._extend( this.defaults, options );

		// find carousel elements
		if ( !(this.slideWrap	= this.handle.querySelector(this.options.slideWrap)) ) { return; }		// note: assignment
		if ( !(this.slides		= this.slideWrap.querySelectorAll(this.options.slides)) ) { return; }	// note: assignment

		this.numSlides = this.slides.length;

		// check if we have sufficient slides to make a carousel
		if ( this.numSlides < this.options.display ) { this.sliding = true; return; }		// this.sliding deactivates carousel. I will better-ify this one day. Maybe "this.active" ?
		if ( this.options.infinite ) { this._cloneSlides(this.options.display); }

		this.go(0);

		// set up Events
		if ( ! this.options.disableDragging) {
			if ( this.isTouch ) {
				this.slideWrap.addEventListener('touchstart', this._dragStart.bind(this));
				this.slideWrap.addEventListener('touchmove', this._drag.bind(this));
				this.slideWrap.addEventListener('touchend', this._dragEnd.bind(this));
				this.slideWrap.addEventListener('touchcancel', this._dragEnd.bind(this));
			} else {
				this.slideWrap.addEventListener('mousedown', this._dragStart.bind(this));
				this.slideWrap.addEventListener('mousemove', this._drag.bind(this));
				this.slideWrap.addEventListener('mouseup', this._dragEnd.bind(this));
				this.slideWrap.addEventListener('mouseleave', this._dragEnd.bind(this));
			}
		}

		window.addEventListener('resize', this._updateView.bind(this));
		window.addEventListener('orientationchange', this._updateView.bind(this));

		return this;
	},

	/**
	 * Go to the next slide
	 * @return {void}
	 */
	next: function() {
		if (this.options.infinite || this.current !== this.numSlides-1) {
			this.go(this.current + 1);
		} else {
			this.go(this.numSlides-1);
		}
	},

	/**
	 * Go to the previous slide
	 * @return {void}
	 */
	prev: function() {
		if (this.options.infinite || this.current !== 0) {
			this.go(this.current - 1);
		} else {
			this.go(0);		// allow the slide to "snap" back if dragging and not infinite
		}
	},

	/**
	 * Go to a particular slide. Prime the "to" slide by positioning it, and then calling _slide() if needed
	 * @param  {int} to		the slide to go to
	 * @return {void}
	 */
	go: function(to) {
		if ( this.sliding ) { return; }

		this.width = this.slides[0].offsetWidth;								// check every time
		this.offset = this.cloned * this.width;

		if ( to < 0 || to >= this.numSlides ) {									// position the carousel if infinite and at end of bounds
			var temp = (to < 0) ? this.current+this.numSlides : this.current-this.numSlides;
			this._slide( -(temp * this.width - this.deltaX ) );

			/* jshint ignore:start */
			this.slideWrap.offsetHeight;										// force a repaint to actually position "to" slide. *Important*
			/* jshint ignore:end */
		}

		to = this._loop(to);
		this._slide( -(to * this.width), true );

		if (this.options.onSlide) { this.options.onSlide.call(this, to, this.current); }	// note: doesn't check if it's a function

		this._removeClass( this.slides[this.current], this.options.activeClass );
		this._addClass( this.slides[to], this.options.activeClass );
		this.current = to;
	},


	// ------------------------------------- "mobile" starts here ------------------------------------- //


	/**
	 * Start dragging (via touch)
	 * @param  {event} e Touch event
	 * @return {void}
	 */
	_dragStart: function(e) {
		var touches;

		if (this.sliding) {
			return false;
		}

		e = e.originalEvent || e;
		touches = e.touches !== undefined ? e.touches : false;

		this.dragThresholdMet = false;
		this.dragging = true;
		this.cancel = false;
		this.startClientX = touches ? touches[0].pageX : e.clientX;
		this.startClientY = touches ? touches[0].pageY : e.clientY;
		this.deltaX = 0;	// reset for the case when user does 0,0 touch
		this.deltaY = 0;	// reset for the case when user does 0,0 touch

		if (e.target.tagName === 'IMG' || e.target.tagName === 'A') { e.target.draggable = false; }
	},

	/**
	 * Update slides positions according to user's touch
	 * @param  {event} e Touch event
	 * @return {void}
	 */
	_drag: function(e) {
		var abs = Math.abs,		// helper fn
			touches;

		if (!this.dragging || this.cancel) {
			return;
		}

		e = e.originalEvent || e;
		touches = e.touches !== undefined ? e.touches : false;
		this.deltaX = (touches ? touches[0].pageX : e.clientX) - this.startClientX;
		this.deltaY = (touches ? touches[0].pageY : e.clientY) - this.startClientY;

		// determine if we should do slide, or cancel and let the event pass through to the page
		if (this.dragThresholdMet || (abs(this.deltaX) > abs(this.deltaY) && abs(this.deltaX) > 10)) {		// 10 from empirical testing

			e.preventDefault();
			e.stopPropagation();
			e.stopImmediatePropagation();

			this.dragThresholdMet = true;
			this._slide( -(this.current * this.width - this.deltaX ) );

		} else if ((abs(this.deltaY) > abs(this.deltaX) && abs(this.deltaY) > 10)) {
			this.cancel = true;
		}
	},

	/**
	 * Drag end, calculate slides' new positions
	 * @param  {event} e Touch event
	 * @return {void}
	 */
	_dragEnd: function() {
		if (!this.dragging || this.cancel) {
			return;
		}

		this.dragging = false;

		if ( this.deltaX !== 0 && Math.abs(this.deltaX) < this.dragThreshold ) {
			this.go(this.current);
		}
		else if ( this.deltaX > 0 ) {
			// var jump = Math.round(this.deltaX / this.width);	// distance-based check to swipe multiple slides
			// this.go(this.current - jump);
			this.prev();
		}
		else if ( this.deltaX < 0 ) {
			this.next();
		}

		this.deltaX = 0;
	},


	// ------------------------------------- carousel engine ------------------------------------- //


	/**
	 * Helper function to translate slide in browser
	 * @param  {[type]} el     [description]
	 * @param  {[type]} offset [description]
	 * @return {[type]}        [description]
	 */
	_slide: function(offset, animate) {
		offset -= this.offset;

		if ( animate ) {
			this.sliding = true;
			this._addClass( this.slideWrap, 'animate' );

			var delay = 400;
			var self = this;
			setTimeout(function(){
				self.sliding = false;
				self._removeClass( self.slideWrap, 'animate' );
			}, delay);

		}

		if (this.transform) {
			this.slideWrap.style[this.transform] = 'translate3d(' + offset + 'px, 0, 0)';
		}
		else {
			this.slideWrap.style.left = offset+'px';
		}
	},


	// ------------------------------------- "helper" functions ------------------------------------- //


	/**
	 * Helper function. Calculate modulo of a slides position
	 * @param  {int} val Slide's position
	 * @return {int} the index modulo the # of slides
	 */
	_loop: function(val) {
		return (this.numSlides + (val % this.numSlides)) % this.numSlides;
	},

	/**
	 * Update the slides' position on a resize. This is throttled at 300ms
	 * @return {void}
	 */
	_updateView: function() {
		var self = this;
		clearTimeout(this.timer);
		this.timer = setTimeout(function(){ self.go(self.current); }, 300);
	},

	/**
	 * Duplicate the first and last N slides so that infinite scrolling can work.
	 * Depends on how many slides are visible at a time, and any outlying slides as well
	 * @return {void}
	 */
	_cloneSlides: function() {
		var beg, end,
			duplicate,
			i;

		end = this.options.display + this.options.offscreen - 1;
		end = (end > this.numSlides) ? this.numSlides : end;
		beg = this.numSlides - this.options.offscreen - 1;

		// beginning
		for (i = this.numSlides; i > beg; i--) {
			duplicate = this.slides[i-1].cloneNode(true);						// cloneNode --> true is deep cloning
			duplicate.removeAttribute('id');
			duplicate.setAttribute('aria-hidden', 'true');
			this._addClass( duplicate, 'clone');
			this.slideWrap.insertBefore(duplicate, this.slideWrap.firstChild);	// add duplicate to beg'n of slides
			this.cloned++;
		}

		// end
		for (i = 0; i < end; i++) {
			duplicate = this.slides[i].cloneNode(true);
			duplicate.removeAttribute('id');
			duplicate.setAttribute('aria-hidden', 'true');
			this._addClass( duplicate, 'clone');
			this.slideWrap.appendChild(duplicate);
		}

		// this.slideWrap.style.marginLeft = (-offscreen)+'00%';					// use marginLeft (not left) so IE8/9 etc can use left to slide
	},

	/**
	 * Helper function to add a class to an element
	 * @param  {int} i    Index of the slide to add a class to
	 * @param  {string} name Class name
	 * @return {void}
	 */
	_addClass: function(el, name) {
		if (el.classList) { el.classList.add(name); }
		else {el.className += ' ' + name; }
	},

	/**
	 * Helper function to remove a class from an element
	 * @param  {int} i    Index of the slide to remove class from
	 * @param  {string} name Class name
	 * @return {void}
	 */
	_removeClass: function(el, name) {
		if (el.classList) { el.classList.remove(name); }
		else { el.className = el.className.replace(new RegExp('(^|\\b)' + name.split(' ').join('|') + '(\\b|$)', 'gi'), ' '); }
	},

	/**
	 * Helper function. Simple way to merge objects
	 * @param  {object} obj A list of objects to extend
	 * @return {object}     The extended object
	 */
	_extend: function(obj) {
		var args = Array.prototype.slice.call(arguments, 1);
		for (var i = 0; i < args.length; i++) {
			var source = args[i];
			if (source) {
				for (var prop in source) {
					obj[prop] = source[prop];
				}
			}
		}
		return obj;
	}

};

