import buble from 'rollup-plugin-buble';

export default {
  entry: 'src/carousel.js',
  moduleName: 'Carousel',
  plugins: [
    buble()
  ],
  targets: [
    { dest: 'dist/carousel.cjs.js', format: 'cjs' },
    { dest: 'dist/carousel.es6.js', format: 'es' },
    { dest: 'dist/carousel.js', format: 'iife' }
  ]
};
