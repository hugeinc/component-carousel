
export default class Carousel {

  constructor(container, options={}) {

    this.handle = container;

    // default options
    this.options = {
      animateClass: 'animate',
      activeClass: 'active',
      slideWrap: 'ul',
      slides: 'li',           // the slides
      infinite: true,         // infinite scrolling or not
      display: 1,             // the minimum # of slides to display at a time. If you want to have slides
                              // "hanging" off outside the currently viewable ones, they'd be included here.
      disableDragging: false, // only use API to navigate
      initialIndex: 0         // slide index where the carousel should start
    };

    // state vars
    this.current = 0;
    this.slides = [];
    this.sliding = false;
    this.cloned = 0;
    this.active = true;

    // touch vars
    this.dragging = false;
    this.dragThreshold = 50;
    this.deltaX = 0;

    // feature detection
    this.isTouch = 'ontouchend' in document;
    ['transform', 'webkitTransform', 'MozTransform', 'OTransform', 'msTransform'].forEach((t) => {
      if (document.body.style[t] !== undefined) { this.transform = t; }
    });

    // set up options
    this.options = Object.assign(this.options, options);

    // engage engines
    this.init();
  }

  /**
   * Initialize the carousel and set some defaults
   * @param  {object} options List of key: value options
   * @return {void}
   */
  init() {
    this.slideWrap = this.handle.querySelector(this.options.slideWrap);
    this.slides = this.slideWrap.querySelectorAll(this.options.slides);
    this.numSlides = this.slides.length;
    this.current = this.options.initialIndex;

    if (!this.slideWrap || !this.slides || this.numSlides < this.options.display) { console.log('Carousel: insufficient # slides'); return this.active = false; }
    if (this.options.infinite) { this._cloneSlides(); }

    this._createBindings();
    this._getDimensions();
    this.go(this.current, false);

    if (!this.options.disableDragging) {
      if (this.isTouch) {
        ['touchstart', 'touchmove', 'touchend', 'touchcancel'].map((event) => {
          this.handle.addEventListener(event, this._bindings[event]);
        });
      } else {
        ['mousedown', 'mousemove', 'mouseup', 'mouseleave', 'click'].map((event) => {
          this.handle.addEventListener(event, this._bindings[event]);
        });
      }
    }

    window.addEventListener('resize', this._bindings['resize']);
    window.addEventListener('orientationchange', this._bindings['orientationchange']);

    return this;
  }

  /**
   * Removes all event bindings.
   * @returns {Carousel}
   */
  destroy() {
    for (let event in this._bindings) {
      this.handle.removeEventListener(event, this._bindings[event]);
    }

    window.removeEventListener('resize', this._bindings['resize']);
    window.removeEventListener('orientationchange', this._bindings['orientationchange']);

    this._bindings = null;
    this.options = this.slides = this.slideWrap = this.handle = null;
    this.active = false;

    // remove classes ...
    // remove clones ...
  }

  /**
   * Go to the next slide
   * @return {void}
   */
  next() {
    if (this.options.infinite || this.current !== this.numSlides-1) {
      this.go(this.current + 1);
    } else {
      this.go(this.numSlides-1);
    }
  }

  /**
   * Go to the previous slide
   * @return {void}
   */
  prev() {
    if (this.options.infinite || this.current !== 0) {
      this.go(this.current - 1);
    } else {
      this.go(0);    // allow the slide to "snap" back if dragging and not infinite
    }
  }

  /**
   * Go to a particular slide. Prime the "to" slide by positioning it, and then calling _slide() if needed
   * @param  {int} to    the slide to go to
   * @return {void}
   */
  go(to, animate = true) {
    const opts = this.options;

    if (this.sliding || !this.active) { return; }

    if (to < 0 || to >= this.numSlides) {                             // position the carousel if infinite and at end of bounds
      let temp = (to < 0) ? this.current + this.numSlides : this.current - this.numSlides;
      this._slide( -(temp * this.width - this.deltaX) );
      this.slideWrap.offsetHeight;                                    // force a repaint to actually position "to" slide. *Important*
    }

    to = this._loop(to);
    this._slide( -(to * this.width), animate );

    if (opts.onSlide && to !== this.current) { opts.onSlide.call(this, to, this.current); }  // note: doesn't check if it's a function

    this._removeClass(this.slides[this.current], opts.activeClass);
    this._addClass(this.slides[to], opts.activeClass);
    this.current = to;
  }

  // ----------------------------------- Event Listeners ----------------------------------- //

  /**
   * Create references to all bound Events so that they may be removed upon destroy()
   * @return {void}
   */
  _createBindings() {
    this._bindings = {
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
  }

  // ------------------------------------- Drag Events ------------------------------------- //

  
  _checkDragThreshold(e) {
    if (this.dragThresholdMet) {
      e.preventDefault();
    }
  }

  /**
   * Start dragging (via touch)
   * @param  {event} e Touch event
   * @return {void}
   */
  _dragStart(e) {
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
    this.deltaX = 0;  // reset for the case when user does 0,0 touch
    this.deltaY = 0;  // reset for the case when user does 0,0 touch

    if (e.target.tagName === 'IMG' || e.target.tagName === 'A') { e.target.draggable = false; }
  }

  /**
   * Update slides positions according to user's touch
   * @param  {event} e Touch event
   * @return {void}
   */
  _drag(e) {
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
    this.dragThresholdMet = Math.abs(this.deltaX) > this.dragThreshold;
  }

  /**
   * Drag end, calculate slides' new positions
   * @param  {event} e Touch event
   * @return {void}
   */
  _dragEnd(e) {
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
      // var jump = Math.round(this.deltaX / this.width);  // distance-based check to swipe multiple slides
      // this.go(this.current - jump);
      this.prev();
    }
    else if ( this.deltaX < 0 ) {
      this.next();
    }

    this.deltaX = 0;
  }


  // ------------------------------------- carousel engine ------------------------------------- //


  /**
   * Applies the slide translation in browser
   * @param  {number} offset   Where to translate the slide to. 
   * @param  {boolean} animate Whether to animation the transition or not.
   * @return {void}
   */
  _slide(offset, animate) {
    var delay = 400;

    offset -= this.offset;

    if (animate) {
      this.sliding = true;
      this._addClass(this.slideWrap, this.options.animateClass);

      setTimeout(() => {
        this.sliding = false;
        this._removeClass(this.slideWrap, this.options.animateClass);
      }, delay);
    }

    if (this.transform) {
      this.slideWrap.style[this.transform] = 'translate3d(' + offset + 'px, 0, 0)';
    }
    else {
      this.slideWrap.style.left = offset+'px';
    }
  }


  // ------------------------------------- "helper" functions ------------------------------------- //


  /**
   * Helper function. Calculate modulo of a slides position
   * @param  {int} val Slide's position
   * @return {int} the index modulo the # of slides
   */
  _loop(val) {
    return (this.numSlides + (val % this.numSlides)) % this.numSlides;
  }

  /**
   * Set the Carousel's width and determine the slide offset.
   * @return {void}
   */
  _getDimensions() {
    this.width = this.slides[0].getBoundingClientRect().width;
    this.offset = this.cloned * this.width;
  }

  /**
   * Update the slides' position on a resize. This is throttled at 300ms
   * @return {void}
   */
  _updateView() {
    // Check if the resize was horizontal. On touch devices, changing scroll
    // direction will cause the browser tab bar to appear, which triggers a resize
    if (window.innerWidth !== this._viewport) {
      this._viewport = window.innerWidth;
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this._getDimensions();
        this.go(this.current);
      }, 300);
    }
  }

  /**
   * Duplicate the first and last N slides so that infinite scrolling can work.
   * Depends on how many slides are visible at a time, and any outlying slides as well
   * @return {void}
   */
  _cloneSlides() {
    var duplicate;
    var display = this.options.display;
    var fromEnd = Math.max(this.numSlides - display, 0);
    var fromBeg = Math.min(display, this.numSlides);

    // take "display" slides from the end and add to the beginning
    for (let i = this.numSlides; i > fromEnd; i--) {
      duplicate = this.slides[i-1].cloneNode(true);                       // cloneNode --> true is deep cloning
      duplicate.removeAttribute('id');
      duplicate.setAttribute('aria-hidden', 'true');
      this._addClass(duplicate, 'clone');
      this.slideWrap.insertBefore(duplicate, this.slideWrap.firstChild);  // "prependChild"
      this.cloned++;
    }

    // take "display" slides from the beginning and add to the end
    for (let i = 0; i < fromBeg; i++) {
      duplicate = this.slides[i].cloneNode(true);
      duplicate.removeAttribute('id');
      duplicate.setAttribute('aria-hidden', 'true');
      this._addClass(duplicate, 'clone');
      this.slideWrap.appendChild(duplicate);
    }
  }

  /**
   * Helper function to add a class to an element
   * @param  {int} i       Index of the slide to add a class to
   * @param  {string} name Class name
   * @return {void}
   */
  _addClass(el, name) {
    if (el.classList) { el.classList.add(name); }
    else {el.className += ' ' + name; }
  }

  /**
   * Helper function to remove a class from an element
   * @param  {int} i       Index of the slide to remove class from
   * @param  {string} name Class name
   * @return {void}
   */
  _removeClass(el, name) {
    if (el.classList) { el.classList.remove(name); }
    else { el.className = el.className.replace(new RegExp('(^|\\b)' + name.split(' ').join('|') + '(\\b|$)', 'gi'), ' '); }
  }

};
