const postcss = require('rollup-plugin-postcss');
const path = require('path');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const scss = require('rollup-plugin-scss');
const packageJson = require('./package.json');

module.exports = {
  rollup(config, options) {
    config.plugins = config.plugins.concat([
      scss({
        output: path.resolve('dist/' + packageJson.name + '.css'),
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
