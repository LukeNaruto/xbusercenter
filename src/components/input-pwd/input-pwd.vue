<template>
  <div class="input-box">
    <!-- <input type="password" name="password" style="display: none;" /> -->
    <input :tabindex.number="tabindex" name="password" v-model="pwd" @keyup.enter="$emit('event_login')" @input="getPwd" type="password" autocomplete="off" :placeholder="placeholder" />
    <p class="input-line"></p>
    <i class="icon iconfont iconPassword-px"></i>
    <span v-if="warnFlag_" class="icon iconfont iconnote_">
      <p class="error-info">{{warnText_}}</p>
    </span>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props:{
    tabindex:[ Number,String],
    placeholder: {
      type: String,
      default: '输入密码',
    },
    pwdErrInfo_: {
      type: Object,
      default(){
        return {
          warnFlag: false,
          warnText: ''
        }
      }
    },
    resetFlag: {
      type: Boolean,
      default: false,
    },
    curPwd_: String,
  },
  data(){
    return {
      sendingFlag: false,
      warnFlag_: false,
      warnText_: '',
      pwd: '',
    }
  },
  created(){
    this.warnFlag_ = this.pwdErrInfo_.warnFlag;
    this.warnText_ = this.pwdErrInfo_.warnText;
  },
  watch:{
    'pwdErrInfo_.warnFlag'(val,val_){
      this.warnFlag_ = val;
    },
    'pwdErrInfo_.warnText'(val,val_){
      this.warnText_ = val;
    },
    curPwd_(val,val_){
      this.getPwd();
    }
  },
  methods:{
    getPwd(){
      // console.log(1,this.resetFlag,this.pwd)
      if(this.resetFlag) {
        this.checkSamePwd(this.pwd)
        this.$emit('event_resetPwd', this.pwd);
      }else{
        this.checkPassword(this.pwd)
        this.$emit('event_pwd', this.pwd);
      }
      
    },
    checkPassword(psw){
      // console.log(2,this.resetFlag,this.pwd,!this.isPassWord(psw))
      if(psw === ''){
        this.warnFlag_ = true;
        this.warnText_ = '密码不能为空';
        return false;
      }else if(!this.isPassWord(psw)){
        this.warnFlag_ = true;
        this.warnText_ = '请输入6-20位数字、字母组成的密码';
        return false;
      }
      this.warnFlag_ = false;
      return true;
    },
    checkSamePwd(psw){
      // console.log(psw,this.curPwd_)
      if(psw !== this.curPwd_){
        this.warnFlag_ = true;
        this.warnText_ = '前后密码不一致！';
        return false;
      }
      this.warnFlag_ = false;
      return true;
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
    padding: 0 32px;
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
  }
  .iconPassword-px{
    position: absolute;
    left: 0;
    top: calc(50% - 12px);
    transition: color .4s ease;
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
