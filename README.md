# Flexicarousel

A carousel that'll dynamically adapt its width: it will grow or shrink alongside a site that’s resizing via css media queries. Uses CSS3
transforms for its transitions, and is also responsive using CSS.

##Introduction

The general idea is that this component should maintain a separation of state and style. That is to say, the Javascript should maintain
the state of the carousel (what slide, etc), while the CSS should take care of the presentation of this state (ie. transitions between
slides, responsive, etc).

##Overview

Featuring a touch-based interface, simple API, and a very-lightweight footprint. It does the basics well, but that's it. No bloat.
You can swipe to drag a slide yet still use CSS to control how the slide transitions will behave. You can also choose to change slides by
using the exposed API. The carousel works on both desktop and mobile, using only CSS to control the look and feel. Under 2 KB(!)

## Getting Started
Download the [production version][min] or the [development version][max]. Or the [jquery version][jquery].

[min]: https://github.com/apathetic/flexicarousel-3/blob/master/dist/flexicarousel.min.js
[max]: https://github.com/apathetic/flexicarousel-3/blob/master/dist/flexicarousel.js
[jquery]: https://github.com/apathetic/flexicarousel-3/blob/master/dist/jquery.flexicarousel.min.js

Include the relevant scripts in your web page, and then:

```html
<script>

	// availble options
	var options = {
		activeClass: 'active',
		slideWrap: 'ul',			// for binding touch events
		slides: 'li',				// the slide
		infinite: true,				// infinite scrolling or not
		display: 1,					// if infinite, the # of slides to "view ahead" ie. position offscreen
		disableDragging: false
	};

	var container = document.querySelector('.carousel');
	var carousel = new Carousel(container, options);

</script>
```

### Notes

The carousel uses transitionEnd (or the browser-prefixed variant) to determine when to update after sliding. If the carousel seems to not be working
-- and you've messed with the default CSS -- double-check that you're using the _transition_ property correctly in the .animate class.

## API

	next: advances the carousel by one slide

	prev: returns to the previous slide

	go: function(to) advances slide to the _to_ index


## Support
* IE8+
* Safari / Chrome
* Firefox
* iOS
* Android

## Known Issues

## Examples

Please see the _test / demo_ directory

## Release History

### 0.2
* bug fixes, mostly
* updated slide engine
* more robust dragging on mobile

### 0.1
* first release