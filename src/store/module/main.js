import Cookies from 'js-cookie';
import {
  getLogin,
  getCaptcha,
  getHmac,
  loginCaptcha,
  loginPassword,
  loginRegister,
  getUserInfo,
  //checkPasswordCaptcha,
  submitPassword,
  loginout,
  thirdPartyLogin,
  getThirdcheck
} from '../../api/axios.1';
import {getLocationSearchKey, handleJump_url} from '../../libs/util';
let checkState = (state)=>{
  if(!state.isXb){
    state.alertNotBeXB = true;
    return;
  }
  /* if(state.curHash === '#thirdreg'){
    state.regDialogFlag = true;
    return;
  } */
  if(state.isNotrace){
    state.alertNotrace = true;
    return;
  }
  if(!state.isLogin){
    return;
  }
  return true;
}
const init_info_data = {
  mobile:'',
  pdset:0,
  grade: 1,
  days: 0,
  active_days: 0,
  bbs_message: 0,
  bbs_post: 0,
  bbs_activity: 0,
  avatar: null,
  nickname: '-',
  sex: '',
  birthday: '',
  realname: '',
  sign: '',
  homepage: '',
  address: '',
  province: 0,
  city: 0,
  district: 0,
};
export default{
  namespaced: true,
  state: {
    login_dialog_flag: true,
    user_info_data:{...init_info_data},
    isLogin: false,
    isEdit: false,
    isXb: false,
    isNotrace: false,
    alertNotrace: true,
    alertNotBeXB: true,
    showOrHideSyncBox: false,
    regDialogFlag: false,
    curHash:'',
    loginType: +localStorage.getItem('loginType') || 2,//1-> 验证码，2-> 密码, 3-> 找回密码
    isRegister: false,//注册账号界面
    toOther: false, //to bbs or skin.etx || 类似 loading 功能
  },
  mutations: {
    set_toOther(state,payload){
      state.toOther = payload;
    },
    registerAccount(state){
      state.isRegister = !state.isRegister;
    },
    get_bbs_jssrc(state,payload){
      let oScript = document.createElement('script');
      oScript.src = payload;
      oScript.id="bbs_js";
      document.body.appendChild(oScript);
      setTimeout(()=>{
        let removeDom = document.getElementById('bbs_js');
        if(removeDom) document.body.removeChild(removeDom);
      },1000);
    },
    checkState(state){
      checkState(state);
    },
    get_user_info_data(state,payload){
      state.user_info_data = {
        ...init_info_data,
        ...payload
      };
    },
   
    switch_login_type(state,payload){
      state.loginType = payload;
      localStorage.setItem('loginType', payload);
    },
    get_hash(state,hash){
      state.curHash = hash;
    },
    login_success(state){
      state.isLogin = true;
    },
    login_fail(state){
      state.isLogin = false;
    },
    show_regDialog(state){
      state.regDialogFlag = true;
    },
    hide_regDialog(state){
      state.regDialogFlag = false;
    },
    switch_loginout(state){
      state.user_info_data = {
        ...init_info_data
      }
      state.isEdit = false;
      state.isLogin = false;
      // console.log(state)
    },
    get_init_info_data(state){
      state.user_info_data = {
        ...init_info_data
      }
    },
    show_login_dialog(state,bool=true){
      state.login_dialog_flag = true;
      if(!checkState(state)) return;
      if(bool){
        state.isEdit = false;
        state.isLogin = false;
        //location.pathname = '';
      }
    },
    hide_login_dialog(state){
      state.login_dialog_flag = false;
      // state.loginType = 1;
    },
    show_edit(state){
      state.isEdit = true;
    },
    hide_edit(state){
      state.isEdit = false;
    },
    switch_isXb(state){
      state.alertNotBeXB = !state.alertNotBeXB;
    },
    switch_isNotrace(state){
      state.alertNotrace = !state.alertNotrace;
    },
    hide_isNotrace(state){
      state.alertNotrace = false;
    },
    checkBeXb(state){
      let ori = getLocationSearchKey('ori') || 0;
      if(ori == 1 || ori == 3 ){
        state.isXb = true;
      }else{
        let c = /XiaoBai\/1?(.*)/,
            d = navigator.userAgent.match(c);
        state.isXb = navigator.xbVersion ? true : d != null;
      }
      
      state.user_info_data = {
        ...init_info_data
      }
    },
    checkBeNoTrace(state){
      if(chrome.xb && chrome.xb.isOffTheRecord) chrome.xb.isOffTheRecord ((res)=>{// true false
        state.alertNotrace = res;
      });
    },
    skipToForum(state,url){
      if(!checkState(state)) return;
      window.open(url,'_blank');
    },
    skipToType(state,data){
      if(!checkState(state)) return;
      if(chrome.xb && !data.url) chrome.xb.showRightSidePanel ('xbbrowser://xbpanel/#/' + data.type);
      if(chrome.xb && data.type === 'settings')  chrome.xb.switchToExtensionManager('chrome://settings/',-1);
      if(chrome.xb && data.type !== 'settings' && data.url) chrome.xb.switchToExtensionManager(data.url,-1);
    },
    switchSyncData(state){
      if(!checkState(state)) return;
      state.showOrHideSyncBox = !state.showOrHideSyncBox;
    },
    initState(state){
      
    },
  },
  actions: {
    //获取hmac
    handleGetHmac(){
      return new Promise((resolve, reject) => {
        getHmac().then((res)=>{
          // console.log('getHmac__',res.data.uc_hmac);
          let hmac = res.data.uc_hmac;
          resolve(hmac);
        }).catch(err => {
          reject(err);
        })
      })
    },
    //获取验证码 getCaptcha
    handleGetCaptcha({dispatch,commit},opts){//type:[1,3,6]
      return new Promise((resolve, reject) => {
        dispatch('handleGetHmac').then((hmac)=>{
          getCaptcha(opts,hmac).then(res => {
            // console.log('getCaptcha__',res)
            //commit('show_login_dialog')
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        })
      })
    },
    //验证码登录 loginCaptcha
    handleLoginByCaptcha({dispatch,commit},opts){
      return new Promise((resolve, reject) => {
        loginCaptcha(opts).then((res)=>{
          commit('get_bbs_jssrc',res.data.bbs_jssrc);
          //if (chrome.xb) chrome.xb.setUserStatus(2, '{"nk":"' + res.data.nickname + '","av":"' + res.data.avatar + '"}');
          if(chrome.xb) chrome.xb.setUserStatus(1,res.data.c);
          setTimeout(()=>{
            let url = res.data.jump_url;
            handleJump_url(url,()=>{
              dispatch('handleGetUserInfo');
            })
          },1000);
            resolve(res);
        }).catch((error)=>{
          commit('login_fail');
          // console.log('handleLoginByCaptcha',error)
          reject(error);
        })
      })
    },
    //密码登录 loginCaptcha
    handleLoginByPassword({dispatch,commit},opts){
      //dispatch('handleGetHmac').then((hmac)=>{
        return new Promise((resolve, reject) => {
          loginPassword(opts).then((res)=>{
            commit('get_bbs_jssrc',res.data.bbs_jssrc);
            // console.log('密码登录',res.data.c)
            if(chrome.xb) chrome.xb.setUserStatus(1,res.data.c);
            setTimeout(()=>{
              let url = res.data.jump_url;
              handleJump_url(url,()=>{
                dispatch('handleGetUserInfo');
              });
            },1000);
              resolve(res);
          }).catch((error)=>{
            commit('login_fail');
            reject(error);
          })
        })
      //})
    },
    handleLoginRegister({dispatch,commit},opts){
      dispatch('handleGetHmac').then((hmac)=>{
        return new Promise((resolve, reject) => {
          opts.hmac = hmac;
          loginRegister(opts).then((res)=>{
            commit('registerAccount');
            commit('get_bbs_jssrc',res.data.bbs_jssrc);
            if(chrome.xb) chrome.xb.setUserStatus(1,res.data.c);
            setTimeout(()=>{
              let url = res.data.jump_url;
              handleJump_url(url,()=>{
                dispatch('handleGetUserInfo');
              });
            },1000);
            resolve(res);
          }).catch((error)=>{
            reject(error);
          })
        })
      })
    },
    //获取用户信息
    handleGetUserInfo({state, commit, dispatch}){
      commit('get_init_info_data');
      commit('set_toOther', true);
      return new Promise((resolve, reject) => {
        dispatch('getApiUserInfo', { act: "baseinfo" }, { root: true }).then((res)=>{
        // getUserInfo().then((res)=>{
          commit('get_user_info_data', res.data);
          commit('set_toOther', false);
          if(getLocationSearchKey('ori') != 1 && getLocationSearchKey('ori') != 3){
            commit('hide_login_dialog');
            commit('hide_regDialog');
            commit('login_success');
          }
          // if (chrome.xb && res.data.is_change) chrome.xb.setUserStatus(2, '{"nk":"' + res.data.nickname + '","av":"' + res.data.avatar + '"}');
          resolve(res);
        }).catch((error)=>{//todo
          // console.log('getUserInfo__',error)
          let  domain = ~location.host.indexOf('minibai.com') ? 'minibai.com' : undefined;
          Cookies.set('token','',{
            expires: -1000,
            domain,
          });
          
          commit('get_init_info_data');
          commit('set_toOther', false);
          commit('show_login_dialog');
          if(chrome.xb) chrome.xb.setUserStatus(0,'0');
          reject(error);
        })
      })
    },
    /* //验证 重设密码的 验证码
    handleCheckPasswordCaptcha({mobile,captcha}){
      return new Promise((resolve, reject) => {
        checkPasswordCaptcha({mobile,captcha}).then((res)=>{

        }).catch((error)=>{
          reject(error);
        })
      })
    }, */
    // 找回(重设)密码 checkPasswordCaptcha
    handleResettingPassword({dispatch,commit},opts){
      //dispatch('handleCheckPasswordCaptcha',{mobile,captcha}).then((res)=>{
        return new Promise((resolve, reject) => {
          
          submitPassword(opts).then((res)=>{
            // console.log('找回密码成功',res)
            // commit('hide_login_dialog');
            let url = res.data.jump_url;
            handleJump_url(url,()=>{
              location.reload();
            });
            resolve(res);
          }).catch((error)=>{
            reject(error);
          })
        })
      //})
    },
    // 登出
    handleLoginout({dispatch,commit}){
      return new Promise((resolve, reject) => {
        loginout().then((res)=>{
          if(chrome.xb)chrome.xb.setUserStatus(0,res.data.uid);
          commit('switch_loginout');
          commit('get_bbs_jssrc',res.data.bbs_jssrc);
          Cookies.set('thirdlogin','',{
            expires: -1000,
          });
          Cookies.set('token','',{
            expires: -1000,
            domain: 'minibai.com',
          });
          dispatch('handleGetUserInfo');
          //commit('hide_login_dialog');
          resolve(res);
        }).catch((error)=>{
          // console.log('退出登录-fail',error)
          reject(error);
        })
      })
    },
    // 第三方登录
    handleThirdPartyLogin({dispatch,commit,state},opts){
      // console.log('第三方登录act',mobile,captcha)
      return new Promise((resolve, reject) => {
        thirdPartyLogin(opts).then((res)=>{
          // console.log('第三方登录', res)
          commit('get_bbs_jssrc',res.data.bbs_jssrc);
          location.hash = '';
          //if (chrome.xb) chrome.xb.setUserStatus(2, '{"nk":"' + res.data.nickname + '","av":"' + res.data.avatar + '"}');
          if(chrome.xb) chrome.xb.setUserStatus(1,res.data.c);
          setTimeout(()=>{
            commit('hide_regDialog');
            let url = res.data.jump_url;
            handleJump_url(url,()=>{
              dispatch('handleGetUserInfo');
            });
          },1000);
          resolve(res);
        }).catch((error)=>{
          // console.log('第三方登录',error)
          commit('login_fail');
          reject(error);
        })
      })
    },
    handleThirdcheck({dispatch,commit,state},{mobile,captcha,areacode}){
      return new Promise((resolve, reject) => {
        getThirdcheck({mobile,areacode}).then((res)=>{
          dispatch('handleGetCaptcha',{mobile,areacode,type:6});
          resolve(res);
        }).catch((error)=>{
          reject(error);
        })
      })
    }
    
  }
}
