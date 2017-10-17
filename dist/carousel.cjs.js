/*!
MIT License

Copyright (c) 2013, 2017 wes hatch

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
"use strict";var Carousel=function(t,i){var s=this;void 0===i&&(i={}),this.handle=t,this.options={animateClass:"animate",activeClass:"active",slideWrap:"ul",slides:"li",infinite:!0,display:1,disableDragging:!1,initialIndex:0},this.current=0,this.slides=[],this.sliding=!1,this.cloned=0,this.active=!0,this.dragging=!1,this.dragThreshold=50,this.deltaX=0,this.isTouch="ontouchend"in document,["transform","webkitTransform","MozTransform","OTransform","msTransform"].forEach(function(t){void 0!==document.body.style[t]&&(s.transform=t)}),this.options=Object.assign(this.options,i),this.init()};Carousel.prototype.init=function(){var t=this;return this.slideWrap=this.handle.querySelector(this.options.slideWrap),this.slides=this.slideWrap.querySelectorAll(this.options.slides),this.numSlides=this.slides.length,this.current=this.options.initialIndex,!this.slideWrap||!this.slides||this.numSlides<this.options.display?(console.log("Carousel: insufficient # slides"),this.active=!1):(this.options.infinite&&this._cloneSlides(),this._createBindings(),this._getDimensions(),this.go(this.current,!1),this.options.disableDragging||(this.isTouch?["touchstart","touchmove","touchend","touchcancel"].map(function(i){t.handle.addEventListener(i,t._bindings[i])}):["mousedown","mousemove","mouseup","mouseleave","click"].map(function(i){t.handle.addEventListener(i,t._bindings[i])})),window.addEventListener("resize",this._bindings.resize),window.addEventListener("orientationchange",this._bindings.orientationchange),this)},Carousel.prototype.destroy=function(){var t=this;for(var i in t._bindings)t.handle.removeEventListener(i,t._bindings[i]);window.removeEventListener("resize",this._bindings.resize),window.removeEventListener("orientationchange",this._bindings.orientationchange),this._bindings=null,this.options=this.slides=this.slideWrap=this.handle=null,this.active=!1},Carousel.prototype.next=function(){this.options.infinite||this.current!==this.numSlides-1?this.go(this.current+1):this.go(this.numSlides-1)},Carousel.prototype.prev=function(){this.options.infinite||0!==this.current?this.go(this.current-1):this.go(0)},Carousel.prototype.go=function(t,i){void 0===i&&(i=!0);var s=this.options;if(!this.sliding&&this.active){if(t<0||t>=this.numSlides){var e=t<0?this.current+this.numSlides:this.current-this.numSlides;this._slide(-(e*this.width-this.deltaX)),this.slideWrap.offsetHeight}t=this._loop(t),this._slide(-t*this.width,i),s.onSlide&&t!==this.current&&s.onSlide.call(this,t,this.current),this._removeClass(this.slides[this.current],s.activeClass),this._addClass(this.slides[t],s.activeClass),this.current=t}},Carousel.prototype._createBindings=function(){this._bindings={touchstart:this._dragStart.bind(this),touchmove:this._drag.bind(this),touchend:this._dragEnd.bind(this),touchcancel:this._dragEnd.bind(this),mousedown:this._dragStart.bind(this),mousemove:this._drag.bind(this),mouseup:this._dragEnd.bind(this),mouseleave:this._dragEnd.bind(this),click:this._checkDragThreshold.bind(this),resize:this._updateView.bind(this),orientationchange:this._updateView.bind(this)}},Carousel.prototype._checkDragThreshold=function(t){this.dragThresholdMet&&t.preventDefault()},Carousel.prototype._dragStart=function(t){var i;if(this.sliding)return!1;i=void 0!==(t=t.originalEvent||t).touches&&t.touches,this.dragThresholdMet=!1,this.dragging=!0,this.startClientX=i?i[0].pageX:t.clientX,this.startClientY=i?i[0].pageY:t.clientY,this.deltaX=0,this.deltaY=0,"IMG"!==t.target.tagName&&"A"!==t.target.tagName||(t.target.draggable=!1)},Carousel.prototype._drag=function(t){var i;this.dragging&&(i=void 0!==(t=t.originalEvent||t).touches&&t.touches,this.deltaX=(i?i[0].pageX:t.clientX)-this.startClientX,this.deltaY=(i?i[0].pageY:t.clientY)-this.startClientY,this._slide(-(this.current*this.width-this.deltaX)),this.dragThresholdMet=Math.abs(this.deltaX)>this.dragThreshold)},Carousel.prototype._dragEnd=function(t){this.dragging&&(this.dragThresholdMet&&(t.preventDefault(),t.stopPropagation(),t.stopImmediatePropagation()),this.dragging=!1,0!==this.deltaX&&Math.abs(this.deltaX)<this.dragThreshold?this.go(this.current):this.deltaX>0?this.prev():this.deltaX<0&&this.next(),this.deltaX=0)},Carousel.prototype._slide=function(t,i){var s=this;t-=this.offset,i&&(this.sliding=!0,this._addClass(this.slideWrap,this.options.animateClass),setTimeout(function(){s.sliding=!1,s._removeClass(s.slideWrap,s.options.animateClass)},400)),this.transform?this.slideWrap.style[this.transform]="translate3d("+t+"px, 0, 0)":this.slideWrap.style.left=t+"px"},Carousel.prototype._loop=function(t){return(this.numSlides+t%this.numSlides)%this.numSlides},Carousel.prototype._getDimensions=function(){this.width=this.slides[0].getBoundingClientRect().width,this.offset=this.cloned*this.width},Carousel.prototype._updateView=function(){var t=this;window.innerWidth!==this._viewport&&(this._viewport=window.innerWidth,clearTimeout(this.timer),this.timer=setTimeout(function(){t._getDimensions(),t.go(t.current)},300))},Carousel.prototype._cloneSlides=function(){for(var t,i=this,s=this.options.display,e=Math.max(this.numSlides-s,0),n=Math.min(s,this.numSlides),o=this.numSlides;o>e;o--)(t=i.slides[o-1].cloneNode(!0)).removeAttribute("id"),t.setAttribute("aria-hidden","true"),i._addClass(t,"clone"),i.slideWrap.insertBefore(t,i.slideWrap.firstChild),i.cloned++;for(var h=0;h<n;h++)(t=i.slides[h].cloneNode(!0)).removeAttribute("id"),t.setAttribute("aria-hidden","true"),i._addClass(t,"clone"),i.slideWrap.appendChild(t)},Carousel.prototype._addClass=function(t,i){t.classList?t.classList.add(i):t.className+=" "+i},Carousel.prototype._removeClass=function(t,i){t.classList?t.classList.remove(i):t.className=t.className.replace(new RegExp("(^|\\b)"+i.split(" ").join("|")+"(\\b|$)","gi")," ")},module.exports=Carousel;
