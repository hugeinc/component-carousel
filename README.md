# Flexicarousel

A carousel that'll dynamically adapt its width: it will grow or shrink alongside a site that’s resizing via css media queries. Uses CSS3 transforms for its transitions

Much of this code was Inspired by: 
responsive-carousel
https://github.com/filamentgroup/responsive-carousel
(c) 2012 Filament Group, Inc.

## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/apathetic/flexicarousel/master/dist/flexicarousel.min.js
[max]: https://raw.github.com/apathetic/flexicarousel/master/dist/flexicarousel.js

In your web page:

```html
<script src="jquery.js"></script>
<script src="flexicarousel.min.js"></script>
<script>
jQuery(function($) {
	$('.carousel').carousel({
		// options
	});
});
</script>
```

## Documentation
_(Coming soon)_

## Known Issues
There's a memory leak at the moment. Each prev/next click triggers a CSS transition, but something's not getting cleaned up afterwards. 

## Examples
_(Coming soon)_

## Release History
### 0.1.1
Updated CSS so that only animating relevant properties. Gives much needed performance gain and no stutter-y z-index issues.
