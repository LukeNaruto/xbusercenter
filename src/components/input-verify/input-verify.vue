<template>
  <div class="input-box">
    <input :tabindex.number="tabindex" :id="id" :name="id" @keyup.enter="$emit('event_login')" ref="input" @input="checkPhoneCode" :placeholder="placeholder_" :class="{'noVerify_': noVerify_}" type="text" />
    
    <input type="text" style="display:none;" />

    <p class="input-line"></p>
    <button v-if="!noVerify_" class="vCode" @click="handleGetCode" :disabled="sendingFlag" :style="{cursor: sendingFlag ? 'not-allowed' : null}">{{vCodeText}}</button>
    
    <i class="icon iconfont iconPassword-px"></i>
    <span v-if="warnFlag_" class="icon iconfont iconnote_">
      <p class="error-info">{{warnText_}}</p>
    </span>






    
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
export default {
  props:{
    tabindex:[ Number,String],
    id:{
      type: String,
      default: 'captcha_'
    },
    noVerify_: {
      type: Boolean,
      default: false,
    },
    placeholder_: {
      type: String,
      default: '短信验证码',
    },
    phoneInfo_: {
      type: Object,
      default(){
        return {
          mobile: '',
          areacode: '',
          type: Number,
        }
      }
    },
    // value:[String, Number,Object],
    verifyErrInfo_:{
      type: Object,
      default(){
        return {
          warnFlag: false,
          warnText: ''
        }
      }
    },
  },
  data(){
    return {
      vCodeText: '获取验证码',
      sendingFlag: false,
      warnFlag_: false,
      warnText_: '',
      value: '',
      t: null,
    }
  },
  watch:{
    'verifyErrInfo_.warnFlag'(val,val_){
      this.warnFlag_ = val;
    },
    'verifyErrInfo_.warnText'(val,val_){
      this.warnText_ = val;
    },
  },
  mounted(){
    
  },
  methods:{
    ...mapActions('main',{
      handleGetCaptcha: 'handleGetCaptcha',
    }),
    handleGetCode(){
        if(this.sendingFlag) return;
        if(!this.checkPhoneNum(this.phoneInfo_.mobile)) {
          // console.log(1,this.phoneInfo_.mobile)
          return;
        }
        let opt = { ...this.phoneInfo_};
        this.handleGetCaptcha(opt).then((res) => {
          this.$refs.input.focus();
          // console.log(1,this.opt.phoneNum)
          let lockTime = 180,t = null;
          this.sendingFlag = true;
          this.vCodeText = '重新发送 ' + lockTime;
          this.t = setInterval(()=>{
            lockTime--;
            this.vCodeText = '重新发送 ' + lockTime;
            if(lockTime === 0){
              this.clearIntervalFn(this.t);
            }
          },1000)
        }).catch((err)=>{
          console.log(1,err);
          this.warnFlag_ = true;
          this.warnText_ = err.message;
          this.clearIntervalFn(this.t);
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
        if (num === '' || !this.isPhoneNum(num)) {
          this.$emit('errInfo_v',{
            type: 1,
            warnText: '手机号码不能为空',
            warnFlag: true,
          })
          return false;
        } else if (!this.isPhoneNum(num)) {
          this.$emit('errInfo_v',{
            type: 1,
            warnText: '手机号码有误',
            warnFlag: true,
          })
          return false;
        }
        this.$emit('errInfo_v',{
          type: 1,
          warnText: '',
          warnFlag: false,
        })
        return true;
      },
      checkPhoneCode(){
        var val = this.$refs.input.value;
        if(val === ''){
          this.warnFlag_ = true;
          this.warnText_ = '验证码不能为空';
          // return false;
        }else if(!this.isPhoneCode(val)){
          this.warnFlag_ = true;
          this.warnText_ = '验证码有误';
          // return false;
        }else{
          this.warnFlag_ = false;
          this.warnText_ = '';
        }
        this.$emit('event_get_captcha',val);
        // return true;
      },
  }
}
</script>
<style lang="less" scoped>
@blue: #009aff; 
.input-box{
  position: relative;
  height: 56px;
  box-sizing: border-box;
  input{
    width: 100%;
    height: 100%;
    padding: 0 124px 0 32px;
    border: none;
    font-size: 16px;
    caret-color: #009aff;
    background: transparent;
    box-sizing: border-box;
    &:focus {
      & ~ .input-line:before{
        width: 100%;
        transition: width .7s;
      }
      & ~ .iconPassword-px{
        color: #009aff;
      }
    }
    &.noVerify_{
      padding-right: 32px;
      & ~ .iconnote_{
        right: 12px;
      }
    }
  }
  
  .iconPassword-px{
    position: absolute;
    left: 0;
    top: calc(50% - 12px);
    transition: color .4s ease;
  }
  .iconnote_{
    right: 98px;
  }
  .vCode{
    position: absolute;
    right: 12px;
    top: calc(50% - 8px);
    font-size: 14px;
    color: @blue;
    background: transparent;
  }
}
.iconPassword-px{

}

</style>
