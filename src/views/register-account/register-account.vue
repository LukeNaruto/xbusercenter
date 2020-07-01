<template>
  <div class="container">
    <h2 class="title">新用户注册</h2>
    <p class="sub-title">使用账号密码注册小白浏览器</p>
    <InputEl  @event_value="getAccount" :errInfo_="errInfo" @event_login="handleSubmit" placeholder="输入账号，由6-16位数字、字母组成" style="margin-top: 32px;"/>
    <InputPwd @event_pwd="getPwd" :pwdErrInfo_="pwdErrInfo" @event_login="handleSubmit" placeholder="输入密码，由6-20位数字、字母组成" style="margin-top: 32px;" />
     
    <InputPwd  @event_resetPwd="getresetPwd" :pwdErrInfo_="resetPwdErrInfo" @event_login="handleSubmit" :curPwd_="password" placeholder="再次输入密码" :resetFlag="true" style="margin-top: 32px;" />
    <button class="button-blue" @click="handleSubmit">立即注册</button>
    <div class="other-login">
      <!-- 其他方式登录
      <span class="icon iconfont iconqq" title="QQ登录" @click="thirdPartyLogin('qqlogin')"></span>
      <span class="icon iconfont iconweixin" title="微信登录" @click="thirdPartyLogin('wechatlogin')"></span>
      <span class="icon iconfont" :class="loginType === 1 ? 'icongeren' : 'iconphone'" :title="loginType === 2 ? '手机号快捷登录' : '账号密码登录'" @click="switch_login_type_(loginType === 1 ? 2 : 1)"></span> -->
      <strong @click="registerAccount"  title="已有账号？去登录">已有账号？去登录</strong>
      
    </div>
    <Jigsaw v-if="jigsaw" ref="jigsaw" @hide_jigsaw="jigsaw = false;" :success_cb="success_cb" />
    
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import InputEl from '@c/input-el';
export default {
  components: { InputEl},
  data(){
    return {
      confirmText: '',
      resetPwdDialogFlag: false,
      
      account: '',
      password: '',
      resetPwd: '',
      errInfo: {
        warnFlag: false,
        warnText: ''
      },
      pwdErrInfo:{
        warnFlag: false,
        warnText: ''
      },
      
      resetPwdErrInfo:{
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
  },
  
    computed: {
      ...mapState('main', {
        loginType: 'loginType'
      }),
    },
  mounted(){
  },  
  methods: {
    ...mapMutations('main',[ 'switch_login_type', 'registerAccount']),
    ...mapActions('main',['handleLoginRegister']),
    
    getAccount(account){
      this.account = account;
    },
    getPwd(pwd){
      this.password = pwd;
    },
    getresetPwd(pwd){
      this.resetPwd = pwd;
    },
    initErrInfo(){
      this.errInfo = {
        warnFlag: false,
        warnText: ''
      };
      this.pwdErrInfo = {
        warnFlag: false,
        warnText: ''
      };
      this.resetPwdErrInfo = {
        warnFlag: false,
        warnText: ''
      };
    },
    handleSubmit(){
      this.initErrInfo();
      if(!this.checkAccount(this.account)) return;
      if(!this.checkPassword(this.password)) return;
      if(!this.checkSamePwd(this.resetPwd)) return;

      let da_ = {
        account: this.account,
        password: this.password,
        ori: this.ori,
        redirect: this.redirect
      }
      this.jigsaw = true;
      this.success_cb = ()=>{
        this.handleLoginRegister(da_).catch(()=>{
          this.jigsaw = false;
        });
      };
    },
    switch_login_type_(type){
      // console.log(type)
      this.switch_login_type(type);
    },
    checkAccount(account){
      if(account === ''){
        this.errInfo.warnFlag = true;
        this.errInfo.warnText = '账号不能为空';
        return false;
      }else if(!this.isAccount(account)){
        this.errInfo.warnFlag = true;
        this.errInfo.warnText = '请输入6-16位账号';
        return false;
      }
      return true;
    },
    checkPassword(pwd){
      if(pwd === ''){
        this.pwdErrInfo.warnFlag = true;
        this.pwdErrInfo.warnText = '密码不能为空';
        return false;
      }else if(!this.isPassWord(pwd)){
        this.pwdErrInfo.warnFlag = true;
        this.pwdErrInfo.warnText = '请输入6-20位密码';
        return false;
      }
      return true;
    },
    
    checkSamePwd(pwd){
      // console.log('checkPassword---',pwd,this.password)
      if(pwd !== this.password){
        this.resetPwdErrInfo.warnFlag = true;
        this.resetPwdErrInfo.warnText = '前后密码不一致！';
        return false;
      }
      this.resetPwdErrInfo.warnFlag = false;
      return true;
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