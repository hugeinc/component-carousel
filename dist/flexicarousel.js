/*! Flexicarousel - v0.1.0 - 2013-04-18
* https://github.com/apathetic/flexicarousel
* Copyright (c) 2013 Wes Hatch; Licensed MIT */

(function($) {

	var pluginName = 'carousel',
		transitionAttr = 'data-transition',
		transClass = 'trans',
		outClass = 'out',
		activeClass = 'active',
		beforeClass = 'before',
		afterClass = 'after',
		slide = 'li',
		slides,
		nav,
		speed = 400,
		cssTransitionsSupport = (function(){
			var prefixes = 'webkit Moz O Ms'.split( ' ' ),
				supported = false,
				property;

			while( prefixes.length ){
				property = prefixes.shift() + 'Transition';

				if ( property in document.documentElement.style !== undefined && property in document.documentElement.style !== false ) {
					supported = true;
					break;
				}
			}
			return supported;
		}()),

		methods = {
			init: function(){
				// opts = $.extend({}, $.fn.pullQuote.options, opts);		// TODO better option handling

				slides = $(this).find(slide);

				$( this ).trigger( pluginName + '.beforecreate' );
				$( this )[ pluginName ]( 'addNav' );

				slides.eq(0).addClass( activeClass );

				// only care about transitions if there is one defined to use
				var trans = $( this ).attr( transitionAttr );
				// var trans = trans.split(',');		// TODO multiple transitions possible

				if( !trans ){ cssTransitionsSupport = false; }

				$( this ).addClass( pluginName + ' ' + ( trans ? pluginName + '-' + trans : '' ) + ' ' );

				return $( this );

			},

			next: function(){
				$( this )[ pluginName ]( 'go', 1 );
			},

			prev: function(){
				$( this )[ pluginName ]( 'go', -1 );
			},

			go: function( offset ){

				if ( $( this ).find( '.' + transClass ).length ) { return; }	// you wait. TODO

				var $from = $( this ).find( '.' + activeClass ),
					$to = slides.eq( $from.index() + offset );

				if ( !$to.length ){
					$to = slides.eq(0);
				}

				// position the slide we're going to
				$to.addClass( ( offset < 0 ? beforeClass : afterClass ) );
				$to[0].offsetHeight;				// force a redraw to position this element. *Important*

				if( cssTransitionsSupport ){
					$(this)[ pluginName ]( 'transitionStart', $from, $to );
				} else {
					$(this)[ pluginName ]( 'transitionEnd', $from, $to );
				}

				// added to allow pagination to track
				$(this).trigger( pluginName + '.go', $from, $to );
			},

			update: function(){
				return $(this).trigger( pluginName + '.update' );
			},

			transitionStart: function( $from, $to ){
				var $self = $(this);

				$to.one('transitionend webkitTransitionEnd OTransitionEnd', function() {
					$self[ pluginName ]( 'transitionEnd', $from, $to );
				});
// setTimeout(function(){
// $self[ pluginName ]( 'transitionEnd', $from, $to );
// }, 500);

				$from.addClass( outClass );
				$to.addClass( transClass );
			},

			transitionEnd: function( $from, $to ){
				// clean up children
				slides.removeClass( [ beforeClass, afterClass, transClass ].join( ' ' ) );

				$to.addClass( activeClass );

				// $from.removeClass( [ activeClass, outClass ].join( ' ' ) );
				$from.removeClass( activeClass );
				$from.removeClass( outClass );
			},

			bindEventListeners: function(){
				var $self = $( this )
					.bind( 'click', function( e ){
						var target = $( e.target ).closest( 'a[href="#next"], a[href="#prev"]' );
						if( target.length ){
							$self[ pluginName ]( target.is( '[href="#next"]' ) ? 'next' : 'prev' );
							e.preventDefault();
						}
					});

				// $((curr - scroll < 0 && prev) || (curr + scroll > items - visible && next) || []).addClass('disabled');

				return this;
			},

			addNav: function(){
				return $( this )
					.append( '<nav><a href="#prev" class="prev" aria-hidden="true">Prev</a><a href="#next" class="next" aria-hidden="true">Next</a></nav>' )
					[ pluginName ]( 'bindEventListeners' );
			},

			destroy: function(){
				// TODO
			}
		};


	$.fn.carousel = function( method ) {
		if ( methods[method] ) {
			// return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
			return $.fn[ pluginName ].prototype[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		}

		// don't re-init
		if( $(this).data('init') ){
			return $(this);
		}

		// otherwise, engage thrusters
		if ( typeof method === 'object' || ! method ) {
			$(this).data('init', true);
			// return methods.init.apply( this, arguments );
			return $.fn[ pluginName ].prototype.init.apply( this, arguments );
		}
		
		$.error( 'Method "' +  method + '" does not exist on ye olde carousel' );
	};

	// add methods
	// .... why? methods are already accessible from within closure
	// ==> if we want to extend the plugin with additional funcitonality, we need to make the element accessible
	$.extend( $.fn[ pluginName ].prototype, methods ); 

}(jQuery));
