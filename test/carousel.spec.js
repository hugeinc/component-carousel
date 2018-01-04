import Carousel from '../src/carousel.js';
import test from 'tape';
import spy from 'spy';
import { JSDOM } from 'jsdom';

let carousel;

const goodTemplate = `
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
    </html>`;
const badTemplate = `
    <!doctype html>
    <html>
    <body>
      <div>
        <ul></ul>
      </div>
    </body>
    </html>`;

const setup = (opts={}, template = goodTemplate) => {
  const dom = new JSDOM(template);
  const { window } = dom;
  const container = window.document.querySelector('div');

  global.window = window;
  global.document = window.document;
  carousel = new Carousel(container, opts);
};
const teardown = () => {
  carousel.destroy();
  // createBindings.reset();
};
// const createBindings = spy(Carousel.prototype._createBindings);


/////////////////////////////////////////////////////////////////////////////////////


test('Setup and teardown:', function(t) {

  t.test('initializes correctly', function(assert) {
    // const createBindings = spy(Carousel.prototype._createBindings); // wrap in spy function
    setup();

    assert.equal(typeof carousel, 'object');
    assert.equal(carousel.handle.nodeName, 'DIV');
    assert.equal(carousel.slideWrap.nodeName, 'UL');
    assert.equal(carousel.slides[0].nodeName, 'LI');
    assert.equal(carousel.numSlides, 3);
    // assert.equal(createBindings.called, true);

    teardown();
    assert.end();
  });

  t.test('requires at least 2 slides (with default display value)', function(assert) {
    setup({}, badTemplate);

    // assert.equal(createBindings.called, false);
    assert.equal(carousel.active, false);

    teardown();
    assert.end();
  });

  t.skip('cannot call destroy (or other methods) on carousel which did not init', function(assert) {
    setup({}, badTemplate);
    // assert: carousel did not init
    teardown();
    assert.end();

  });

  t.skip('destroys cleanly, removing all references and events', function(assert) {
    setup();

    const destroy = spy(carousel.destroy);

    carousel.destroy();

    assert.equal(destroy.called, true);
    // assert.equal(Object.keys(getEventListeners(carousel.handle)).length, 0); // *sigh* JSDOM cannot do this
    // assert.equal(Object.keys(getEventListeners(global.window)).length, 0);   // :(

    teardown();
    assert.end();
  });

  t.test('accepts and applies options correctly', function(assert) {
    setup({
      animateClass: 'sample',
      activeClass: 'sample',
      infinite: false,
      display: 2,
      disableDragging: true,
      initialIndex: 2
    });

    assert.equal(carousel.options.animateClass, 'sample');
    assert.equal(carousel.options.activeClass, 'sample');
    assert.equal(carousel.options.infinite, false);
    assert.equal(carousel.options.display, 2);
    assert.equal(carousel.options.disableDragging, true);
    assert.equal(carousel.options.initialIndex, 2);
    assert.equal(carousel.current, 2);

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
    setup({ initialIndex: 2 });

    carousel.prev();

    assert.equal(carousel.current, 1);

    teardown();
    assert.end();
  });

  t.test('when we are at the last slide in an infinite carousel, goes to the first slide when next() is called', function(assert) {
    setup({ initialIndex: 2 });

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
  t.skip('will not error out if destroy() called during slide transition', function(assert) {
    setup();

    carousel.next();
    assert.doesNotThrow(carousel.destroy, 'TypeError');

    teardown();
    assert.end();
  });

  t.test('updates class on active element', function(assert) {
    setup({ 
      activeClass: 'test',
      initialIndex: 1
    });

    const slideClass = carousel.slides[carousel.current].classList[0];

    assert.equal(slideClass, 'test');

    teardown();
    assert.end();
  });
});