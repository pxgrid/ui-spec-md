const path = require('path')
const BUILT_IN_TEMPLATE = require('./constants/dir-names').BUILT_IN_TEMPLATE
const merge = require('webpack-merge')
const base = require('./webpack.base.js')
module.exports = merge(base, {
  output: {
    path: path.resolve(__dirname, BUILT_IN_TEMPLATE, '_screen-spec-md'),
  },
  mode: 'production',
  devtool: 'source-map',
})
