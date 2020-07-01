<template>
<transition name="fade">
  <div class="dialog">
    <div class="container">
      <button @click="$emit('hide_resetPwdDialog')" class="close" title="关闭"><i class="icon iconfont iconClose-box-px"></i></button>
      <h1 class="logo"></h1>
      <!-- <h3 class="title">绑定手机号</h3> -->
      <h4 class="subtitle">找回密码</h4>
      
      <InputPhone tabindex="1" id="phone_2" @event_get_number="getPhoneNum" :phoneErrInfo_="phoneErrInfo" class="phone_2" />
      
      <InputPwd tabindex="3" id="pwd_2_1" @event_pwd="getPwd" :pwdErrInfo_="pwdErrInfo" :placeholder="'新密码，由6-20位数字、字母组成'" style="margin-top: 6px;"/>
      <InputPwd tabindex="4" id="pwd_2_2" @event_resetPwd="getresetPwd" :pwdErrInfo_="resetPwdInfo" :curPwd_="password" @event_login="handleSubmit" :placeholder="'再次输入密码'" :resetFlag="true" style="margin-top: 6px;"/>
      <InputVerify tabindex="2" id="captcha_2" @errInfo_v="getErrInfo" :verifyErrInfo_="verifyErrInfo" :phoneInfo_="{...phoneInfo, type: 2}" @event_get_captcha="getCaptcha" style="margin-top: 6px;" class="captcha_2" />    
      <button tabindex="5" class="button-blue" @click="handleSubmit">确认</button>

    </div>
  </div>
</transition>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
export default {
  data(){
    return {
      sendingFlag: false,

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
      resetPwdInfo:{
        warnFlag: false,
        warnText: ''
      },
      phoneErrInfo:{
        warnFlag: false,
        warnText: ''
      },
      captcha: '',
      resetPwd: '',
      password: '',
    }
  },
  created(){
    this.ori = this.getLocationSearchKey('ori') || 0;
    this.redirect = this.getLocationSearchKey('redirect') || '';
  },
  methods: {
    ...mapActions('main',['handleResettingPassword']),
    getErrInfo(infos){
      switch(infos.type){
        case 1: 
          this.phoneErrInfo = infos;
          break;
      }
    },
    initErrInfo(){
      this.phoneErrInfo = {
        warnFlag: false,
        warnText: ''
      };
      this.resetPwdInfo = {
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
    },
    getresetPwd(pwd){
      this.resetPwd = pwd;
    },
    getPwd(pwd){
      this.password = pwd;
    },
    getPhoneNum(info){
      this.phoneInfo = info;
    },
    getCaptcha(cap){
      this.captcha = cap;
    },
    handleSubmit(){
      this.initErrInfo();
      
      if(!this.checkPhoneNum(this.phoneInfo.mobile)) return;
      if(!this.checkPhoneCode(this.captcha)) return;
      if(!this.checkPassword(this.password)) return;
      if(!this.checkSamePwd(this.resetPwd)) return;
      let da = {
        ...this.phoneInfo,
        captcha: this.captcha,
        password: this.password,
        ori: this.ori,
        redirect: this.redirect
      }
      this.handleResettingPassword(da).then(res => {
        /* let url = res.data.jump_url ? res.data.jump_url : '//puc.minibai.com';
        location.replace(url); */
      }).catch(err => {
        this.verifyErrInfo.warnFlag = true;
        this.verifyErrInfo.warnText = err.message;
      })
    },





    
    
    checkPhoneNum(num){
      // console.log(1,num)
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
    checkPassword(psw){
      if(psw === ''){
        this.pwdErrInfo.warnFlag = true;
        this.pwdErrInfo.warnText = '密码不能为空';
        return false;
      }else if(!this.isPassWord(psw)){
        this.pwdErrInfo.warnFlag = true;
        this.pwdErrInfo.warnText = '请输入6-20位密码';
        return false;
      }
      return true;
    },
    checkSamePwd(psw){
      if(psw !== this.password){
        this.resetPwdInfo.warnFlag = true;
        this.resetPwdInfo.warnText = '前后密码不一致！';
        return false;
      }
      this.resetPwdInfo.warnFlag = false;
      return true;
    },
  }
}
</script>
<style lang="less" scoped>
@blue: #009aff;

.phone_2{
  margin-bottom: 62px;
}
  .container {
    position: relative;
    width: 406px;
    height: 492px;
    padding: 32px 40px;
    border: 1px solid #d7d7d8;
    border-radius: 2px;
    font-size: 14px;
    box-sizing: border-box;
    background: #fff;
    text-align: center;
    box-shadow: 0 6px 16px rgba(0, 0, 0, .1);
    .logo{
      width: 80px;
      height: 80px;
      background: url('../../static/img/p0_title.png') no-repeat;
      background-size: cover;
      margin: 0 auto;
    }
    .title {
      font-size: 16px;
      line-height: 42px;
      text-align: center;
      margin-bottom: 30px;
    }
    .subtitle{
      margin: 24px 0 6px 0;
      color: #666;
    }
    .close {
      position: absolute;
      width: 20px;
      height: 20px;
      top: 10px;
      right: 10px;
    }
    .captcha_2{
      position: absolute;
      left: 42px;
      top: 218px;
      width: calc(100% - 80px);
    }
  }
  /* .vCode-input{
    width: 266px;
    margin-right: 6px;
  }
  .input{
    width: 100%;
    height: 40px;
    margin-bottom: 12px;
    &.vCode-input > input{
      width: 64%;
    }
  } */
  .button-blue{
    width: 100%;
    height: 40px;
    margin: 16px 0 0;
  }
</style>
