# Carousel

A carousel that'll use CSS to dynamically adapt its width. Uses transforms for its transitions and is also touch-enabled.

## Introduction

The general idea is that this component should maintain a separation of state and style. That is to say, the Javascript maintains the state of the carousel (which slide, etc), while the CSS should take care of the presentation of this state (ie. transitions between slides, responsive, etc).

## Overview

Features a touch-based interface, simple API, and a very-lightweight footprint. It does the basics well, but that's it. No bloat.
You can swipe to drag a slide yet still use CSS to control how the slide transitions will behave. You can also choose to change slides by
using the exposed API. The carousel works on both desktop and mobile, and weighs in at less than 2 KB(!)

## Getting Started
There is an ES6 module you may consume however you wish. Alternatively, you can also include the relevant scripts in your web page, and then:

```html
<!-- sample carousel markup -->
<div class="carousel">
  <ul class="wrap">   <!-- slideWrap -->
    <li>slide 1</li>  <!-- slide -->
    <li>slide 2</li>
    <li>slide 3</li>
  </ul>
</div>
```

```javascript
  // available options
  var options = {
    onSlide: someFunction,
    activeClass: 'active',
    slideWrap: 'ul',
    slides: 'li',
    infinite: true,
    display: 1,
    disableDragging: false,
    initialIndex: 0
  };

  var container = document.querySelector('.carousel');
  var carousel = new Carousel(container, options);

```

## Options

| name            | type     | default   | description |
| --------------- | -------- | --------- | ----------- |
| onSlide         | function | undefined | A function to execute on slide. It is passed _to_ and _from_ indices. |
| activeClass     | string   | active    | Class to use on the active slide. |
| slideWrap       | string   | .wrap     | The selector to use when searching for the slides' container. This is used only to bind touch events to, on mobile. |
| slides          | string   | li        | The selector to use when searching for slides within the slideWrap container. |
| infinite        | boolean  | true      | Enable an infinitely scrolling carousel or not |
| display         | integer  | 1         | the maximum # of slides to display at a time. If you want to have prev/next slides visible outside those currently displayed, they'd be included here. |
| disableDragging | boolean  | false     | if you'd like to disable the touch UI for whatever reason |
| initialIndex | integer  | 0     | which slide it's going to start |

## Methods

| method    | description |
| --------- | ----------- |
| next()    | Advances carousel to the next slide |
| prev()    | Move carousel to the previous slide |
| to(i)     | Advance carousel to the ith slide |
| destroy() | Destroy carousel and remove all EventListeners |

## Demo

After cloning the repo:
```
npm i
npm start
```

A server will spin up at ```http://localhost:8080```, where you may play with the various examples. See the "demo" directory.

## Support
* IE8+
* Safari / Chrome
* Firefox
* iOS
* Android 4.0+

## Release History

### 0.6
* updated some css

### 0.5
* added destroy()
* added some tests

### 0.4
* better dragging response
* fixed click bug when dragging

### 0.3
* cleaning up cloning logic
* further optimizations

### 0.2
* bug fixes, mostly
* updated slide engine
* more robust dragging on mobile

### 0.1
* first release
