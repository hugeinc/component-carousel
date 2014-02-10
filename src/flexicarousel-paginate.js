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

				paginate: function(index){
					paging.html( (index+1) +' / '+ numSlides );
				},


			// addNav: function(){
			// 	var $self = $(this),
			// 		nav,
			// 		prev,
			// 		next;

			// 	if ( this.options.nav || $(this).find('nav').length ){
			// 		nav = this.options.nav || $(this).find('nav');
			// 		next = nav.find('.next');
			// 		prev = nav.find('.prev');
			// 	}

			// 	prev.bind('click', function(e){
			// 		e.preventDefault();
			// 		$self.carousel('prev');
			// 	});
			// 	next.bind('click', function(e){
			// 		e.preventDefault();
			// 		$self.carousel('next');
			// 	});

			// 	return $(this);
			// },


			setupNavigation: function(){
				var $self = $(this),
						nav = $(this).find(this.options.nav),
						indicators = $(this).find(this.options.indicators);

				if ( nav ) {
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


			jump: function(to) {

			}
		};

	$.extend( $.fn.carousel.prototype, methods );

	$.fn.carousel.prototype.register(function(){

			// slightly redundant; this already calculated in core
			numSlides = $(this).find(this.options.slide).length;
			paging = $(this).find('.paging');

			// $(this).carousel( 'addNav' );
			// if (!paging.length) {
			// 	paging = $('<span class="paging"></span>').prependTo( $(this).find('nav') );
			// }
			paging.html( '1 / ' + numSlides);

			$(this).on( 'go.carousel', function(e, to) {
				// $(this).carousel('paginate', Array.prototype.slice.call(arguments, 1) );	// slice off the event, which is 1st in the arguments
				$(this).carousel('paginate', to);
			});

	});


}(jQuery));
