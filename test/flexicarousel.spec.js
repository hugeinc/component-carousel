import Carousel from '../src/flexicarousel.es6.js';

describe('flexicarousel - ', function() {

  // MOCKS
  var container = document.createElement('div');
  var wrap = document.createElement('ul');
  [1,2,3].map((i) => {
    wrap.appendChild( document.createElement('li') );
  });
  container.appendChild(wrap);
  var carousel;

  // E
  describe('exporting:', function() {

    it('should export to the window object', function() {
      // expect(...
    // expect(foo.setBar).toHaveBeenCalledWith(123);

    });

    it('should export as a common module', function() {

    });

  });


  //
  describe('setup and teardown:', function() {

    beforeEach(function() {
      carousel = new Carousel(container, {
        activeClass: 'current',
        display: 4,
        infinite: false
      });
    });

    it('initializes correctly', function() {
      // expect(carousel).toExist();
      // console.log(carousel);
    });

    it('accepts the correct options', function() {
      expect(carousel.options.activeClass).toBe('current');
      expect(carousel.options.display).toBe(4);
      expect(carousel.options.infinite).toBe(false);
    });

    it('destroys cleanly, removing all references and events', function() {
      // spyOn(carousel.destroy, 'destroy').and.callThrough();
      // expect(carousel.destroy).toHaveBeenCalled();

      carousel.destroy();

      // some check for carousel
    });

  });


  //
  describe('navigation:', function() {

    beforeEach(function() {
      carousel = new Carousel(container);
    });

    it('jumps to slide 2 when go(2) is called', function() {
      carousel.go(2);
      expect(carousel.current).toBe(2);
    });

    it('goes to the next slide when next() is called', function() {
      carousel.next();
      expect(carousel.current).toBe(1);   // because 0 is first
    });

    it('goes to the previous slide when prev() is called', function() {
      carousel.go(2);
      carousel.prev();
      expect(carousel.current).toBe(1);
    });

    it('when we are at the last slide in an infinite carousel, goes to the first slide when next() is called', function() {
      carousel.go(2);
      carousel.next();
      expect(carousel.current).toBe(0);
    });

    it('when we are at the first slide in an infinite carousel, goes to the last slide when prev() is called', function() {
      carousel.prev();
      expect(carousel.current).toBe(2);
    });

  });

});
