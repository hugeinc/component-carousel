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
			// 	} else {
			// 		nav = $('<nav></nav>');
			// 		prev = $('<a href="#prev" class="prev" aria-hidden="true">Prev</a>');
			// 		next = $('<a href="#next" class="next" aria-hidden="true">Next</a>');
			// 		$(this).append(nav.append(prev).append(next));
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


			jump: function(to) {

			}
		};

	$.extend( $.fn.carousel.prototype, methods );

	$.fn.carousel.prototype.register(function(){
			// console.log('adding pagination listener to', this);

			// $(this).carousel( 'addNav' );

			// slightly redundant; this already calculated in core
			numSlides = $(this).find(this.options.slide).length;

			paging = $(this).find('.paging');
			if (!paging.length) {
				paging = $('<span class="paging"></span>').prependTo( $(this).find('nav') );
			}
			paging.html( '1 / ' + numSlides);

			$(this).on( 'go.carousel', function(e, to) {
				// $(this).carousel('paginate', Array.prototype.slice.call(arguments, 1) );	// slice off the event, which is 1st in the arguments
				$(this).carousel('paginate', to);
			});

	});


}(jQuery));
