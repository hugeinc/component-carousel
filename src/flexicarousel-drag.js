/*
 * flexicarousel
 * https://github.com/apathetic/flexicarousel
 *
 * Copyright (c) 2013 Wes Hatch
 * Licensed under the MIT license.
 */

/*jslint debug: true, evil: false, devel: true*/

(function($) {

/*
http://mobile.smashingmagazine.com/2012/06/21/play-with-hardware-accelerated-css/
*/

	var sliding = 0,
		startClientX = 0,
		startPixelOffset = 0,
		pixelOffset = 0,
		currentSlide = 0,
		methods = {
			slideStart: function(event) {
				console.log('start:',event);
				if (event.originalEvent.touches) {				// separate clicks from touches...?
					event = event.originalEvent.touches[0];
				}
				if (sliding === 0) {
					sliding = 1;
					startClientX = event.clientX;
				}
			},

			slide: function(event) {
				console.log('move:',event);
				event.preventDefault();
				if (event.originalEvent.touches) {
					event = event.originalEvent.touches[0];
				}
				var deltaSlide = event.clientX - startClientX;

				if (sliding === 1 && deltaSlide !== 0) {
					sliding = 2;
					startPixelOffset = pixelOffset;
				}

				if (sliding === 2) {
					var touchPixelRatio = 1;
					if ((currentSlide === 0 && event.clientX > startClientX)
						// || (currentSlide === slideCount - 1 && event.clientX < startClientX)
						) {
						touchPixelRatio = 3;
					}

					pixelOffset = startPixelOffset + deltaSlide / touchPixelRatio;
					$('#slides').css('transform', 'translate3d(' + pixelOffset + 'px,0,0)').removeClass();
				}
			},

			slideEnd: function(event) {
				console.log('end:',event);
				if (sliding === 2) {
					sliding = 0;
					currentSlide = pixelOffset < startPixelOffset ? currentSlide + 1 : currentSlide - 1;
					// ...
				}
			}

		};

	$.extend( $.fn.carousel.prototype, methods ); 

	$(function(){
		$('body').on( 'init.carousel', function(e, carousel) {

			$(carousel).on('mousedown', function() {
				$(this).carousel('slideStart');
			});
		

			//	$(e.target).on({
			//		'mousedown touchstart': $(this).carousel('slideStart'),		// $(this).carousel.prototype.slideStart.apply( this, e )
			//		'mouseup touchend': slideEnd,
			//		'mousemove touchmove': slide
			//	});



			//	var carousels = $.fn.carousel.instances;
			//	$.each(carousels, function(i, carousel) {
			//		$(carousel).on({
			//			'mousedown touchstart': slideStart,
			//			'mouseup touchend': slideEnd,
			//			'mousemove touchmove': slide
			//		});
			//	});

		});
	});

}(jQuery));








/*

 https://github.com/filamentgroup/responsive-carousel


	var pluginName = "carousel",
		initSelector = "." + pluginName,
		activeClass = pluginName + "-active",
		itemClass = pluginName + "-item",
		dragThreshold = function( deltaX ){
			return Math.abs( deltaX ) > 4;
		},
		getActiveSlides = function( $carousel, deltaX ){
			var $from = $carousel.find( "." + pluginName + "-active" ),
				activeNum = $from.prevAll().length + 1,
				forward = deltaX < 0,
				nextNum = activeNum + (forward ? 1 : -1),
				$to = $carousel.find( "." + itemClass ).eq( nextNum - 1 );
				
			if( !$to.length ){
				$to = $carousel.find( "." + itemClass )[ forward ? "first" : "last" ]();
			}
			
			return [ $from, $to ];
		};
		
	// Touch handling
	$( initSelector )
		.on( "dragmove", function( e, data ){

			if( !dragThreshold( data.deltaX ) ){
				return;
			}
			var activeSlides = getActiveSlides( $( this ), data.deltaX );
			
			activeSlides[ 0 ].css( "left", data.deltaX + "px" );
			activeSlides[ 1 ].css( "left", data.deltaX < 0 ? data.w + data.deltaX + "px" : -data.w + data.deltaX + "px" );
		} )
		.on( "dragend", function( e, data ){
			if( !dragThreshold( data.deltaX ) ){
				return;
			}
			var activeSlides = getActiveSlides( $( this ), data.deltaX ),
				newSlide = Math.abs( data.deltaX ) > 45;
			
			$( this ).one( navigator.userAgent.indexOf( "AppleWebKit" ) ? "webkitTransitionEnd" : "transitionEnd", function(){
				activeSlides[ 0 ].add( activeSlides[ 1 ] ).css( "left", "" );
				$( this ).trigger( "goto." + pluginName, activeSlides[ 1 ] );
			});			
				
			if( newSlide ){
				activeSlides[ 0 ].removeClass( activeClass ).css( "left", data.deltaX > 0 ? data.w  + "px" : -data.w  + "px" );
				activeSlides[ 1 ].addClass( activeClass ).css( "left", 0 );
			}
			else {
				activeSlides[ 0 ].css( "left", 0);
				activeSlides[ 1 ].css( "left", data.deltaX > 0 ? -data.w  + "px" : data.w  + "px" );	
			}
		} );
	
*/

