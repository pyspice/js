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
  // plugins: [new CopyWebpackPlugin(patterns)]
};