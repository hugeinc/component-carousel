import buble from 'rollup-plugin-buble';
import uglify from "rollup-plugin-uglify";

export default [
  {
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
  }, {
    entry: 'src/carousel.js',
    moduleName: 'Carousel',
    plugins: [
      buble(),
      uglify()
    ],
    targets: [
      { dest: 'dist/carousel.min.js', format: 'iife' }
    ]
  }
];
