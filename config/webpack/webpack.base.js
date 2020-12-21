const dotenv_webpack = require('dotenv-webpack')
const html_webpack = require('html-webpack-plugin')
const copy_webpack = require('copy-webpack-plugin')
const vue_loader = require('vue-loader/lib/plugin')
const extract_css = require('mini-css-extract-plugin')

let dev_tool = 'eval-cheap-source-map'
let style_loader = 'style-loader'
let dotenv = 'dev'


// eslint-disable-next-line no-undef
if(process.env.NODE_ENV == 'production'){
  dev_tool = ''
  style_loader = extract_css.loader
  dotenv = 'prod'
}

const webpack_base = {
  //===========================================
  // INPUT, OUTPUT
  //-------------------------------------------
  entry: {
    app: [
      '@babel/polyfill',
      './src/app.js',
    ]
  },
  output: {
    filename: '[name].[hash].js'
  },
  devtool: dev_tool,
  //===========================================
  // MODULES
  //-------------------------------------------
  module: {
    rules: [
      {
        // load typescript
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/],
        }
      },
      {
        // load vue-component
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        // load js file & transform js syntax for backwards compatible old browsers/environments
        // this will apply to both plain `.js` files and `<script>` blocks in `.vue` files
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        // auto reporting errors found in source code
        test: /\.(vue|js)$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          failOnError: true
        }
      },
      {
        // load file
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'template/images/[hash].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(zip)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'files/[name].[ext]'
            }
          }
        ]
      },
      {
        // this will apply to plain `.scss`, `.css` files and `<style>` blocks in `.vue` files
        test: /\.(s*)css$/,
        use: [
          {
            // MiniCssExtractPlugin not support Hot Module Replacement run on devServer
            // style-loader load css & inject to html
            loader: style_loader
          },
          {
            // expand for css loading
            loader: 'css-loader',
            options: {
              url: false,
              sourceMap: true
            }
          },
          {
            // load sass code
            loader: 'sass-loader',
            options: {
              url: false,
              sourceMap: true
            }
          },
          {
            // loaded shared scss for both layout-template & vue-component
            loader: 'sass-resources-loader',
            options: {
              url: false,
              sourceMap: true,
              resources: [
                './src/template/_variables.scss',
                './src/template/_mixin.scss'
              ]
            }
          }
        ]
      }
    ]
  },
  resolve: {
    // config for vue-loader
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['*', 'ts', '.js', '.vue', '.json']
  },
  //===========================================
  // PLUGINS
  //-------------------------------------------
  plugins: [
    // supports environment variables
    new dotenv_webpack({
      path: './config/dotenv/app-settings.' + dotenv + '.env',
      safe: './config/dotenv/.env.example'
    }),
    // generate html file which serve webpack bundles
    new html_webpack({
      template: './src/index.html'
    }),
    // copy static source which app need
    new copy_webpack(
      [
        { from: './src/template/', to: './template' },
        { from: './src/translate/', to: './translate' }
      ],
      {
        copyUnmodified: false,
        debug: 'info'
      }
    ),
    // config for vue-loader
    new vue_loader(),
    // register MiniCssExtractPlugin
    new extract_css({
      filename: '[name].[contenthash].css',
      chunkFilename: '[name].[contenthash].css'
    })
  ]
}

module.exports = webpack_base
