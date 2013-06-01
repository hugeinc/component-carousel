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

(function($) {

	// from: http://www.modernizr.com
	var transitionSupport = (function(){
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
		inClass, activeClass, beforeClass, afterClass,
		methods = {
			init: function( opts ){

				var trans,
					optsAttr = $(this).attr('data-options');

				eval('var data='+optsAttr);

				this.options = $.extend( 
					{}, 
					$.fn.carousel.defaults, 
					data,
					opts
				);

				trans = this.options.transition;
				slides = $(this).find(this.options.slide);
				if (!slides.length) { console.log('Carousel: no slides found'); return; }

				// give these greater scope to simplify our lives
				inClass = this.options.inClass;
				activeClass = this.options.activeClass;
                beforeClass = this.options.beforeClass;
                afterClass = this.options.afterClass;

				slides.eq(0).addClass( activeClass );
				
				// var trans = trans.split(',');				// TODO multiple transitions possible
				if( !trans ){ transitionSupport = false; }

				$(this).carousel( 'setupNavigation' );
				// $(this).carousel( 'autoRotate', this.options.autoRotate );
				$(this).addClass( 'carousel ' + ( trans ? 'carousel-' + trans : '' ) );

				$(this).trigger( 'init.carousel', this );		// for binding additional functionality
																// we attach the event to the body so that 

				return $(this);

			},

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
      if (this.$element.find('.next, .prev').length && transitionSupport) {
        this.$element.trigger(transitionSupport.end)
        this.cycle(true)
      }
      clearInterval(this.interval)
      this.interval = null
      return this
    },

			next: function(){
				$( this ).carousel( 'go', current + 1 );
			},

			prev: function(){
				$( this ).carousel( 'go', current - 1 );
			},

			go: function( to ){

				var $from,
					$to,
					n = slides.length;

				if ( $(this).find( '.' + inClass ).length ) { return; }			// you wait. TODO
				// if(this.sliding) return;

				if (this.options.infinite) {
					to = ((to % n) + n) % n;									// because of js % bug
				} else {
					if (to > (slides.length - 1) || to < 0) return
				}

				$from = $(this).find( '.' + activeClass );
				$to = slides.eq(to);
				$to.addClass( ( to < current ? beforeClass : afterClass ) );	// position the slide we're going to


      // if (this.$indicators.length) {
      //   this.$indicators.find('.active').removeClass('active')
      //   this.$element.one('slid', function () {
      //     var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()])
      //     $nextIndicator && $nextIndicator.addClass('active')
      //   })
      // }


				this.sliding = true;
				current = to;

				if( transitionSupport ){
					$(this).carousel( 'transitionStart', $from, $to );
				} else {
					$(this).carousel( 'transitionEnd', $from, $to );
				}

				// added to allow pagination to track
				$(this).trigger( 'go.carousel', $to );
			},

			transitionStart: function( $from, $to ){
				var $self = $(this);

				/*jsl:ignore*/
				$to[0].offsetWidth;											// force a redraw to position this element. *Important*
				/*jsl:end*/

				$to.one( transitionSupport.end, function() {
					$self.carousel( 'transitionEnd', $from, $to );
				});

				$to.addClass( inClass );
			},

			transitionEnd: function( $from, $to ){
				this.sliding = false;
				$to.removeClass( [ inClass, beforeClass, afterClass ].join( ' ' ) );
				$to.addClass( activeClass );
				$from.removeClass( activeClass );
				$(this).trigger('slid');
			},

			setupNavigation: function(){
				var $self = $(this),
					nav,
					indicators = $(this).find(this.options.indicators);

				if ( nav = $(this).find(this.options.nav) ) {		// note: assignment
					nav.find('.prev').bind('click', function(e){
						e.preventDefault();
						$self.carousel('prev');
					});
					nav.find('.next').bind('click', function(e){
						e.preventDefault();
						$self.carousel('next');
					});
				}
				return $(this);
			},

			destroy: function(){
				// TODO
			}
		};


	$.fn.carousel = function( method ) {
		var args = arguments,
			fn = this;

		return this.each(function() {

			// check if method exists
			if (method in $.fn.carousel.prototype) {		// if ( typeof $.fn.carousel.prototype[ method ] == 'function' ) {
				console.log( method, args );
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
		// outClass: 'out',
		activeClass: 'active',
		beforeClass: 'before',
		afterClass: 'after',
		indicators: 'indicators',
		speed: 400,
		slide: 'ul li',
		infinite: true,
		autoRotate: false,
		nav: false
	};


	// add methods
	// Q.  Why? methods are already accessible from within this closure
	// A.  if we want to extend the plugin with additional functionality, we need to make the element accessible
	$.extend( $.fn.carousel.prototype, methods ); 

}(jQuery));
