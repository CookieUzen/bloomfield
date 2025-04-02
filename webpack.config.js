// webpack.config.js
const path = require('path');

module.exports = {
  entry: './game.js', // your entry file
  output: {
    filename: 'bundle.js', // the output bundle
    path: path.resolve(__dirname, 'dist'), // output folder
  },
  mode: 'development', // or 'production' for production builds
  devtool: 'eval-source-map',
  module: {
    rules: [
      // Add loaders if you need to handle CSS, images, etc.
    ],
  },
};

