<template>
<transition name="fade">
  <div class="dialog">
    <div class="container">
      <button @click="hide_regDialog_" class="close" title="关闭"><i class="icon iconfont iconClose-box-px"></i></button>
      <h1 class="logo"></h1>
      <!-- <h3 class="title">绑定手机号</h3> -->
      <h4 class="subtitle">初次登录，请绑定手机号</h4>
      
      <InputPhone id="phone_3" @event_get_number="getPhoneNum" :phoneErrInfo_="phoneErrInfo" />
      <div class="main" style="margin-top: 32px;">
        <InputVerify id="captcha_3" @errInfo_v="getErrInfo" :verifyErrInfo_="verifyErrInfo" :phoneInfo_="{...phoneInfo, type: 6}" @event_get_captcha="getCaptcha" @event_login="handleSubmit" style="margin-top: 32px;" />    
        <!-- <Spin ref="spin"></Spin>  
        <SpinBox></SpinBox> -->
        <button class="button-blue" @click="handleSubmit">确认</button>
      </div>

    </div>
  </div>
</transition>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
  export default {
    data(){
      return {
        phoneNum: '',
        sendingFlag: false,

        captcha: '',
        phoneInfo: {
          mobile: '',
          areacode: '',
        },
        verifyErrInfo: {
          warnFlag: false,
          warnText: ''
        },
        phoneErrInfo:{
          warnFlag: false,
          warnText: ''
        }
      }
    },
    created(){
      this.ori = this.getLocationSearchKey('ori') || 0;
      this.redirect = this.getLocationSearchKey('redirect') || '';
    },
    methods: {
      ...mapMutations('main',{
        hide_regDialog: 'hide_regDialog'
      }),
      ...mapActions('main',['handleThirdPartyLogin']),
      getPhoneNum(info){
        this.phoneInfo = info;
      },
      getErrInfo(infos){
        switch(infos.type){
          case 1: 
            this.phoneErrInfo = infos;
            break;
        }
      },
      getCaptcha(cap){
        /* this.verifyErrInfo = {
          warnFlag: false,
          warnText: ''
        }; */
        this.captcha = cap;
      },
      initErrInfo(){
        this.phoneErrInfo = {
          warnFlag: false,
          warnText: ''
        };
        this.verifyErrInfo = {
          warnFlag: false,
          warnText: ''
        };
      },
      handleSubmit(){
        if(!this.checkPhoneNum(this.phoneInfo.mobile)) return;
        if(!this.checkPhoneCode(this.captcha)) return;
        this.initErrInfo();
        // console.log(this.phoneInfo)
        let da = {
          ...this.phoneInfo,
          captcha: this.captcha,
          ori: this.ori,
          redirect: this.redirect
        }
        this.handleThirdPartyLogin(da).then(res => {
          /* let url = res.data.jump_url ? res.data.jump_url : '//puc.minibai.com';
          location.replace(url); */
        }).catch(err => {
          console.log(err);
          this.verifyErrInfo.warnFlag = true;
          this.verifyErrInfo.warnText = err.message;
        })
      },




      hide_regDialog_(){
        location.hash = '';
        this.hide_regDialog();
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
    }
  }
</script>
<style lang="less" scoped>
@blue: #009aff;
  .container {
    position: relative;
    width: 406px;
    height: 492px;
    padding: 48px 40px;
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
      margin: 24px 0;
      color: #666;
    }
    .close {
      position: absolute;
      width: 20px;
      height: 20px;
      top: 10px;
      right: 10px;
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
    margin: 32px 0 0;
  }
</style>
