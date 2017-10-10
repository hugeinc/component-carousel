import buble from 'rollup-plugin-buble';
import * as fs from 'fs';

const license = fs.readFileSync('LICENSE', 'utf8');


export default {
  input: 'src/carousel.js',
  output: [
    {
      file: 'dist/carousel.cjs.js',
      format: 'cjs',
      banner: '/*\n' + license + '*/',
      plugins: [
        buble()
      ]
    }, {
      file: 'dist/carousel.es6.js',
      format: 'es',
      banner: '/*\n' + license + '*/',
      plugins: [
        buble()
      ]
    }, {
      file: 'dist/carousel.js',
      format: 'iife',
      name: 'Carousel',
      banner: '/*\n' + license + '*/',
      plugins: [
        buble()
      ]
    }
  ]
};
