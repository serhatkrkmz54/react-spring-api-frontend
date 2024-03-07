const path = require('path');
const webpack = require('webpack');

module.exports = {
  resolve: {
    fallback: {
      fs: false,
      path: false,
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  ],
};