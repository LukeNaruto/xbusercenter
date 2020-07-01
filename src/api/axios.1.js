import axios from '../libs/api.request'
import md5 from 'js-md5'

export const getLogin = (params, data = null, type = 'get') =>{
    return axios.request({
      url: 'login.json',
      method: type,
      params,
      data
    })
  }
  // 获取hmac
  export const getHmac=()=>{
    return axios.request({
      url: 'login.json',
      method: 'get',
      params:{
        act:'hmac'
      },
    })
  }
  // 获取验证码
  export const getCaptcha = (data,hmac)=>{
    return axios.request({
      url: 'login.json',
      method: 'post',
      data:{
        act:'smscaptcha',
        s: md5(data.mobile + hmac),
        ...data
      },
    })
  }
  // 获取验证码
  export const getThirdcheck = (data)=>{
    return axios.request({
      url: 'login.json',
      method: 'post',
      data:{
        act:'thirdcheck',
        ...data
      },
    })
  }
  // 验证码登录
  export const loginCaptcha = (data)=>{//{mobile,captcha,areacode}
    return axios.request({
      url: 'login.json',
      method: 'post',
      data:{
        act:'smslogin',
        ...data
      },
    })
  }
  // 密码登录
  export const loginPassword = ({account,password,areacode,ori,redirect})=>{//{mobile,password,hmac,areacode}
  // console.log('loginPassword',mobile,password,areacode,ori)
    return axios.request({
      url: 'login.json',
      method: 'post',
      data:{
        act:'pwdlogin',//pwdlogin
        account,
        areacode,
        ori,
        redirect,
        password: md5(password)
      },
    })
  }
  // 账号注册
  export const loginRegister = ({account,password,ori,redirect,hmac})=>{
    return axios.request({
      url: 'login.json',
      method: 'post',
      data:{
        act:'accountreg',//pwdlogin
        account,
        ori,
        redirect,
        password: md5(password),
        s: md5(account + md5(password) + hmac)
      },
    })
  }
  // 登出
  export const loginout = ()=>{//{mobile,password,hmac}
  // console.log('loginout')
    return axios.request({
      url: 'login.json',
      method: 'get',
      params:{
        act:'logout'
      },
    })
  }
  // 找回密码
  export const submitPassword = ({mobile,areacode,captcha,password,ori,redirect})=>{//{password}
    return axios.request({
      url: 'login.json',
      method: 'post',
      data:{
        act:'getpwd',
        mobile,
        captcha,
        areacode,
        ori,
        redirect,
        password: md5(password)
      },
    })
  }
  // 第三方登录
  export const thirdPartyLogin = (data)=>{//{mobile,captcha,ori}
    return axios.request({
      url: 'login.json',
      method: 'post',
      data:{
        act: 'thirdreg',
        ...data
      },
    })
  }
  /* // 找回密码-- 验证验证码
  export const checkPasswordCaptcha = (data)=>{//{mobile,captcha,areacode}
    return axios.request({
      url: 'login.json',
      method: 'post',
      data:{
        act:'getpwd1',
        ...data
      },
    })
  }
  // 找回密码-- 提交密码
  export const submitPassword = ({password})=>{//{password}
    return axios.request({
      url: 'login.json',
      method: 'post',
      data:{
        act:'getpwd2',
        password: md5(password)
      },
    })
  } */
  // 获取用户资料
  export const getUserInfo = ()=>{
    return axios.request({
      url: 'home.json',
      method: 'get',
      params:{
        act:'baseinfo'
      },
    })
  }
  export const postHome = data =>
    axios.request({
      url: 'home.json',
      method: 'post',
      data
    })