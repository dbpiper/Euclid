// eslint-disable-next-line import/no-extraneous-dependencies
const wp = require('@cypress/webpack-preprocessor');

const webpackOptions = {
  watch: true,
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: 'ts-loader',
          },
        ],
      },
    ],
  },
};

const options = {
  webpackOptions,
};

module.exports = wp(options);
