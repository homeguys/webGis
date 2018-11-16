const path = require('path')
const webpack = require('webpack')
const HTMLPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const baseConfig = require('./webpack.config.base')
const merge = require('webpack-merge')
const config = merge(baseConfig, {
  // mode: 'production',
  output: {
    filename: '[name].[chunkhash:8].js'
  },
  module: {
    rules: [
      {
        test: /\.styl$/,
        use: [
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true
            }
          },
          'stylus-loader'
        ]
      }
    ]
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    },
    runtimeChunk: true
  },
  plugins: [
    new HTMLPlugin(),
    new MiniCssExtractPlugin({
      // filename: 'style.[contentHash:8].css',
      filename: '[name].css',
      chunkFilename: '[id].css'
    })
  ],
  performance: {
    hints: false
  }
})

module.exports = config
