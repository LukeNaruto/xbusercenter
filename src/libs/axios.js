import axios from 'axios'
import vue_ from '../main'
import Cookies from 'js-cookie';
class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        //
      }
    }
    return config
  }
  destroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 添加全局的loading...
      if (!Object.keys(this.queue).length) {
        // Spin.show() // 不建议开启，因为界面不友好
      }
      this.queue[url] = true
      return config
    }, error => {
      //console.log(1,error.response)
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use((res)=>{
      this.destroy(url)
      const { data, status, message } = res;
      let message_ = message || data.message;
      if(res.config.method.toLocaleLowerCase() === 'post' && message_){
        vue_.$Message.info({
          content: '<span class="icon iconfont iconSuccess-px1"></span>' + message_,
          duration: 2.5,
        });
      }
      return data//{ data, status }
    },(error)=>{
      let thirdlogin = JSON.parse(Cookies.get('thirdlogin') || '{}') || {};
      let errorIcon = error.response.data.message === '请先登录' ? 'iconPrompt-px2' : 'iconfail-px1';
      
      if(thirdlogin.c !== '' || location.hash !== '#thirdlogin') vue_.$Message.info({
        content: '<span class="icon iconfont '+ errorIcon +'"></span>' + error.response.data.message,
        duration: 2.5,
      });
      this.destroy(url)
      return Promise.reject(error.response.data)
    })
  }
  request (options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
