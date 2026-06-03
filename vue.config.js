const webpack = require('webpack');

module.exports = {
  publicPath: '/',
  productionSourceMap: false,
  chainWebpack: config => {
    // 字体文件使用固定文件名（不带 hash），便于 preload
    config.module
      .rule('fonts')
      .set('generator', { filename: 'fonts/[name][ext]' })
    config.plugin('html').tap(args => {
      args[0].title = 'Briandolph Qi · 施工中'
      return args
    })
  },
  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'all',
            priority: 10
          }
        }
      }
    }
  }
}