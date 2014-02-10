/*
 * flexicarousel: Adds keyboard commands to control nav
 * https://github.com/apathetic/flexicarousel
 *
 * Copyright (c) 2013 Wes Hatch
 * Licensed under the MIT license.
 */

(function($) {

	var methods = {
				addKeys: function(){
					console.log('adding keys');
					var carousel = $(this);
					$(document).on('keydown', function(e) {					// TODO this will trigger all carousels....
						if( e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 190 ){
							e.preventDefault();
							carousel.carousel('prev');
						}
						if( e.keyCode === 39 || e.keyCode === 40 || e.keyCode === 188 ){
							e.preventDefault();
							carousel.carousel('next');
						}
					});

				}
			};

	$.extend( $.fn.carousel.prototype, methods );

	$.fn.carousel.prototype.register(function(){
		$(this).carousel('addKeys');
	});

}(jQuery));
