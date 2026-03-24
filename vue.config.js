const webpack = require('webpack');

module.exports = {
  publicPath: './',
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = 'Briandolph Qi · 施工中'
      return args
    })
  }
}