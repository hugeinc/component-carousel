/*
 * flexicarousel: Adds pagination
 * https://github.com/apathetic/flexicarousel
 *
 * Copyright (c) 2013 Wes Hatch
 * Licensed under the MIT license.
 */

/*jslint debug: true, evil: false, devel: true*/

(function($) {
	
	var numSlides,
		paging,
		methods = {
			paginate: function(to) {						// ???? I'm passing a jquery obj here, but comes through as HTMLElement ????
				var index = $(to).index() + 1;
				paging.html( index +' / '+ numSlides );
			},
			// paginate: function(index){
			//	paging.html( (index+1) +' / '+ numSlides );
			// },
			jump: function(to) {
				
			}
		};

	$.extend( $.fn.carousel.prototype, methods ); 

	// wait for the DOM to be assembled before we attach our event listener to it
	$(function(){

		// we listen to the body since we don't necessarily know where the event 
		// was attached. It will bubble up.
		$('body').on( 'init.carousel', function(e, carousel) {
			console.log('adding pagination listener to', carousel);

			numSlides = $(carousel).find(carousel.options.slide).length;
			paging = $(carousel).find('.paging');
			if (!paging.length) {
				paging = $('<span class="paging"></span>').prependTo( $(carousel).find('nav') );
			}
			paging.html( '1 / ' + numSlides);

			// $(carousel).on( 'go.carousel', $(carousel).carousel('paginate') );	// carousel carousels carouse carousellily
			$(carousel).on( 'go.carousel', function(to) {

				// clearTimeout();

				// $(this).carousel('paginate', Array.prototype.slice.call(arguments, 1) );	// slice off the event, which is 1st in the arguments
				$(this).carousel('paginate', arguments[1]);			// update: only pass the current index
			});
		});
	
	});


}(jQuery));
