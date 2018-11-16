const path = require('path')
const webpack = require('webpack')
const HTMLPlugin = require('html-webpack-plugin')
const baseConfig = require('./webpack.config.base')
const merge = require('webpack-merge')

const devServer = {
  port: '8080',
  compress: true,
  host: 'localhost',
  overlay: {
    errors: true
  },
  hot: true,
  open: true
}

const config = merge(baseConfig, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  module: {
    rules: [
      // {
      //   test: /\.styl$/,
      //   use: [
      //     'css-loader',
      //     // {
      //     //   loader: 'postcss-loader',
      //     //   options: {
      //     //     sourceMap: true
      //     //   }
      //     // },
      //     'style-loader',
      //     'stylus-loader'
      //   ]
      // }
      // sass配置
      {
        test: /\.scss$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader'],
      }
    ]
  },
  devServer,
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HTMLPlugin({
      template: path.join(__dirname, '../public/index.html')
    }),
    new webpack.NamedModulesPlugin()
  ]
})

module.exports = config
