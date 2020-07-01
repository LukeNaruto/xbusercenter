const BASE_URL = process.env.NODE_ENV === 'production' ? '/static/' : '/';
const path = require('path');
const resolve = (dir) => { return path.join(__dirname, dir) };

module.exports = {
  publicPath: BASE_URL,
  // assetsPublicPath: '/',
  productionSourceMap: false,
  lintOnSave: false,
  filenameHashing: true,
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('@s', resolve('src/static')) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set('@c', resolve('src/components'))
      .set('@const', resolve('src/constants'))
  },
  devServer: {
    port: process.env.NODE_ENV === 'production' ? 80 : 8000,
    proxy: {
      '/api': {
        target: process.env.NODE_ENV === 'production' ? 'http://puc.minibai.com/api/' : 'http://localhost.uc.minibai.com/api/',
        secure: false,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    },
    disableHostCheck: true,
  }
}