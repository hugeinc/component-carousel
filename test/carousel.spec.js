import Carousel from '../src/carousel.js';
import test from 'tape';
import { JSDOM } from 'jsdom';

let carousel;

const setup = (opts={}) => {
  const jsdom = new JSDOM(`
    <!doctype html>
    <html>
    <body>
      <div>
        <ul>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
    </body>
    </html>
  `);
  const { window } = jsdom;
  const container = window.document.querySelector('div');

  global.window = window;
  global.document = window.document;

  carousel = new Carousel(container, opts);
};

const teardown = () => {
  carousel.destroy();
};


test('Setup and teardown:', function(t) {

  t.test('initializes correctly', function(assert) {
    setup();

    assert.equal(typeof carousel, 'object');
    assert.equal(carousel.handle.nodeName, 'DIV');
    assert.equal(carousel.slideWrap.nodeName, 'UL');
    assert.equal(carousel.slides[0].nodeName, 'LI');
    assert.equal(carousel.numSlides, 3);

    teardown();
    assert.end();
  });

  t.test('requires at least 2 slides', function(assert) {
    // setup(...w/ 1 slide)
    // assert: carousel did not init
    // teardown()
    assert.end();
  });

  t.skip('destroys cleanly, removing all references and events', function(assert) {
    setup();

    // spyOn(carousel.destroy, 'destroy').and.callThrough();

    teardown();
    // carousel.destroy();

    // assert(carousel.destroy).toHaveBeenCalled();
    assert.equal(Object.keys(carousel.handle.getEventListeners()).length, 0);
    assert.equal(Object.keys(global.window.getEventListeners()).length, 0);

    assert.end();
  });

  t.skip('accepts the correct options', function(assert) {
    setup({
      animateClass: 'sample',
      activeClass: 'sample',
      // slideWrap: 'div',
      // slides: 'div',
      infinite: false,
      display: 10,
      disableDragging: true,
      initialIndex: 10
    });

    assert.equal(carousel.options.animateClass, 'sample');
    assert.equal(carousel.options.activeClass, 'sample');
    assert.equal(carousel.options.infinite, false);
    assert.equal(carousel.options.display, 10);
    assert.equal(carousel.options.disableDragging, true);
    assert.equal(carousel.options.initialIndex, 10);
    assert.equal(carousel.current, 10);

    teardown();
    assert.end();
  });

  t.test('clones slides if infinite', function(assert) {
    setup({
      infinite: true,
    });

    // spyOn(Carousel._cloneSlides).and.callThrough();

    // assert(carousel._cloneSlides).toHaveBeenCalled();

    teardown();
    assert.end();
  });

  t.test('clones slides correctly', function(assert) {
    setup({
      infinite: true,
      display: 1
    });

    const slides = carousel.slideWrap.children; // this includes cloned nodes, while carousel.slides does not
    const begClone = slides[0];
    const endClone = slides[4];

    assert.equal(slides.length, 5);            // 3 slides + 1 begClone + 1 endClone
    assert.deepEqual(begClone, slides[3]);     // begClone was taken from the end
    assert.deepEqual(endClone, slides[1]);     // endClone was taken from the beg
    // assert: begClone has aria-hidden attr, "clone" class,  no id

    teardown();
    assert.end();
  });
});


test('Navigation:', function(t) {

  t.test('jumps to slide 2 when go(2) is called', function(assert) {
    setup();

    carousel.go(2);
    assert.equal(carousel.current, 2);

    teardown();
    assert.end();
  });

  t.test('goes to the next slide when next() is called', function(assert) {
    setup();

    carousel.next();
    assert.equal(carousel.current, 1);   // because 0 is first

    teardown();
    assert.end();
  });

  t.test('goes to the previous slide when prev() is called', function(assert) {
    setup();

    carousel.go(2);
    carousel.prev();
    assert.equal(carousel.current, 1);

    teardown();
    assert.end();
  });

  t.test('when we are at the last slide in an infinite carousel, goes to the first slide when next() is called', function(assert) {
    setup();

    carousel.go(2);
    carousel.next();
    
    assert.equal(carousel.current, 0);

    teardown();
    assert.end();
  });

  t.test('when we are at the first slide in an infinite carousel, goes to the last slide when prev() is called', function(assert) {
    setup();

    carousel.prev();
    assert.equal(carousel.current, 2);

    teardown();
    assert.end();
  });

});


test('General:', function(t) {

  t.test('updates class on active element', function(assert) {
    setup({ activeClass: 'test' });
    carousel.go(1);

    // setTimeout(() => {
      const slideClass = carousel.slides[carousel.current].classList[0];

      assert.equal(slideClass, 'test');

      console.log(carousel);
      console.log('asdfdfasafsddfsa');
      

      teardown();
      assert.end();
    // }, 410); // 400 is the built-in (at present) animation time
  });
});