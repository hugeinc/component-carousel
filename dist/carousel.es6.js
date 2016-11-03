/*
 * carousel ten billion
 * https://github.com/apathetic/flexicarousel
 *
 * Copyright (c) 2013, 2016 Wes Hatch
 * Licensed under the MIT license.
 *
 */

// import transform from './transform';

var Carousel = function Carousel(container, options) {
	var this$1 = this;
	if ( options === void 0 ) options={};


	this.handle = container;

	// default options
	// --------------------
	this.options = {
		animateClass: 'animate',
		activeClass: 'active',
		slideWrap: 'ul',			// for binding touch events
		slides: 'li',					// the slides
		infinite: true,				// infinite scrolling or not
		display: 1,						// the minimum # of slides to display at a time. If you want to have slides...
														// "hanging" off outside the currently viewable ones, they'd be included here.
		disableDragging: false// only use API to navigate
	};

	// state vars
	// --------------------
	this.current = 0;
	this.slides = [];
	this.sliding = false;
	this.cloned = 0;
	this.active = true;

	// touch vars
	// --------------------
	this.dragging = false;
	this.dragThreshold = 10;
	this.deltaX = 0;

	// feature detection
	// --------------------
	this.isTouch = 'ontouchend' in document;
	// this.transform = ['transform', 'webkitTransform', 'MozTransform', 'OTransform', 'msTransform'].find((t) => {
	//   return document.body.style[t] !== undefined;
	// }); // IE Boooo

	['transform', 'webkitTransform', 'MozTransform', 'OTransform', 'msTransform'].forEach(function (t) {
		if (document.body.style[t] !== undefined) { this$1.transform = t; }
	});

	// set up options
	// --------------------
	this.options = Object.assign(this.options, options);

	// engage engines
	// --------------------
	this.init();
};

/**
	 * Initialize the carousel and set some defaults
	 * @param  {object} options List of key: value options
	 * @return {void}
	 */
Carousel.prototype.init = function init () {
		var this$1 = this;

	// find carousel elements
	this.slideWrap = this.handle.querySelector(this.options.slideWrap);
	this.slides = this.slideWrap.querySelectorAll(this.options.slides);
	this.numSlides = this.slides.length;

	if (!this.slideWrap || !this.slides || this.numSlides < this.options.display) { console.log('Carousel: insufficient # slides'); return this.active = false; }
	if (this.options.infinite) { this._cloneSlides(); }

	this._updateView();
	this._bindings = this._createBindings();// set up Events

	if (!this.options.disableDragging) {
		if (this.isTouch) {
			['touchstart', 'touchmove', 'touchend', 'touchcancel'].map(function (event) {
				this$1.handle.addEventListener(event, this$1._bindings[event]);
			});
		} else {
			['mousedown', 'mousemove', 'mouseup', 'mouseleave', 'click'].map(function (event) {
				this$1.handle.addEventListener(event, this$1._bindings[event]);
			});
		}
	}

	window.addEventListener('resize', this._bindings['resize']);
	window.addEventListener('orientationchange', this._bindings['orientationchange']);

	return this;
};

/**
	 * Removes all event bindings.
	 * @returns {Carousel}
	 * */
Carousel.prototype.destroy = function destroy () {
		var this$1 = this;

	for (var event in this._bindings) {
		this$1.handle.removeEventListener(event, this$1._bindings[event]);
	}

	this._bindings = null;
	this.options = this.slides = this.slideWrap = this.handle = null;
	this.active = false;

	// remove classes ...
	// remove clones ...
};

/**
	 * Go to the next slide
	 * @return {void}
	 */
Carousel.prototype.next = function next () {
	if (this.options.infinite || this.current !== this.numSlides-1) {
		this.go(this.current + 1);
	} else {
		this.go(this.numSlides-1);
	}
};

/**
	 * Go to the previous slide
	 * @return {void}
	 */
Carousel.prototype.prev = function prev () {
	if (this.options.infinite || this.current !== 0) {
		this.go(this.current - 1);
	} else {
		this.go(0);	// allow the slide to "snap" back if dragging and not infinite
	}
};

/**
	 * Go to a particular slide. Prime the "to" slide by positioning it, and then calling _slide() if needed
	 * @param  {int} to	the slide to go to
	 * @return {void}
	 */
Carousel.prototype.go = function go (to) {
	var opts = this.options;

	if (this.sliding || !this.active) { return; }

	if (to < 0 || to >= this.numSlides) {								// position the carousel if infinite and at end of bounds
		var temp = (to < 0) ? this.current + this.numSlides : this.current - this.numSlides;
		this._slide( -(temp * this.width - this.deltaX) );
		this.slideWrap.offsetHeight;									// force a repaint to actually position "to" slide. *Important*
	}

	to = this._loop(to);
	this._slide( -(to * this.width), true );

	if (opts.onSlide) { opts.onSlide.call(this, to, this.current); }// note: doesn't check if it's a function

	this._removeClass(this.slides[this.current], opts.activeClass);
	this._addClass(this.slides[to], opts.activeClass);
	this.current = to;
};

// ------------------------------------- Event Listeners ------------------------------------- //

/**
	 * Create references to all bound Events so that they may be removed upon destroy()
	 * @return {Object} containing references to each event and its bound function
	 */
Carousel.prototype._createBindings = function _createBindings () {
	return {
		// handle
		'touchstart': this._dragStart.bind(this),
		'touchmove': this._drag.bind(this),
		'touchend': this._dragEnd.bind(this),
		'touchcancel': this._dragEnd.bind(this),
		'mousedown': this._dragStart.bind(this),
		'mousemove': this._drag.bind(this),
		'mouseup': this._dragEnd.bind(this),
		'mouseleave': this._dragEnd.bind(this),
		'click': this._checkDragThreshold.bind(this),

		// window
		'resize': this._updateView.bind(this),
		'orientationchange': this._updateView.bind(this)
	};
};

// ------------------------------------- Drag Events ------------------------------------- //

Carousel.prototype._checkDragThreshold = function _checkDragThreshold (e) {
	if (this.dragThresholdMet) {
		e.preventDefault();
	}
};

/**
	 * Start dragging (via touch)
	 * @param  {event} e Touch event
	 * @return {void}
	 */
Carousel.prototype._dragStart = function _dragStart (e) {
	var touches;

	if (this.sliding) {
		return false;
	}

	e = e.originalEvent || e;
	touches = e.touches !== undefined ? e.touches : false;

	this.dragThresholdMet = false;
	this.dragging = true;
	this.startClientX = touches ? touches[0].pageX : e.clientX;
	this.startClientY = touches ? touches[0].pageY : e.clientY;
	this.deltaX = 0;// reset for the case when user does 0,0 touch
	this.deltaY = 0;// reset for the case when user does 0,0 touch

	if (e.target.tagName === 'IMG' || e.target.tagName === 'A') { e.target.draggable = false; }
};

/**
	 * Update slides positions according to user's touch
	 * @param  {event} e Touch event
	 * @return {void}
	 */
Carousel.prototype._drag = function _drag (e) {
	var touches;

	if (!this.dragging) {
		return;
	}

	e = e.originalEvent || e;
	touches = e.touches !== undefined ? e.touches : false;
	this.deltaX = (touches ? touches[0].pageX : e.clientX) - this.startClientX;
	this.deltaY = (touches ? touches[0].pageY : e.clientY) - this.startClientY;

    // drag slide along with cursor
	this._slide( -(this.current * this.width - this.deltaX ) );

	// determine if we should do slide, or cancel and let the event pass through to the page
	this.dragThresholdMet = this.dragThresholdMet || Math.abs(this.deltaX) > this.dragThreshold;
};

/**
	 * Drag end, calculate slides' new positions
	 * @param  {event} e Touch event
	 * @return {void}
	 */
Carousel.prototype._dragEnd = function _dragEnd (e) {
	if (!this.dragging) {
		return;
	}

	if (this.dragThresholdMet) {
		e.preventDefault();
		e.stopPropagation();
		e.stopImmediatePropagation();
	}

	this.dragging = false;

	if ( this.deltaX !== 0 && Math.abs(this.deltaX) < this.dragThreshold ) {
		this.go(this.current);
	}
	else if ( this.deltaX > 0 ) {
		// var jump = Math.round(this.deltaX / this.width);// distance-based check to swipe multiple slides
		// this.go(this.current - jump);
		this.prev();
	}
	else if ( this.deltaX < 0 ) {
		this.next();
	}

	this.deltaX = 0;
};


// ------------------------------------- carousel engine ------------------------------------- //


/**
	 * Helper function to translate slide in browser
	 * @param  {[type]} el     [description]
	 * @param  {[type]} offset [description]
	 * @return {[type]}        [description]
	 */
Carousel.prototype._slide = function _slide (offset, animate) {
		var this$1 = this;

	var delay = 400;

	offset -= this.offset;

	if (animate) {
		this.sliding = true;
		this._addClass(this.slideWrap, this.options.animateClass);

		setTimeout(function () {
			this$1.sliding = false;
			this$1._removeClass(this$1.slideWrap, this$1.options.animateClass);
		}, delay);
	}

	if (this.transform) {
		this.slideWrap.style[this.transform] = 'translate3d(' + offset + 'px, 0, 0)';
	}
	else {
		this.slideWrap.style.left = offset+'px';
	}
};


// ------------------------------------- "helper" functions ------------------------------------- //


/**
	 * Helper function. Calculate modulo of a slides position
	 * @param  {int} val Slide's position
	 * @return {int} the index modulo the # of slides
	 */
Carousel.prototype._loop = function _loop (val) {
	return (this.numSlides + (val % this.numSlides)) % this.numSlides;
};

/**
	 * Update the slides' position on a resize. This is throttled at 300ms
	 * @return {void}
	 */
Carousel.prototype._updateView = function _updateView () {
		var this$1 = this;

	clearTimeout(this.timer);
	this.timer = setTimeout(function () {

		this$1.width = this$1.slides[0].getBoundingClientRect().width;
		this$1.offset = this$1.cloned * this$1.width;
		// const s = this.slides[0];
		// this.width = s.getBoundingClientRect().width +
		// 						parseFloat(window.getComputedStyle(s)['margin-left']) +
		// 						parseFloat(window.getComputedStyle(s)['margin-right']);
		//
		// this.offset = this.cloned * this.width + parseFloat(window.getComputedStyle(s)['margin-left']);

		this$1.go(this$1.current);
	}, 300);
};

/**
	 * Duplicate the first and last N slides so that infinite scrolling can work.
	 * Depends on how many slides are visible at a time, and any outlying slides as well
	 * @return {void}
	 */
Carousel.prototype._cloneSlides = function _cloneSlides () {
		var this$1 = this;

	var duplicate;
	var display = this.options.display;
	var fromEnd = Math.max(this.numSlides - display, 0);
	var fromBeg = Math.min(display, this.numSlides);

	// take "display" slides from the end and add to the beginning
	for (var i = this.numSlides; i > fromEnd; i--) {
		duplicate = this$1.slides[i-1].cloneNode(true);					// cloneNode --> true is deep cloning
		duplicate.removeAttribute('id');
		duplicate.setAttribute('aria-hidden', 'true');
		this$1._addClass(duplicate, 'clone');
		this$1.slideWrap.insertBefore(duplicate, this$1.slideWrap.firstChild);// "prependChild"
		this$1.cloned++;
	}

	// take "display" slides from the beginning and add to the end
	for (var i$1 = 0; i$1 < fromBeg; i$1++) {
		duplicate = this$1.slides[i$1].cloneNode(true);
		duplicate.removeAttribute('id');
		duplicate.setAttribute('aria-hidden', 'true');
		this$1._addClass(duplicate, 'clone');
		this$1.slideWrap.appendChild(duplicate);
	}
};

/**
	 * Helper function to add a class to an element
	 * @param  {int} i    Index of the slide to add a class to
	 * @param  {string} name Class name
	 * @return {void}
	 */
Carousel.prototype._addClass = function _addClass (el, name) {
	if (el.classList) { el.classList.add(name); }
	else {el.className += ' ' + name; }
};

/**
	 * Helper function to remove a class from an element
	 * @param  {int} i    Index of the slide to remove class from
	 * @param  {string} name Class name
	 * @return {void}
	 */
Carousel.prototype._removeClass = function _removeClass (el, name) {
	if (el.classList) { el.classList.remove(name); }
	else { el.className = el.className.replace(new RegExp('(^|\\b)' + name.split(' ').join('|') + '(\\b|$)', 'gi'), ' '); }
};

export default Carousel;