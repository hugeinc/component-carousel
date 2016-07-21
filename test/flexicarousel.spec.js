import Carousel from '../src/flexicarousel.es6.js';
import test from 'tape';



const setup = (opts={}) => {
  // const fixtures = {};
  // // Insert your fixture code here.
  // // Make sure you're creating fresh objects each
  // // time setup() is called.
  // return fixtures;

  var carousel;
  var container = document.createElement('div');
  var wrap = document.createElement('ul');

  [1,2,3].map((i) => {
    wrap.appendChild( document.createElement('li') );
  });
  container.appendChild(wrap);

  return carousel = new Carousel(container, opts);
};

const teardown = (carousel) => {
  carousel.destroy();
};



test('Setup and teardown:', function(t) {

  t.test('initializes correctly', function(assert) {
    const carousel = setup();

    assert(carousel).toExist();

    teardown(carousel);
    assert.end();
  });

  t.test('accepts the correct options', function(assert) {
    const fixture = setup({
      activeClass: 'current',
      display: 4,
      infinite: false
    });

    assert(carousel.options.activeClass).toBe('current');
    assert(carousel.options.display).toBe(4);
    assert(carousel.options.infinite).toBe(false);

    teardown(fixture);
    assert.end();
  });

  t.test('destroys cleanly, removing all references and events', function(assert) {
    const carousel = setup();
    // spyOn(carousel.destroy, 'destroy').and.callThrough();
    // assert(carousel.destroy).toHaveBeenCalled();

    // teardown(carousel);
    carousel.destroy();

    // some check for carousel

    assert.end();
  });

});


test('Navigation:', function(t) {

  t.test('jumps to slide 2 when go(2) is called', function(assert) {
    const carousel = setup();

    carousel.go(2);
    assert(carousel.current).isEqual(2);

    teardown(carousel);
    assert.end();
  });

  t.test('goes to the next slide when next() is called', function(assert) {
    const carousel = setup();

    carousel.next();
    assert(carousel.current).isEqual(1);   // because 0 is first

    teardown(carousel);
    assert.end();
  });

  t.test('goes to the previous slide when prev() is called', function(assert) {
    const carousel = setup();

    carousel.go(2);
    carousel.prev();
    assert(carousel.current).isEqual(1);

    teardown(carousel);
    assert.end();
  });

  t.test('when we are at the last slide in an infinite carousel, goes to the first slide when next() is called', function(assert) {
    const carousel = setup();

    carousel.go(2);
    carousel.next();
    assert(carousel.current).isEqual(0);

    teardown(carousel);
    assert.end();
  });

  t.test('when we are at the first slide in an infinite carousel, goes to the last slide when prev() is called', function(assert) {
    const carousel = setup();

    carousel.prev();
    assert(carousel.current).isEqual(2);

    teardown(carousel);
    assert.end();
  });

});

