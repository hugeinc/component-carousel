/*
 * flexicarousel
 * https://github.com/apathetic/flexicarousel
 *
 * Copyright (c) 2013 Wes Hatch
 * Licensed under the MIT license.
 */

(function($) {
	
	var pluginName = "carousel",
		initSelector = "." + pluginName;
	
	// DOM-ready auto-init
	$( initSelector ).on( "ajaxInclude", function(){
		$( this )[ pluginName ]( "update" );
	} );
	
	// kick off ajaxIncs at dom ready
	$( function(){
		$( "[data-after],[data-before]", initSelector ).ajaxInclude();
	} );

}(jQuery));