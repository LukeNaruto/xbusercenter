<template>
  <div class="input-box">
    <!-- <input type="password" name="password" style="display: none;" /> -->
    <input :id="id" v-model="value" @input="getValue" :type="type" :tabindex="tabindex" :placeholder="placeholder" autocomplete="off">
    <p class="input-line"></p>
    <i class="icon iconfont  icongeren"></i>
    <span v-if="warnFlag_" class="icon iconfont iconnote_">
      <p class="error-info">{{warnText_}}</p>
    </span>
  </div>
</template>

<script>
export default {
  props:{
    tabindex:[ Number,String],
    placeholder: String,
    errInfo_: {
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
    curValue_: String,
    id:{
      type: String,
      default: 'value_'
    },
    type: {
      type: String,
      default: 'text'
    }
  },
  data(){
    return {
      sendingFlag: false,
      warnFlag_: false,
      warnText_: '',
      value: '',
    }
  },
  created(){
    this.warnFlag_ = this.errInfo_.warnFlag;
    this.warnText_ = this.errInfo_.warnText;
  },
  watch:{
    'errInfo_.warnFlag'(val,val_){
      this.warnFlag_ = val;
    },
    'errInfo_.warnText'(val,val_){
      this.warnText_ = val;
    },
    
  },
  methods:{
    getValue(){
      this.checkAccount(this.value)
      this.$emit('event_value', this.value);
    },
    checkAccount(psw){
      if(psw === ''){
        this.warnFlag_ = true;
        this.warnText_ = '账号不能为空';
        return false;
      }else if(!this.isAccount(psw)){
        this.warnFlag_ = true;
        this.warnText_ = '请输入6-16位数字、字母组成的账号';
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
      & ~ .icongeren{
        color: #009aff;
      }
    }
  }
  .icongeren{
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
.icongeren{

}

</style>
