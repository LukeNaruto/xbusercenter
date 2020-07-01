import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import Cookies from 'js-cookie';
import store from '../store/index'
import {getLocationSearchKey} from '../libs/util';

function getToken(){
  const token = Cookies.get('token');
  if (token) return token
  else return false
};
Vue.use(Router)
const router = new Router({
  routes,
  mode: 'history'
})

const HOME_PAGE_NAME = 'home';
const PAGE_NAME_ARR = ['home', 'edit'];
router.beforeEach((to, from, next) => {
  let c = /XiaoBai\/1?(.*)/,
      d = navigator.userAgent.match(c),
      isXb = navigator.xbVersion ? true : d != null;
  let isLogin = !isXb ? false : getToken();
  // const token = getToken()
  if (!isLogin && to.name !== HOME_PAGE_NAME) {
    // 未登录且要跳转的页面不是登录页
    store.commit('main/get_init_info_data');
    store.commit('main/show_login_dialog');
    next({
      name: HOME_PAGE_NAME // 跳转到登录页
    })
  } else if (!isLogin && to.name === HOME_PAGE_NAME) {
    // 未登陆且要跳转的页面是登录页
    // console.log(2,to.name)
    store.commit('main/get_init_info_data');
    store.commit('main/show_login_dialog');
    next() // 跳转
  }else if(isLogin && PAGE_NAME_ARR.indexOf(to.name) < 0){
    next({
      name: HOME_PAGE_NAME // 跳转到登录页
    })
  }else if(isLogin && PAGE_NAME_ARR.indexOf(to.name) >= 0){
    // console.log(3,to.name)
    next()
  } 
})

router.afterEach(to => {
  window.scrollTo(0, 0)
})

export default router
