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

	// TODO: optionify:
	var transClass = 'trans',
		outClass = 'out',
		activeClass = 'active',
		beforeClass = 'before',
		afterClass = 'after',
		speed = 400,
		slide = 'li';
// ---------------------


	var current = 0,
		slides,
		cssTransitionsSupport,
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
					cssTransitionsSupport = true;
					return transitions[t];
				}
			}
		}()),
		methods = {
			init: function( opts ){
				this.options = $.extend( {}, $.fn.carousel.options, opts );			// we can override options both globally and on a per-call level

				slides = $(this).find(slide);
				if (!slides.length) { console.log('Carousel: no slides found'); return; }
				slides.eq(0).addClass( activeClass );

				// only care about transitions if there is one defined to use
				var trans = $( this ).attr( 'data-transition' );
				// var trans = trans.split(',');		// TODO multiple transitions possible
				if( !trans ){ cssTransitionsSupport = false; }

				$(this).carousel( 'addNav' );
				$(this).addClass( 'carousel ' + ( trans ? 'carousel-' + trans : '' ) );

				$(this).trigger( 'init.carousel', this );		// useful for binding additional functionality
																// we attach the event to the body so that 

				return $(this);

			},

			next: function(){
				$( this ).carousel( 'go', 1); // ++current );
			},

			prev: function(){
				$( this ).carousel( 'go', -1); // --current );
			},

			go: function( offset ){

				if ( $(this).find( '.' + transClass ).length ) { return; }	// you wait. TODO

				// offset %= slides.length;			// keep within bounds for infinite scrolling

				var $from = $(this).find( '.' + activeClass ),
					$to = slides.eq( $from.index() + offset );
					// $to = slides.eq(offset);

				if ( !$to.length ){
					$to = slides.eq(0);				// because slides.eq(-1) will automatically grab last one
				}

				// position the slide we're going to
				$to.addClass( ( offset < 0 ? beforeClass : afterClass ) );
													/*jsl:ignore*/
				$to[0].offsetHeight;				// force a redraw to position this element. *Important*
													/*jsl:end*/
				if( cssTransitionsSupport ){
					$(this).carousel( 'transitionStart', $from, $to );
				} else {
					$(this).carousel( 'transitionEnd', $from, $to );
				}

				// added to allow pagination to track
				$(this).trigger( 'go.carousel', $to );
				// $(this).trigger( 'go.carousel', $from.index()+offset );
			},

			update: function(){
				return $(this).trigger( 'update.carousel' );
			},

			transitionStart: function( $from, $to ){
				var $self = $(this);


				// $to.one('transitionend_ webkitTransitionEnd OTransitionEnd', function() {
				$to.one( transitionEnd, function() {
					$self.carousel( 'transitionEnd', $from, $to );
				});

// setTimeout(function(){
// $self[ pluginName ]( 'transitionEnd', $from, $to );
// }, 1000);

				$from.addClass( outClass );
				$to.addClass( transClass );
			},

			transitionEnd: function( $from, $to ){
				// clean up children
				slides.removeClass( [ beforeClass, afterClass, transClass ].join( ' ' ) );

				$to.addClass( activeClass );

				$from.removeClass( [ activeClass, outClass ].join( ' ' ) );
				$from.removeClass( outClass );
			},

			addNav: function(){
				var $self = $(this),
					nav,
					prev,
					next;

				if (!this.options.nav){
					nav = $('<nav></nav>');
					prev = $('<a href="#prev" class="prev" aria-hidden="true">Prev</a>');
					next = $('<a href="#next" class="next" aria-hidden="true">Next</a>');
					$(this).append(nav.append(prev).append(next));
				} else {
					nav = this.options.nav;
					next = nav.find('.next');
					prev = nav.find('.prev');
				}

				prev.bind('click', function(e){
					e.preventDefault();
					$self.carousel('prev');
				});
				next.bind('click', function(e){
					e.preventDefault();
					$self.carousel('next');
				});

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

				// store a reference to each carousel
				// $.fn.carousel.instances.push(this);

				// return methods.init.apply( this, args );
				return $.fn.carousel.prototype.init.apply( this, args );
			}

		});
	};

	// options  // TODO use these
	$.fn.carousel.options = {
		transClass: 'trans',
		outClass: 'out',
		activeClass: 'active',
		beforeClass: 'before',
		afterClass: 'after',
		speed: 400,
		slide: 'li',
		nav: false
	};

	// store a reference to all carousels on the plugin itself
	// $.fn.carousel.instances = [];

	// add methods
	// Q.  Why? methods are already accessible from within this closure
	// A.  if we want to extend the plugin with additional functionality, we need to make the element accessible
	$.extend( $.fn.carousel.prototype, methods ); 

}(jQuery));
