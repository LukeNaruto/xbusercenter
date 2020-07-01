import axios from '../libs/api.request'
import md5 from 'js-md5'
// import config from '../../vue.config.js'
// const target = config.devServer.proxy['/api'].target

export const $api = {
  getLogin(params, data = null, type = 'get') {
    return axios.request({
      url: 'login.json',
      method: type,
      params,
      data
    })
  },

  getHmac() {
    return axios.request({
      url: 'login.json',
      method: 'get',
      params: {
        act: 'hmac'
      }
    })
  },

  getCaptcha(data, hmac) {
    axios.request({
      url: 'login.json',
      method: 'post',
      data: {
        act: 'smscaptcha',
        s: md5(data.mobile + hmac),
        ...data
      }
    })
  },

  getHome(params, data = null, type = 'get') {
    return axios.request({
      url: 'home.json',
      method: type,
      params,
      data
    })
  },

  postHome: data =>
    axios.request({
      url: 'home.json',
      method: 'post',
      data
    }),

  postLogin: data =>
    axios.request({
      url: 'login.json',
      method: 'post',
      data
    })

  // bind: data => `${target}home.json?act=${data}`
}
