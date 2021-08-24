const postcss = require('rollup-plugin-postcss');
const path = require('path');
const url = require('@rollup/plugin-url');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const svgr = require('@svgr/rollup').default;

module.exports = {
  rollup(config, options) {
    config.plugins = config.plugins.concat([
      url(),
      svgr(),
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
