// --------------------------
// flexicarousel.
// --------------------------


(function( $ ){
	$.fn.carousel = function(o) {
		o = $.extend({
			wrap: '.wrap',
			prev: null,
			next: null,
			jump: null,
			visible: 1,
			scroll: 1,
			speed: 800,
			easing: null
		},
		o || {});

		return this.each(function() {
			var c = $(this),
				wrap = c.find(o.wrap),
				ul = wrap.children('ul'),
				slides = ul.children('li'),
				next = o.next ? $(o.next) : c.find('.next'),
				prev = o.prev ? $(o.prev) : c.find('.prev'),
				jump = o.jump ? $(o.jump) : c.find('.jump'),
				items = slides.length,
				curr = 0,
				s = o.speed/1000,
				visible = c.data('visible') ? c.data('visible') : o.visible,
				scroll = c.data('scroll') ? c.data('scroll') : o.scroll,
				width = (100 / items) + '%';		// Math.floor(10000 / items) / 100; // two decimal places

			if ( typeof ul[0] === 'undefined' ) { return; }
			ul[0].setAttribute('style', 'transition:all '+s+'s ease;-webkit-transition:all '+s+'s ease;-moz-transition:all '+s+'s ease;');
			var transitionSupport = !!(ul[0].style.transition || ul[0].style.webkitTransition || ul[0].style.msTransition || ul[0].style.OTransition || ul[0].style.MozTransition );

			if ( items <= visible ) {
				prev.hide();
				next.hide();
				return;
			} else {
				next.removeClass('disabled');
			}




			slides.css({ 'float':'left', 'width':width });
			ul.css({ 'position':'relative', 'width':(100 * items / visible) + '%' });
			wrap.css({ 'visibility':'visible', 'overflow':'hidden', 'position':'relative' });

/*
var marginL = parseInt(slides.last().css('marginLeft'));
var w_width = wrap.width();
// var marginPerc = (marginL * visible) / w_width;
var marginPerc = marginL / w_width * 100 * visible / items;
slides.css({ 'float':'left', 'width':(100/items)-marginPerc+'%', 'marginLeft':marginPerc+'%' });
ul.css({ 'marginLeft':-(marginPerc * items / visible) / 2 + '%' });
*/

console.log(slides);

			if (prev.length > 0) {
				prev.click(function() { return go(curr - scroll); });
			}
			if (next.length > 0) {
				next.click(function() { return go(curr + scroll); });
			}
			if (jump.length) {
				$.each(jump, function(i, a) {
					$(a).click(function() { return go(i); });
				});
			}

			function go(a) {

				if ( !ul.is(':animated') ) {

					if (a < 0 || a > items-visible) { return; }
					else { curr = a; }

					if( transitionSupport ) {
						ul
							.css('left', -(100 * a / visible)+'%')
							.one('transitionend webkitTransitionEnd OTransitionEnd', function() {
								$(this).trigger( 'carousel-after' );
							});
					} else {
						ul
							.animate({'left':-(100 * a / visible)+'%'}, {'duration':o.speed, 'easing':o.easing, 'queue':false}, function() {
								$(this).trigger( 'carousel-after' );
							});
					}

					next.removeClass('disabled');
					prev.removeClass('disabled');
					$((curr - scroll < 0 && prev) || (curr + scroll > items - visible && next) || []).addClass('disabled');

					return false;

				}
			}
		});
	};
})(jQuery);
