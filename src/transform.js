/**
 * Feature detection: CSS transforms
 * @type {Boolean}
 */

let transform = ['transform', 'webkitTransform', 'MozTransform', 'OTransform', 'msTransform'].find((t) => {
  // return (document.body.style[t] !== undefined);   // if DOM is not yet ready, let's do:
  var dummy = document.createElement('div');
  return (dummy.style[t] !== undefined);
});

export default transform;