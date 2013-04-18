/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
(function($) {

  /*
    ======== A Handy Little QUnit Reference ========
    http://docs.jquery.com/QUnit

    Test methods:
      expect(numAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      raises(block, [expected], [message])
  * /

  module('flexicarousel', {
    setup: function() {
      this.elem = $('#qunit-fixture');
      this.elems = $('#qunit-fixture').children();
    }
  });

  test('is chainable', 1, function() {
    // Not a bad test to run on collection methods.
    equal(this.elems.carousel(), this.elems, 'should be chaninable');
  });


test("init", function() {
  ok( this.elem.flexicarousel(), "init correctly");
});

test("defaults", function() {
  ok($.fn.flexicarousel.prototype, "methods attached correctly");
  // equal($.fn.pullQuote.options.insertAfter, "elem", "default global options are set");
  // $.fn.pullQuote.options.insertAfter = "test";
  // equal($.fn.pullQuote.options.insertAfter, "test", "can change the defaults globally");
});



  module('flexicarousel ajax');
  module('flexicarousel touch events');



*/

}(jQuery));
