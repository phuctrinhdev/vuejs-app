const webpack_merge = require('webpack-merge')
const webpack_base = require('./webpack.base.js')
const webpack = require('webpack')

// Development plugins

const webpack_dev = {
  //===========================================
  // DEV SERVER
  //-------------------------------------------
  devServer: {
    contentBase: './dist',
    disableHostCheck: true,
    hot: true,
    watchOptions: {
      ignored: /node_modules/
    }
  },
  //===========================================
  // PLUGINS
  //-------------------------------------------
  plugins: [
    // hot module replacement for devserver
    new webpack.HotModuleReplacementPlugin()
  ]
}

module.exports = webpack_merge(webpack_base, webpack_dev)
