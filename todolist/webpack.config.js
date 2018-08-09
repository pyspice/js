const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin')


const patterns = [
  {from: './src/*.html', to: './'},
  {from: './src/*.css', to: './'},
];

// const config = {
//   plugins: [
//     new CopyWebpackPlugin(patterns)
//   ]
// }

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, './build'),
    filename: 'build.js'
  },
  module: {
    rules: [
      { test: /\.temple/, loader: "temple-webpack-loader" }
    ]
  },

  optimization: {
    minimize: false
  }

  // plugins: [new CopyWebpackPlugin(patterns)]
};