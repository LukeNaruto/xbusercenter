<template>
  <div class="dialog">
    <div class="container">
      <button @click="handleHideDialog" class="close" title="关闭"><i class="icon iconfont iconClose-box-px"></i></button>
      <h3 class="title">登录</h3>
      <h4 class="subtitle">您已登录个人中心，请注册小白个人账号：</h4>
      <div class="main">
        <input placeholder="请输入手机号" v-model="username" type="text" :disabled="sendingFlag"  maxlength="11"/>
        <input placeholder="请输入密码" v-model="password" type="password" :disabled="sendingFlag"  maxlength="16"/>
        <!-- <div class="vCode-box clr">
          <input class="vCode-input" v-model="phoneCode" type="text" placeholder="请输入验证码" maxlength="6"/>
        <button class="vCode" @click="getPhoneCode" :disabled="sendingFlag">{{vCodeText}}</button>
        </div> -->
        <p class="warn-box" v-show="warnFlag"><i class="icon iconfont iconnote_"></i>{{warnText}}</p>
      </div>
      <button class="button-blue" @click="handleSubmit">登录</button>
    </div>
  </div>
</template>
<style lang="less" scoped>
@blue: #009aff;
  .container {
    position: relative;
    width: 440px;
    height: 310px;
    margin: 238px auto;
    padding: 20px 33px;
    border: 1px solid #d7d7d8;
    border-radius: 2px;
    font-size: 12px;
    box-sizing: border-box;
    background: #fff;
    box-shadow: 0 6px 16px rgba(0, 0, 0, .1);

    .title {
      font-size: 14px;
      line-height: 12px;
      color: #323232;
      text-align: center;
      margin-bottom: 12px;
    }
    .subtitle{
      font-size: 12px;
      color: #222;
      line-height: 50px;
    }
    .close {
      position: absolute;
      width: 20px;
      height: 20px;
      top: 10px;
      right: 10px;
    }
  }
  .main{
    margin-bottom: 34px;
    .vCode-input{
      float: left;
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
    input {
      width: 100%;
      height: 40px;
      padding: 0 16px;
      margin-bottom: 8px;
      background: #f5f5f5;
      border: 1px solid #f5f5f5;
      border-radius: 2px;
      transition: all .5s ease-in-out;
      &:focus{
        border: 1px solid @blue;
        background: #fff;
      }
    }
  }
  .button-blue{
    position: absolute;
    width: 160px;
    height: 36px;
    left: 140px;
    bottom: 26px;
  }
</style>
<script>
  export default {
    data(){
      return {
        username: '',
        password: '',
        vCodeText: '获取验证码',
        warnText: '验证码输入不正确',
        sendingFlag: false,
        warnFlag: false
      }
    },
    methods: {
      handleHideDialog() {
        this.$emit('user_hide_login');
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
          this.warnText = '验证码有误~~~~~~~~~';
          return false;
        }
        return true;
      },
      handleSubmit(){
        if(!this.checkPhoneNum(this.username)) return;
        setTimeout(()=>{
          alert('提交验证码 => 登录成功 or 报错提醒')
        },2000)
      },
    }
  }
</script>