import buble from 'rollup-plugin-buble';
import uglify from 'rollup-plugin-uglify';
import { minify } from 'uglify-es';
import * as fs from 'fs';

const license = fs.readFileSync('LICENSE', 'utf8');


export default {
  input: 'src/carousel.js',
  output: [
    {
      file: 'dist/carousel.cjs.js',
      format: 'cjs',
      banner: '/*!\n' + license + '*/'
    }, {
      file: 'dist/carousel.es6.js',
      format: 'es',
      banner: '/*!\n' + license + '*/'
    }, {
      file: 'dist/carousel.js',
      format: 'iife',
      name: 'Carousel',
      banner: '/*!\n' + license + '*/'
    },
  ],
  plugins: [
    buble(),
    uglify({
      output: {
        comments: function(node, comment) {
          var text = comment.value;
          var type = comment.type;
          if (type == "comment2") {
            return /^!/i.test(text);
          }
        }
      }
    }, minify)
  ]
};
