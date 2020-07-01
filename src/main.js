import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@/assets/font/iconfont.css'
import '@s/css/index.less'
import store from './store/index'
import iView from 'iview'
import 'iview/dist/styles/iview.css';
import api from './api/index'
import ConfirmBox from '@c/confirm-box';
import BBSLogin from '@c/bbs-login';
import AlertBox from '@c/alert-box';
import registerDialog from '@c/register-dialog';
import SpinBox from '@c/spin-box';
import AreaCode from '@c/area-code'
import Jigsaw from '@c/jigsaw'
import md5 from 'js-md5';
import Cookies from 'js-cookie';
let Base64 = require('js-base64').Base64;

import InputPhone from '@c/input-phone';
import InputVerify from '@c/input-verify';
import InputPwd from '@c/input-pwd';
Vue.component('InputPhone',InputPhone);
Vue.component('InputVerify',InputVerify);
Vue.component('InputPwd',InputPwd);
Vue.component('AreaCode',AreaCode);
Vue.component('Jigsaw',Jigsaw);
Vue.component('BBSLogin',BBSLogin);

Vue.prototype.$base64 = Base64
Vue.prototype.$md5 = md5
Vue.prototype.$cookies = Cookies
Vue.component('SpinBox',SpinBox)
Vue.component('registerDialog',registerDialog)
Vue.component('ConfirmBox',ConfirmBox)
Vue.component('AlertBox',AlertBox)
Vue.use(iView)
Vue.use(api)
Vue.config.productionTip = false;
store.commit('main/checkBeXb');
store.commit('main/checkBeNoTrace');
const vue_ = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
export default vue_;