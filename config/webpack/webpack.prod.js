const webpack_merge = require('webpack-merge')
const webpack_base = require('./webpack.base.js')
const path = require('path')

// Production plugins
const clean_webpack = require('clean-webpack-plugin')
// const minify_js = require('babel-minify-webpack-plugin')
const minify_css = require('optimize-css-assets-webpack-plugin')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const webpack_prod = {
  //===========================================
  // INPUT, OUTPUT
  //-------------------------------------------
  output: {
    publicPath: '',
    
    // eslint-disable-next-line no-undef
    path: path.resolve(__dirname, '../../dist')
  },
  //===========================================
  // PLUGINS
  //-------------------------------------------
  plugins: [
    // clean dist folder before generate new source
    new clean_webpack(['dist'], {
      
      // eslint-disable-next-line no-undef
      root: path.join(__dirname, '../../')
    })
  ],
  optimization: {
    // minify setup
    minimizer: [
      // minify js
      // new minify_js({
      //   removeDebugger: true
      // }),
      // minify css
      new minify_css(),
      // analyze webpack bundles (turn on when evaluate bundle file's size)
      // new BundleAnalyzerPlugin()
    ],
    // split chunks: for code splitting (on-demand loading)
    // caching: https://webpack.js.org/guides/caching/
    splitChunks: {
      // config base project
      chunks: 'all', // all || async
      minSize: 50000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      // default config
      automaticNameDelimiter: '--',
      name: true,
      cacheGroups: {
        nodes: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
}

module.exports = webpack_merge(webpack_base, webpack_prod)
