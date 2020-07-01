<template>
  <div class="input-box">
    <ul>
      <li v-for="(value, key) in areaCodeData" :key="key" :data-code="key">{{value}}</li>
    </ul>
    <input :type="type" :value="value" @keyup="checkValue(value)" @input="$emit('input', $event.target.value)" :placeholder="placeholder">
    <span v-if="errorFlag_" class="icon iconfont iconnote_"></span>
    <p v-if="errorFlag_" class="error-info">{{errorInfo_}}</p>
  </div>
</template>
<style lang="less" scoped>
  @blue: #009aff;

  .input-box {
    position: relative;

    input {
      width: 90%;
      height: 100%;
      margin-left: 10%;
      padding: 0 38px 0 16px;
      margin-bottom: 8px;
      font-size: 15px;
      background: #f5f5f5;
      border: 1px solid #f5f5f5;
      border-radius: 2px;
      color: #222;
      transition: all .5s ease-in-out;

      &:focus {
        border: 1px solid @blue;
        border-radius: 2px;
        box-shadow: 0 0 10px rgba(0, 154, 255, .2);
        background: #fff;
      }
    }

    .icon {
      position: absolute;
      right: 12px;
      top: calc(50% - 12px);
      color: #fc184e;
      cursor: pointer;

      &:hover+.error-info {
        display: inline-block;
        ;
        opacity: 1;
      }
    }

    .error-info {
      opacity: 0;
      display: none;
      position: relative;
      left: calc(100% - 32px);
      top: -6px;
      width: auto;
      height: 36px;
      line-height: 36px;
      padding: 0 16px;
      border: 1px solid #e5e5e5;
      background: #fff;
      border-radius: 2px;
      text-align: center;
      font-size: 12px;
      box-shadow: 0 6px 16px rgba(0, 0, 0, .1);
      transition: opacity 1s ease-in-out;
      z-index: 99;
    }
  }
</style>
<script>
  export default {
    data() {
      return {
        errorInfo_: '',
        errorFlag_: false,
        areaCodeData:{
          '86': 'CN 86 中国大陆',
          '852': 'HK 852 中国香港',
          '853': 'MO 853 中国澳门',
          '886': 'TW 886 中国台湾',
        }
      }
    },
    props: {
      type: {
        type: String,
        default: 'text'
      },
      placeholder: {
        type: String,
        default: '账号/手机号码'
      },
      errorInfo: {
        type: String,
        default: 'undefine_'
      },
      errorFlag: {
        type: [String,Boolean],
        default: 'undefine_'
      },
      value: [String, Number, Object],
      disabled: [Boolean],
    },
    created(){
       // console.log(this.errorInfo,this.errorFlag)
      if(this.errorInfo !== 'undefine_'){
        this.errorInfo_ = this.errorInfo;
      }
      if(this.errorFlag !== 'undefine_'){
        this.errorFlag_ = this.errorFlag;
      }
    },
    watch:{
      errorInfo(val,val_){
        //console.log(1,val,val_)
        this.errorInfo_ = val;
      },
      errorFlag(val,val_){
        //console.log(2,val,val_)
        this.errorFlag_ = val;
      }
    },
    methods: {
      checkValue(num) {
        //this.$emit('user_blur');
        //if(this.errorFlag !== 'undefine_') return;
        if ((num.length < 6 || num.length > 16) && this.type === 'password') { //6-16
          this.errorInfo_ = '请输入6-16位密码';
          this.errorFlag_ = true;
          return false;
        }
        if (num === '' && this.type !== 'password') {
          this.errorInfo_ = '手机号码有误';
          this.errorFlag_ = true;
          return false;
        } else if (!this.isPhoneNum(num) && this.type!== 'password') {
          this.errorInfo_ = '手机号码错误';
          this.errorFlag_ = true;
          return false;
        }
        this.errorFlag_ = false;
        //return true;
      },
    }
  }
</script>