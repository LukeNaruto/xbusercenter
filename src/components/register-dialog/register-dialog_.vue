<template>
<transition name="fade">
  <div class="dialog">
    <div class="container">
      <button @click="hide_regDialog_" class="close" title="关闭"><i class="icon iconfont iconClose-box-px"></i></button>
      <h1 class="logo"></h1>
      <h3 class="title">绑定手机号</h3>
      <h4 class="subtitle">初次登录，请绑定手机号：</h4>
      <AreaCode v-if="areaCodeFlag" @user_area_code="getAreaCode" @user_area_code_hide="hideAreaCode" />
      <InputEl class="input" v-model="phoneNum" placeholder="手机号码" :areaCode="{type: true,areacode}" :errorInfo="phoneNumErrorInfo" :errorFlag="phoneNumErrorFlag" @user_show_area_code="showAreaCode" />
      <div class="main">
        <InputVerify class="input vCode-input" @keyup.enter.native="handleSubmit" @user_phoneNum_error="toPhoneNumInputError" v-model="phoneCode" :opt="{areacode,phoneNum,type: 6}" />
        <!-- <Spin ref="spin"></Spin>  
        <SpinBox></SpinBox> -->
        <button class="button-blue" @click="handleSubmit">确认</button>
      </div>

    </div>
  </div>
</transition>
</template>
<style lang="less" scoped>
@blue: #009aff;
  .container {
    position: relative;
    width: 366px;
    height: 436px;
    margin: 138px auto;
    padding: 32px 34px 20px;
    border: 1px solid #d7d7d8;
    border-radius: 2px;
    font-size: 12px;
    box-sizing: border-box;
    background: #fff;
    box-shadow: 0 6px 16px rgba(0, 0, 0, .1);
    .logo{
      width: 90px;
      height: 90px;
      background: url('../../static/img/minibai.svg') no-repeat;
      background-size: cover;
      margin: 0 auto;
    }
    .title {
      font-size: 16px;
      line-height: 42px;
      color: #323232;
      text-align: center;
      margin-bottom: 30px;
    }
    .subtitle{
      margin-bottom: 14px;
    }
    .close {
      position: absolute;
      width: 20px;
      height: 20px;
      top: 10px;
      right: 10px;
    }
  }
  .vCode-input{
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
  }
  .button-blue{
    width: 100%;
    height: 36px;
    margin: 6px 0 0;
  }
</style>
<script>
import { mapState, mapMutations, mapActions } from 'vuex';
  export default {
    data(){
      return {
        phoneNum: '',
        phoneCode: '',
        vCodeText: '获取验证码',
        warnText: '验证码输入不正确',
        sendingFlag: false,
        warnFlag: false,
        phoneNumErrorInfo: '',
        phoneNumErrorFlag: false,
        areaCodeFlag: false,
        areacode: '86'
      }
    },
    /* computed: {
      ...mapState('main',{
        url__:'url__',
        //curHash: state => state.curHash,
      }),
    }, */
    methods: {
      ...mapMutations('main',{
        hide_regDialog: 'hide_regDialog'
      }),
      ...mapActions('main',['handleThirdPartyLogin']),
      hide_regDialog_(){
        location.hash = '';
        this.hide_regDialog();
      },
      toPhoneNumInputError({warnText_='',warnFlag_=false}){
        this.phoneNumErrorInfo = warnText_;
        this.phoneNumErrorFlag = warnFlag_;
      },
      getAreaCode(code){
        this.areacode = code;
      },
      hideAreaCode(){
        this.areaCodeFlag = false;
      },
      showAreaCode(){
        this.areaCodeFlag = true;
      },


      
      
      checkPhoneNum(num){
        if(num === ''){
          this.warnFlag = true;
          this.warnText = '手机号码有误';
          return false;
        }else if(!this.isPhoneNum(num)){
          this.warnFlag = true;
          this.warnText = '手机号码错误';
          return false;
        }
        return true;
      },
      checkPhoneCode(num){
        if(num === ''){
          this.warnFlag = true;
          this.warnText = '验证码不能为空';
          return false;
        }else if(!this.isPhoneCode(num)){
          this.warnFlag = true;
          this.warnText = '验证码错误';
          return false;
        }
        return true;
      },
      handleSubmit(){
        if(!this.checkPhoneNum(this.phoneNum) || !this.checkPhoneCode(this.phoneCode)) return;
        // 3.登录
        let mobile = this.phoneNum, captcha = this.phoneCode,areacode = this.areacode;
        this.handleThirdPartyLogin({mobile,captcha,areacode}).then((res)=>{
          // console.log('handleThirdPartyLogin',res)
        }).catch((error)=>{
          // console.log('handleThirdPartyLogin',error)
        });
      },
    }
  }
</script>