<template>
  <div class="input-box">
    <input ref="input" @keyup="checkPhoneCode" type="text" :value="value" @input="$emit('input', $event.target.value)" placeholder="短信验证码" >
    <span v-if="warnFlag_" class="icon iconfont iconnote_"></span>
    <p v-if="warnFlag_" class="error-info">{{warnText_}}</p>
    <button class="vCode" @click="handleGetCode" :disabled="sendingFlag" :style="{cursor: sendingFlag ? 'not-allowed' : null}">{{vCodeText}}</button>
  </div>
</template>
<style lang="less" scoped>
@blue: #009aff; 
.input-box{
  position: relative;
  input{
    width: 100%;
    height: 100%;
    padding: 0 112px 0 16px;
    margin-bottom: 8px;
    font-size: 15px;
    background: #f5f5f5;
    border: 1px solid #f5f5f5;
    border-radius: 2px;
    color: #222;
    transition: all .5s ease-in-out;
    &:focus{
      border: 1px solid @blue;
      border-radius: 2px;
      box-shadow: 0 0 10px rgba(0,154,255,.2);
      background: #fff;
    }
  }
  .icon{
    position: absolute;
    right: 94px;
    top: calc(50% - 12px);
    color: #fc184e;
    cursor: pointer;
    &:hover + .error-info{
      display: inline-block;
      opacity: 1;
    }
  }
  .error-info{
    opacity: 0;
    display: none;
    position: relative;
    left: calc(76% - 32px);
    top: -6px;
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
  .vCode{
    position: absolute;
    right: 12px;
    top: calc(50% - 8px);
    font-size: 12px;
    color: @blue;
    background: transparent;
  }
}

</style>
<script>
import { mapState, mapMutations, mapActions } from 'vuex';
export default {
  props:{
    value:[String, Number,Object],
    opt:[Object],
    // warnFlag:[Boolean],
    // warnText: [String],
  },
  data(){
    return {
      vCodeText: '获取验证码',
      sendingFlag: false,
      warnFlag_: false,
      warnText_: ''
    }
  },
  methods:{
    ...mapActions('main',{
      getCode: 'handleGetCaptcha',
      handleThirdcheck: 'handleThirdcheck',
    }),
    handleGetCode(){
      // console.log(this.sendingFlag)
        if(this.sendingFlag) return;
        if(!this.checkPhoneNum(this.opt.phoneNum)) {
          this.$emit('user_phoneNum_error',{
            warnFlag_: true,
            warnText_: '手机号码不能为空'
          })
          // this.warnFlag_ = true;
          // this.warnText_ = '手机号码不能为空';
          return;
        }
        let type = this.opt.type ? this.opt.type : 1;
        let mobile = this.opt.phoneNum;
        let areacode = this.opt.areacode;
        // console.log('type',type)
        if(type === 6){
          this.handleThirdcheck({mobile,areacode}).then((res)=>{
          //this.sendingFlag = false;
            // console.log('res__getCode',res)
            this.$refs.input.focus();
            // console.log(1,this.opt.phoneNum)
            let lockTime = 180,t = null;
            this.sendingFlag = true;
            this.vCodeText = '重新发送 ' + lockTime;
            t = setInterval(()=>{
              lockTime--;
              this.vCodeText = '重新发送 ' + lockTime;
              if(lockTime === 0){
                this.clearIntervalFn(t);
              }
            },1000)
          }).catch((error)=>{
            // console.log('error__getCode',error)
          })
          return false;
        }
        this.getCode({
          type, mobile,areacode
        }).then((res)=>{
          //this.sendingFlag = false;
          // console.log('res__getCode',res)
          this.$refs.input.focus();
          // console.log(1,this.opt.phoneNum)
          let lockTime = 180,t = null;
          this.sendingFlag = true;
          this.vCodeText = '重新发送 ' + lockTime;
          t = setInterval(()=>{
            lockTime--;
            this.vCodeText = '重新发送 ' + lockTime;
            if(lockTime === 0){
              this.clearIntervalFn(t);
            }
          },1000)
        }).catch((error)=>{
          // console.log('error__getCode',error)
        })
      },
      clearIntervalFn(t){
        this.vCodeText = '获取验证码';
        this.sendingFlag = false;
        clearInterval(t);
      },
      /* handleHideDialog() {
        this.$emit('user_hide_register');
      }, */
      checkPhoneNum(num){
        if(num === ''){
          // this.warnFlag_ = true;
          // this.warnText_ = '手机号码有误';
          return false;
        }else if(!this.isPhoneNum(num)){
          // this.warnFlag_ = true;
          // this.warnText_ = '手机号码错误';
          return false;
        }
        return true;
      },
      checkPhoneCode(){
        if(this.value === ''){
          this.warnFlag_ = true;
          this.warnText_ = '验证码不能为空';
          return false;
        }else if(!this.isPhoneCode(this.value)){
          this.warnFlag_ = true;
          this.warnText_ = '验证码有误';
          return false;
        }
        this.warnFlag_ = false;
        return true;
      },
  }
}
</script>