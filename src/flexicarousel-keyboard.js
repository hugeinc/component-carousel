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

	$(function(){
		$('body').on( 'init.carousel', function(e, carousel) {
			$(carousel).carousel('addKeys');
		});
	});

}(jQuery));
