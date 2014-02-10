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
		deltaSlide,
		startClientX = 0,
		startPixelOffset = 0,
		pixelOffset = 0,
		currentSlide = 0,

		methods = {
			dragStart: function(e) {
				if (e.originalEvent.touches) {				// separate clicks from touches...?
					e = e.originalEvent.touches[0];
				}
				if (sliding === 0) {
					sliding = 1;
					startClientX = e.clientX;
				}
			},

			drag: function(e) {

				e.preventDefault();

				if (e.originalEvent.touches) {
					e = e.originalEvent.touches[0];
				}

				deltaSlide = e.clientX - startClientX;

				if (sliding && deltaSlide !== 0) {
					startPixelOffset = pixelOffset;

				console.log(deltaSlide);


					var touchPixelRatio = 1;
					if ((currentSlide === 0 && e.clientX > startClientX)
						// || (currentSlide === slideCount - 1 && e.clientX < startClientX)
						) {
						touchPixelRatio = 3;
					}

					pixelOffset = startPixelOffset + deltaSlide / touchPixelRatio;
					$('#slides').css('transform', 'translate3d(' + pixelOffset + 'px,0,0)').removeClass();

				}

			},

			dragEnd: function(e) {
					sliding = 0;
					currentSlide = pixelOffset < startPixelOffset ? currentSlide + 1 : currentSlide - 1;
					// ...
			}

		};

	$.extend( $.fn.carousel.prototype, methods );

	// register setup of touch functionality
	$.fn.carousel.prototype.register(function(){

		$(this).on({
			'mousedown touchstart':	methods.dragStart,
			'mousemove touchmove':	methods.drag,
			'mouseup touchend':			methods.dragEnd
		});

	});

}(jQuery));


