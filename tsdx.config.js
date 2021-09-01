const postcss = require('rollup-plugin-postcss');
const path = require('path');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const scss = require('rollup-plugin-scss');

module.exports = {
  rollup(config, options) {
    config.plugins = config.plugins.concat([
      scss({
        output: path.resolve('dist/react-month-calendar.css'),
      }),
      postcss({
        plugins: [
          autoprefixer(),
          cssnano({
            preset: 'default',
          }),
        ],
        inject: false,
      }),
    ]);

    return config;
  },
};
