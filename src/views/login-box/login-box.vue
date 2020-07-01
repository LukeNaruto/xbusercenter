<template>
  <div class="container">
    <h2 class="title">欢迎登录小白</h2>
    <p class="sub-title">{{loginType === 1 ? '未注册的手机号验证后自动创建小白账户' : '请使用账号密码登录'}}</p>
    <div v-if="loginType == 1">
      <InputPhone id="phone_1" @event_get_number="getPhoneNum" :phoneErrInfo_="phoneErrInfo" />
      <InputVerify id="captcha_1" @errInfo_v="getErrInfo" :verifyErrInfo_="verifyErrInfo" :phoneInfo_="{...phoneInfo, type: 1}" @event_get_captcha="getCaptcha" @event_login="handleSubmit" style="margin-top: 32px;" />    
    </div>
    
    <div v-if="loginType == 2" >
      <InputEl  @event_value="getAccount" :errInfo_="accountErrInfo" placeholder="输入账号" style="margin-top: 32px;"/>
      <InputPwd id="pwd_1" @event_pwd="getPwd" :pwdErrInfo_="pwdErrInfo" @event_login="handleSubmit" style="margin-top: 32px;">
        
      </InputPwd>
    </div>
    <Jigsaw v-if="jigsaw" ref="jigsaw" @hide_jigsaw="jigsaw = false;" :success_cb="success_cb" />
    <button class="button-blue" @click="handleSubmit">登录</button>
    <div class="other-login">
      其他方式登录
      <span class="icon iconfont iconqq" title="QQ登录" @click="thirdPartyLogin('qqlogin')"></span>
      <span class="icon iconfont iconweixin" title="微信登录" @click="thirdPartyLogin('wechatlogin')"></span>
      <span class="icon iconfont" :class="loginType === 1 ? 'icongeren' : 'iconphone'" :title="loginType === 2 ? '手机号快捷登录' : '账号密码登录'" @click="switch_login_type_(loginType === 1 ? 2 : 1)"></span>
      
      <strong @click="registerAccount"  title="注册账号">注册账号</strong>
      <strong v-if="loginType == 2" @click="resetPwdDialogFlag = true" title="忘记密码" style="margin-right: 14px;">忘记密码</strong>
      
    </div>
    <RegisterDialog v-if="regDialogFlag"  @hide_regDialog="hide_regDialogFn" />
    <ResetpwdDialog v-if="resetPwdDialogFlag" @hide_resetPwdDialog="resetPwdDialogFlag = false" />
    <BBSLogin v-show="shortcutLoginShow" v-if="(ori === 1 || ori === 3) && user_info_data.avatar" @shortcut_login_close="handleShortcutLoginClose" :avatar="user_info_data.avatar" />
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import RegisterDialog from '@c/register-dialog';
import InputEl from '@c/input-el';
import ResetpwdDialog from '@c/resetpwd-dialog';
export default {
  components: {RegisterDialog, ResetpwdDialog, InputEl},
  data(){
    return {
      rePhoneCode: '',
      rePassword1: '',
      rePassword2: '',
      //sendingFlag: false,
      
      confirmFlag: false,
      confirmText: '',

      areaCodeFlag: false,
      areacode:'86',
      resetPwdDialogFlag: false,
      shortcutLoginShow: false,
      account: '',
      password: '',
      captcha: '',

      phoneInfo: {
        mobile: '',
        areacode: '',
      },
      verifyErrInfo: {
        warnFlag: false,
        warnText: ''
      },
      pwdErrInfo:{
        warnFlag: false,
        warnText: ''
      },
      phoneErrInfo:{
        warnFlag: false,
        warnText: ''
      },
      accountErrInfo:{
        warnFlag: false,
        warnText: ''
      },
      jigsaw: false,
      success_cb: null,
    }
  },
  created(){
    this.ori = this.getLocationSearchKey('ori') || 0;
    
    this.redirect = this.getLocationSearchKey('redirect') || '';
    if (location.hash === '#thirdreg') {
      this.show_regDialog()
    }
    if(!sessionStorage.getItem('_bbs_l_') && this.ori == 1){
      sessionStorage.setItem('_bbs_l_', '1');
      this.shortcutLoginShow = true;
      this.initSession('_bbs_l_');
    }
    if(!sessionStorage.getItem('_ass_l_') && this.ori == 3){
      sessionStorage.setItem('_ass_l_', '1');
      this.shortcutLoginShow = true;
      this.initSession('_ass_l_');
    }
  },
  watch:{
    $route(){
      this.jigsaw = false;
    }
  },
  computed: {
    ...mapState('main', {
      regDialogFlag: 'regDialogFlag',
      loginType: 'loginType',
      user_info_data: 'user_info_data',
    }),
  },
  mounted(){
  },  
  methods: {
    ...mapMutations('main',['hide_regDialog', 'show_regDialog', 'switch_login_type', 'registerAccount']),
    ...mapActions('main',['handleLoginByCaptcha','handleLoginByPassword']),
    getErrInfo(infos){
      switch(infos.type){
        case 1: 
          this.phoneErrInfo = infos;
          break;
      }
    },
    initSession(key){
      setInterval(()=>{
        sessionStorage.setItem('_ass_l_', '');
      },10 * 1000 * 60);
    },
    handleShortcutLoginClose(){
      this.shortcutLoginShow = false;
    },
    getAccount(account){
      this.account = account;
    },
    getPhoneNum(info){
      this.phoneInfo = info;
    },
    getCaptcha(cap){
      this.captcha = cap;
    },
    getPwd(pwd){
      this.password = pwd;
    },
    initErrInfo(){
      this.phoneErrInfo = {
        warnFlag: false,
        warnText: ''
      };
      this.pwdErrInfo = {
        warnFlag: false,
        warnText: ''
      };
      this.verifyErrInfo = {
        warnFlag: false,
        warnText: ''
      };
      
      this.accountErrInfo = {
        warnFlag: false,
        warnText: ''
      };
    },
    handleSubmit(){
      this.initErrInfo();
      switch(this.loginType){
        case 1:
          if(!this.checkPhoneNum(this.phoneInfo.mobile) || !this.checkPhoneCode(this.captcha)) return;
          
          let da = {
            ...this.phoneInfo,
            captcha: this.captcha,
            ori: this.ori,
            redirect: this.redirect
          }
          this.handleLoginByCaptcha(da).then(res => {
            /* let url = res.data.jump_url ? res.data.jump_url : '//puc.minibai.com';
            location.replace(url); */
          }).catch(err => {
            this.verifyErrInfo.warnFlag = true;
            this.verifyErrInfo.warnText = err.message;
          })
          break;
        case 2:
          if(!this.checkAccount(this.account) || !this.checkPassword(this.password)) return;
          this.jigsaw = true;
          let da_ = {
            account: this.account,
            password: this.password,
            ori: this.ori,
            redirect: this.redirect
          }
          this.success_cb = ()=>{
            this.handleLoginByPassword(da_).catch(()=>{
              this.jigsaw = false;
            });
          }
          
          break;
      }
    },
    hide_regDialogFn(){
      this.regDialogFlag = false;
    },
    switch_login_type_(type){
      // console.log(type)
      this.switch_login_type(type);
      this.toPhoneNumInputError({});
    },
    toPhoneNumInputError({warnText_='',warnFlag_=false}){
      this.phoneNumErrorInfo = warnText_;
      this.phoneNumErrorFlag = warnFlag_;
    },
    checkPhoneNum(num){
      if(num === ''){
        this.phoneErrInfo.warnFlag = true;
        this.phoneErrInfo.warnText = '手机号码不能为空';
        return false;
      }else if(!this.isPhoneNum(num)){
        this.phoneErrInfo.warnFlag = true;
        this.phoneErrInfo.warnText = '手机号码有误';
        return false;
      }
      return true;
    },
    checkAccount(account){
      if(account === ''){
        this.accountErrInfo.warnFlag = true;
        this.accountErrInfo.warnText = '账号不能为空';
        return false;
      }else if(!this.isAccount(account)){
        this.accountErrInfo.warnFlag = true;
        this.accountErrInfo.warnText = '请输入6-16位数字、字母组成的账号';
        return false;
      }
      return true;
    },
    checkPassword(psw){
      if(psw === ''){
        this.pwdErrInfo.warnFlag = true;
        this.pwdErrInfo.warnText = '密码不能为空';
        return false;
      }else if(!this.isPassWord(psw)){
        this.pwdErrInfo.warnFlag = true;
        this.pwdErrInfo.warnText = '请输入6-20位数字、字母组成的密码';
        return false;
      }
      return true;
    },
    checkPhoneCode(num){
      if(num === ''){
        this.verifyErrInfo.warnFlag = true;
        this.verifyErrInfo.warnText = '验证码不能为空';
        return false;
      }else if(!this.isPhoneCode(num)){
        this.verifyErrInfo.warnFlag = true;
        this.verifyErrInfo.warnText = '验证码有误';
        return false;
      }
      return true;
    },
    thirdPartyLogin(type){
      window.open('/api/login.json?act='+type+'&ori='+this.ori+'&redirect='+this.redirect,'_self');
    },
  }
}
</script>
<style lang="less" scoped>
  .other-login{
    height: 32px;
    line-height: 32px;
    font-size: 12px;
    color: #444;
    .icon{
      width: 20px;
      height: 20px;
      line-height: 20px;
      padding-right: 1px;
      display: inline-block;
      vertical-align: middle;
      text-align: center;
      font-size: 16px;
      margin-left: 8px;
      cursor: pointer;
      color: #fff;
      border-radius: 50%;
      transition: background .8s ease-in-out,color .5s ease-in-out;
      box-sizing: border-box;
    }
    .iconqq{
      background: #71d4f9;
      &:hover{
        color: #71d4f9;
        background: #fff;
      }
    }
    .iconweixin{
      background: #8fd392;
      &:hover{
        color: #8fd392;
        background: #fff;
      }
    }
    .iconphone, .icongeren{
      background: #66c2ff;
      &:hover{
        color: #66c2ff;
        background: #fff;
      }
    }
    
  }
  .container{
    margin: 0 auto;
    width: 420px;
    height: 450px;
  }
  .title{
    height: 42px;
    line-height: 42px;
    color: #222;
    font-size: 24px;
    text-align: center;
  }
  .sub-title{
    height: 28px;
    line-height: 28px;
    color: #666;
    font-size: 14px;
    text-align: center;
    margin-bottom: 44px;
  }
  .button-blue{
    //position: absolute;
    width: 100%;
    height: 46px;
    margin: 32px 0 32px;
  }
  strong{
    float: right;
    font-weight: normal;
    cursor: pointer;
  }
  .forget-pwd{
    position: absolute;
    right: -64px;
    top: 24px;
  }
</style>