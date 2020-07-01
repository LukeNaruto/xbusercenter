<template>
<transition name="fade">
  <div class="dialog">
    <div class="container" :class="loginType === 3 ? 'rePW': ''">
      <button @click="handleHideDialog" class="close" title="关闭"><i class="icon iconfont iconClose-box-px"></i></button>
      <h1 class="logo"></h1>
      <h3 class="title">{{loginType === 1 ? '手机号快捷登录' : (loginType === 2 ? '账号登录': '找回密码')}}</h3>
      <AreaCode v-if="areaCodeFlag" @user_area_code="getAreaCode" @user_area_code_hide="hideAreaCode" />
      <InputEl ids="username_" class="input" v-model="phoneNum" placeholder="手机号码" :areaCode="{type: true,areacode}" :errorInfo="phoneNumErrorInfo" :errorFlag="phoneNumErrorFlag" @user_show_area_code="showAreaCode" />
      <div class="main" v-if="loginType === 1">
        <InputVerify class="input vCode-input" @keyup.enter.native="handleCodeSubmit" @user_phoneNum_error="toPhoneNumInputError" v-model="phoneCode" :opt="{phoneNum,areacode}" />
        <!-- <Spin ref="spin"></Spin>  
        <SpinBox></SpinBox> -->
        <button class="button-blue" @click="handleCodeSubmit">登录</button>
      </div>

      <div class="main" v-if="loginType === 2">
        <InputEl class="input" @keyup.enter.native="handleUserNameSubmit" v-model="password" :errorInfo="passwordErrorInfo" :errorFlag="passwordErrorFlag" type="password" placeholder="密码"  />
        <button class="button-blue" @click="handleUserNameSubmit">登录</button>
      </div>
      <div v-if="loginType !== 3">
        <p class="agreement">登录即表示同意《<a href="//www.minibai.com/agreement.html" target="_blank" title="服务协议"> 服务协议 </a>》</p>
        <div class="other-login">
          其他方式登录
          <span class="icon iconfont iconqq" title="QQ登录" @click="thirdPartyLogin('qqlogin')"></span>
          <span class="icon iconfont iconweixin" title="微信登录" @click="thirdPartyLogin('wechatlogin')"></span>
          <span class="icon iconfont" :class="loginType === 1 ? 'icongeren' : 'iconphone'" :title="loginType === 2 ? '手机号快捷登录' : '账号登录'" @click="switch_login_type_(loginType === 1 ? 2 : 1)"></span>
          <strong v-if="loginType !== 1" title="忘记密码" @click="switch_login_type_(3)">忘记密码？</strong>
        </div>
      </div>
      <div v-if="loginType === 3">
        <InputVerify class="input vCode-input" v-model="rePhoneCode" @user_phoneNum_error="toPhoneNumInputError" :opt="{phoneNum,areacode,type:3}" />
        <InputEl class="input" @user_blur="handleRePW1" v-model="rePassword1" type="password" placeholder="设置密码，6-16位字符"  />
        <InputEl class="input" @keyup.enter.native="handleReSubmit" @user_blur="handleRePW2" v-model="rePassword2" type="password" placeholder="确认密码" :errorInfo="errorInfo" :errorFlag="errorFlag" />
        <button class="button-blue" @click="handleReSubmit">完成</button>
      </div>
    </div>
    <ConfirmBox v-if="confirmFlag" :isIconType="iconType" @user_on_cancel="handleComfirm" @user_on_ok="handleComfirm">{{confirmText}}</ConfirmBox>
    <!-- <AlertBox v-if="alertFlag" isIconType="error" @user_alert_ok="handleAlert">{{alertText}}</AlertBox> -->
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
      margin-bottom: 20px;
    }
    .close {
      position: absolute;
      width: 20px;
      height: 20px;
      top: 10px;
      right: 10px;
    }
  }
  .rePW{
    .title{
      margin-bottom: 10px;
    }
    .input{
      margin-bottom: 8px;
    }
  }
  // .main{
    //margin-bottom: 34px;
    .vCode-input{
      //float: left;
      width: 266px;
      margin-right: 6px;
    }
    .vCode{
      width: 100px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      font-size: 12px;
      color: @blue;
      border: 1px solid @blue;
      border-radius: 2px;
      background: #fff;
    }
    .warn-box{
      position: relative;
      height: 24px;
      padding-left: 20px;
      line-height: 24px;
      color: #ff7453;
      font-size: 12px;
      .icon{
        position: absolute;
        left: 0;
        top: 0;
      }
    }
    .input{
      width: 100%;
      height: 40px;
      margin-bottom: 12px;
      &.vCode-input > input{
        width: 64%;
        //padding-right: 120px!important;
      }
    }
  // }
  .button-blue{
    //position: absolute;
    width: 100%;
    height: 36px;
    margin: 6px 0 0;
  }
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
    strong{
      float: right;
      font-weight: normal;
      cursor: pointer;
    }
  }
  .agreement{
    height: 40px;
    line-height: 40px;
    margin-bottom: 10px;
    font-size: 12px;
    text-align: center;
    color: #888;
    a{
      color: #444;
      &:hover{
        color: #222;
      }
    }
  }
  .vCode{
    width: 100px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 12px;
    color: @blue;
    border: 1px solid @blue;
    border-radius: 2px;
    background: #fff;
  }
</style>
<script>
import { Spin } from 'iview'
import { mapState, mapMutations, mapActions } from 'vuex';
  export default {
    data(){
      return {
        password: '',
        phoneNum: '',
        phoneCode: '',
        rePhoneCode: '',
        rePassword1: '',
        rePassword2: '',
        errorInfo: '密码',
        errorFlag: false,
        phoneNumErrorInfo: '',
        phoneNumErrorFlag: false,
        passwordErrorFlag: false,
        passwordErrorInfo: '',
        //sendingFlag: false,
        
        confirmFlag: false,
        confirmText: '',
        iconType: 'error',
        loginFlag: [],

        areaCodeFlag: false,
        areacode:'86',
      }
    },
    created(){
      /* this.$Message.info({
        content: '<span class="icon icon-success iconfont iconSuccess-px1"></span>密码找回成功！',
        duration: 20000,
      }); */
      // this.message_success('密码找回成功');
      // this.message_default('密码找回成功');
      // this.message_error('密码找回成功');
    },
    computed:{
      ...mapState('main',['loginType']),
    },
    methods: {
      ...mapMutations('main',{
        handleHideDialog: 'hide_login_dialog',
        show_login_dialog: 'show_login_dialog',
        switch_login_type: 'switch_login_type',
      }),
      ...mapActions('main',['handleLoginByCaptcha','handleResettingPassword','handleLoginByPassword','handleThirdPartyLogin']),
      // handleHideDialog() {
      //   this.$emit('user_hide_login');
      // },
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
          this.phoneNumErrorFlag = true;
          this.phoneNumErrorInfo = '手机号码有误';
          return false;
        }else if(!this.isPhoneNum(num)){
          this.phoneNumErrorFlag = true;
          this.phoneNumErrorInfo = '手机号码错误';
          return false;
        }
        return true;
      },
      checkPassword(psw){
        if(psw === ''){
          this.passwordErrorFlag = true;
          this.passwordErrorInfo = '密码不能为空';
          return false;
        }else if(!this.isPassWord(psw)){
          this.passwordErrorFlag = true;
          this.passwordErrorInfo = '请输入6-16位密码';
          return false;
        }
        return true;
      },
      checkPhoneCode(num){
        if(num === ''){
          // this.warnFlag = true;
          // this.warnText = '验证码不能为空';
          return false;
        }else if(!this.isPhoneCode(num)){
          // this.warnFlag = true;
          // this.warnText = '验证码有误~~~~~~~~~';
          return false;
        }
        return true;
      },
      // 3.验证码登录
      handleCodeSubmit(){
        if(!this.checkPhoneNum(this.phoneNum) || !this.checkPhoneCode(this.phoneCode)) return;
        
        let captcha = this.phoneCode,mobile = this.phoneNum,areacode = this.areacode;
        this.handleLoginByCaptcha({captcha,mobile,areacode}).then((res)=>{
          // console.log('handleLoginByCaptcha__',res)
          // this.message_success('登录成功');
        }).catch((error)=>{
          // console.log('handleLoginByCaptcha__error',error)
          //this.message_error(error.message);
          // this.confirmFlag = true;
          // this.iconType = 'error';
          // this.confirmText = error.message;
        })
      },
      // 密码登录
      handleUserNameSubmit(){
        if(!this.checkPhoneNum(this.phoneNum) || !this.checkPassword(this.password)) return;
        let mobile = this.phoneNum, password = this.password,areacode = this.areacode;
        this.handleLoginByPassword({mobile,password,areacode}).then((res)=>{
          // console.log('pwdlogin',res)
          // this.message_success('登录成功');
        }).catch((error)=>{
          // console.log('pwdlogin',error)
          //this.message_error(error.message);
          // this.confirmFlag = true;
          // this.iconType = 'error';
          // this.confirmText = error.message;
        })

        // console.log(this.phoneNum,this.password)
      },
      // 找回密码
      handleReSubmit(){
        // console.log(this.rePhoneCode,this.phoneNum,this.rePassword1,this.rePassword2,this.handleRePW2() && this.isPassWord(this.rePassword1) && this.isPhoneNum(this.phoneNum) && this.isPhoneCode(this.rePhoneCode))
        if(this.handleRePW2() && this.isPassWord(this.rePassword1) && this.isPhoneNum(this.phoneNum) && this.isPhoneCode(this.rePhoneCode)){
          // 找回密码
          let mobile = this.phoneNum, captcha = this.rePhoneCode, password = this.rePassword1,areacode = this.areacode;
          this.handleResettingPassword({mobile,captcha,password,areacode}).then((res)=>{
            // console.log(res);
            this.show_login_dialog();
            this.$nextTick(()=>{
              this.switch_login_type(2);
            })
            //this.message_success('密码找回成功！');
          }).catch((error)=>{
            // console.log(error);
          });
        }else{
          this.message_error('以上信息不能为空！');
          // this.confirmFlag = true;
          // this.confirmText = '以上信息不能为空！';
          // this.iconType = 'error';
        }
      },
      handleRePW1(){
        /* if(this.errorInfo === ''){
          
        } */
      },
      handleRePW2(){
        if(this.rePassword1 !==this.rePassword2){
          this.errorFlag = true;
          this.errorInfo = '前后密码不一致！';
          return false;
        }else{
          this.errorFlag = false;
          this.errorInfo = '';
          return true;
        }
        
      },
      handleComfirm(){
        this.confirmFlag = false;
      },
      thirdPartyLogin(type){
        window.open('/api/login.json?act='+type,'_self');
      },
      getAreaCode(code){
        this.areacode = code;
      },
      hideAreaCode(){
        this.areaCodeFlag = false;
      },
      showAreaCode(){
        this.areaCodeFlag = true;
      }
    }
  }
</script>