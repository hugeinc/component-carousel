/*
 * flexicarousel
 * https://github.com/apathetic/flexicarousel
 *
 * Copyright (c) 2013 Wes Hatch
 * Licensed under the MIT license.
 *
 * Inspired in part by: responsive-carousel, (c) 2012 Filament Group, Inc.
 * https://github.com/filamentgroup/responsive-carousel
 */

/*jslint debug: true, evil: false, devel: true*/


// TODO make jquery agnostic

(function($) {




	// TODO: optionify:
// 	var inClass = 'in',
// 			outClass = 'out',
// 			activeClass = 'active',
// 			beforeClass = 'before',
// 			afterClass = 'after',
// 			// speed = 400,		// set in css
// 			slide = 'li',
// 			continuous = true;
// // ---------------------

  // var browser = {
  //   addEventListener: !!window.addEventListener,
  //   touch: ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch,
  //   transitions: (function(temp) {
  //     var props = ['transitionProperty', 'WebkitTransition', 'MozTransition', 'OTransition', 'msTransition'];
  //     for ( var i in props ) if (temp.style[ props[i] ] !== undefined) return true;
  //     return false;
  //   })(document.createElement('swipe'))
  // };



	// from: http://www.modernizr.com
	var transitions = (function(){
		var transitionEnd = (function(){
			var t,
				el = document.createElement('fake'),
				transitions = {
				'transition': 'transitionend',
				'OTransition': 'oTransitionEnd otransitionend',
				'MozTransition': 'transitionend',
				'WebkitTransition': 'webkitTransitionEnd'
			};

			for(t in transitions){
				if( el.style[t] !== undefined ){
					return transitions[t];
				}
			}
		}());

		return transitionEnd && {end: transitionEnd}
	})();


	var current = 0,
			slides,
			sliding = false,
			inClass, activeClass, beforeClass, afterClass,
			registrationCallbacks = [];


	var methods = {
		init: function( opts ){

			var trans;
					optsAttr = $(this).attr('data-options');
			// var data;

			eval('var data='+optsAttr);
			this.options = $.extend( {}, $.fn.carousel.defaults, data, opts );

			trans = this.options.transition;
			slides = $(this).find(this.options.slide);
			if (!slides.length) { console.log('flexicarousel: no slides found'); return; }

			// put these into closure to simplify our lives
			inClass = this.options.inClass;
			activeClass = this.options.activeClass;
			beforeClass = this.options.beforeClass;
			afterClass = this.options.afterClass;

			slides.eq(0).addClass( activeClass );

			// var trans = trans.split(',');		// TODO make multiple transitions possible
			if( !trans ){ transitions = false; }

			$(this).addClass( 'carousel ' + ( trans ? 'carousel-' + trans : '' ) );
			$(this).trigger( 'init.carousel', this );		// useful for binding additional functionality

			for (var i = 0; i < registrationCallbacks.length; i++) {
				registrationCallbacks[i].call(this);
			}

			return $(this);
		},

/*
		autoRotate: function( rotate ) {
			if (rotate) {
				var self = this;
				this.timer = setInterval(function(){
					$(self).carousel('next');
				}, 5000);
			} else {
				clearTimeout(this.timer);
			}
		},

		pause: function (e) {
			if (!e) this.paused = true
			if (this.$element.find('.next, .prev').length && transitions) {
				this.$element.trigger(transitions.end)
				this.cycle(true)
			}
			clearInterval(this.interval)
			this.interval = null
			return this
		},
*/
		next: function(){
			$( this ).carousel( 'go', current + 1);
		},

		prev: function(){
			$( this ).carousel( 'go', current - 1);
		},

		go: function( to ){

			var direction,
					$from,
					$to;


      // determine direction:  1: backward, -1: forward
      direction = Math.abs(current - to) / (current - to);

      // check bounds
      if (this.options.infinite) {
				to = (slides.length + (to % slides.length)) % slides.length;
			} else {
				to = Math.max( Math.min(slides.length-1, to), 0);
			}

      if (to == current || sliding) { return; }

			$from = slides.eq(current),
			$to = slides.eq(to);

			$to.addClass( ( direction > 0 ? beforeClass : afterClass ) );

			if( transitions ){
				$(this).carousel( 'transitionStart', $from, $to );
			} else {
				$(this).carousel( 'transitionEnd', $from, $to );
			}

			$(this).trigger( 'go.carousel', to );
			current = to;
		},

		transitionStart: function( $from, $to ){
			var $self = $(this);

			sliding  = true;

			/*jsl:ignore*/
			$to[0].offsetHeight;				// force a repaint to position this element. *Important*
			/*jsl:end*/

			$to.one( transitions.end, function() {
				$self.carousel( 'transitionEnd', $from, $to );
			});

			$from.addClass( outClass );
			$to.addClass( inClass );


			// $to[0].offsetHeight;				// force a repaint to position this element. *Important*

		},

		transitionEnd: function( $from, $to ){
			$from.removeClass( [ activeClass, outClass ].join( ' ' ) );
			$to.removeClass( [ beforeClass, afterClass, inClass ].join( ' ' ) );
			$to.addClass( activeClass );
			sliding  = false;
			$(this).trigger('slid');
		},

		destroy: function(){
			// TODO
		},

		register: function( callback ){
			registrationCallbacks.push(callback);
		}

	};


	$.fn.carousel = function( method ) {
		var args = arguments,
				fn = this;

		return this.each(function() {

			// check if method exists
			if (method in $.fn.carousel.prototype) {		// if ( typeof $.fn.carousel.prototype[ method ] == 'function' ) {
				// console.log( method, args );
				return $.fn.carousel.prototype[ method ].apply( this, Array.prototype.slice.call( args, 1 ));
			}

			// if no method found and already init'd
			if( $(this).data('init') ){
				$.error( 'Method "' +  method + '" does not exist on ye olde carousel' );
				return $(this);
			}

			// otherwise, engage thrusters
			if ( typeof method === 'object' || ! method ) {
				$(this).data('init', true);

				// return methods.init.apply( this, args );
				return $.fn.carousel.prototype.init.apply( this, args );
			}

		});
	};

	// options  // TODO use these
	$.fn.carousel.defaults = {
		inClass: 'in',
		outClass: 'out',
		activeClass: 'active',
		beforeClass: 'before',
		afterClass: 'after',
		// indicators: 'indicators',
		// speed: 400,
		slide: 'ul li',
		infinite: true,
		autoRotate: false,
	};


	// add methods
	// Q.  Why? methods are already accessible from within this closure
	// A.  if we want to extend the plugin with additional functionality, we need to make the element accessible
	$.extend( $.fn.carousel.prototype, methods );

}(jQuery));
