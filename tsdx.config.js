const postcss = require('rollup-plugin-postcss');
const path = require('path');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

module.exports = {
  rollup(config, options) {
    config.plugins = config.plugins.concat([
      postcss({
        plugins: [
          autoprefixer(),
          cssnano({
            preset: 'default',
          }),
        ],
        inject: false,
        extract: path.resolve('dist/react-month-calendar.css'),
      }),
    ]);
    return config;
  },
};
