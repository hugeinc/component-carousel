/*
 * flexicarousel
 * https://github.com/apathetic/flexicarousel
 *
 * Copyright (c) 2013 Wes Hatch
 * Licensed under the MIT license.
 */

/*
(function($) {
	
	var methods = {
		fetch: function(){







				if (opts.url && (curr + opts.scroll >= numItems - 8) && !c.data('loading') ) {	// "8" to load 8 at a time, not every single click. TODO: make 8 an option?
					c.one('carousel-before', load);
				}






			c.data('loading', true);
			opts.data.offset = numItems;							// so ajax knows where to start loading

			$.post(opts.url, opts.data, function(response){
				var newItems = $(response),
					count = newItems.length;

				if (count) {
					numItems += count;									// keep track


					// totalWidth += (width * count);
					// ul.css('width', totalWidth +'px');

					// newItems.each(function(i, item) {					// wait for images to load?
						// img = $(item).find('img')[0];
						// width = img.width * (150 / img.height);
						// totalWidth += width;
					// });

					newItems.css('float', 'left').appendTo(ul);			// inject it / them
					c.data('loading', false);
				}
			});













		}
	}

	$.extend( $.fn.carousel.prototype, methods ); 

	$('body').on( 'init.carousel', function(e) {
		$( this )[ pluginName ]( 'fetch' );
	});


}(jQuery));

*/