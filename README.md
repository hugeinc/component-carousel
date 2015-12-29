# Flexicarousel

A carousel that'll use CSS to dynamically adapt its width. Uses transforms for its transitions and is also touch-enabled.

##Introduction

The general idea is that this component should maintain a separation of state and style. That is to say, the Javascript maintains the state of the carousel (which slide, etc), while the CSS should take care of the presentation of this state (ie. transitions between slides, responsive, etc).

##Overview

Features a touch-based interface, simple API, and a very-lightweight footprint. It does the basics well, but that's it. No bloat.
You can swipe to drag a slide yet still use CSS to control how the slide transitions will behave. You can also choose to change slides by
using the exposed API. The carousel works on both desktop and mobile, and weighs in at less than 2 KB(!)

## Getting Started
Checkout the [Github repo][github].

[github]: https://github.com/apathetic/flexicarousel

Include the relevant scripts in your web page, and then:

```html
<script>

	// availble options
	var options = {
		onSlide: someFunc,			// the function to execute when sliding
		activeClass: 'active',
		slideWrap: 'ul',			// for binding touch events
		slides: 'li',				// the slide
		infinite: true,				// infinite scrolling or not
		display: 1,					// if infinite, the # of slides to "view ahead" ie. position offscreen
		offscreen: 0,				// the # of slides to "view ahead" ie. position offscreen
		disableDragging: false
	};

	var container = document.querySelector('.carousel');
	var carousel = new Carousel(container, options);

</script>
```

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
