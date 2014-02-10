/*
 * flexicarousel: Set the number of slides to Display at one time
 * https://github.com/apathetic/flexicarousel
 *
 * Copyright (c) 2013 Wes Hatch
 * Licensed under the MIT license.
 */

(function($) {
	
	var pluginName = 'carousel',
		methods = {
			updateDisplay: function(){
				var display = $( this ).attr( 'data-display' );		// number of slides to display at a time
				
				
				
			}
		};



	// add methods
	$.extend( $.fn[ pluginName ].prototype, methods ); 
	
	$( '.' + pluginName ).on( pluginName + '.init', function() {
		$( this )[ pluginName ]( 'updateDisplay' );
	});

}(jQuery));