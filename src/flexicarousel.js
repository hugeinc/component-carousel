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
	var inClass = 'in',
			outClass = 'out',
			activeClass = 'active',
			beforeClass = 'before',
			afterClass = 'after',
			// speed = 400,		// set in css
			slide = 'li',
			continuous = true;
// ---------------------

  // var browser = {
  //   addEventListener: !!window.addEventListener,
  //   touch: ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch,
  //   transitions: (function(temp) {
  //     var props = ['transitionProperty', 'WebkitTransition', 'MozTransition', 'OTransition', 'msTransition'];
  //     for ( var i in props ) if (temp.style[ props[i] ] !== undefined) return true;
  //     return false;
  //   })(document.createElement('swipe'))
  // };




	var current = 0,
			slides,
			sliding = false,
			registrationCallbacks = [],
			transitionSupport,
			transitionEnd = (function(){
				var t,
					el = document.createElement('fakeelement'),
					transitions = {
					'transition': 'transitionend',
					'OTransition': 'oTransitionEnd',
					'MozTransition': 'transitionend',
					'WebkitTransition': 'webkitTransitionEnd'
				};

				for(t in transitions){
					if( el.style[t] !== undefined ){
						transitionSupport = true;
						return transitions[t];
					}
				}
			}()),

		methods = {
			init: function( opts ){

				var trans;
				// var data;

				eval('var data=' + $(this).attr('data-options') );				// one accepted use of eval
				this.options = $.extend( {}, $.fn.carousel.options, data, opts );

				trans = this.options.transition;
				slides = $(this).find(slide);
				// if (!slides.length) { console.log('flexicarousel: no slides found'); return; }

				slides.eq(0).addClass( activeClass );

				// only care about transitions if there is one defined to use
				// var trans = trans.split(',');		// TODO make multiple transitions possible
				if( !trans ){ transitionSupport = false; }

				$(this).addClass( 'carousel ' + ( trans ? 'carousel-' + trans : '' ) );
				$(this).trigger( 'init.carousel', this );		// useful for binding additional functionality

				for (var i = 0; i < registrationCallbacks.length; i++) {
					registrationCallbacks[i].call(this);
				}

				return $(this);
			},

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
	      if (continuous) {
					to = (slides.length + (to % slides.length)) % slides.length;
				} else {
					to = Math.max( Math.min(slides.length-1, to), 0);
				}

	      if (to == current || sliding) { return; }

				$from = slides.eq(current),
				$to = slides.eq(to);

				$to.addClass( ( direction > 0 ? beforeClass : afterClass ) );
				/*jsl:ignore*/
				$to[0].offsetHeight;				// force a repaint to position this element. *Important*
				/*jsl:end*/

				if( transitionSupport ){
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

				$to.one( transitionEnd, function() {
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
			},

			update: function(){
				return $(this).trigger( 'update.carousel' );
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
	$.fn.carousel.options = {
		inClass: 'in',
		outClass: 'out',
		activeClass: 'active',
		beforeClass: 'before',
		afterClass: 'after',
		// speed: 600,	// set in css
		slide: 'li',
		continuous: true
	};


	// add methods
	// Q.  Why? methods are already accessible from within this closure
	// A.  if we want to extend the plugin with additional functionality, we need to make the element accessible
	$.extend( $.fn.carousel.prototype, methods );

}(jQuery));
