const path = require('path')
const DEFAULT_THEME = require('./constants/dir-names').DEFAULT_THEME
const merge = require('webpack-merge')
const base = require('./webpack.base.js')
module.exports = merge(base, {
  output: {
    path: path.resolve(__dirname, DEFAULT_THEME, '_ui-spec-md'),
  },
  mode: 'production',
  devtool: 'source-map',
})
