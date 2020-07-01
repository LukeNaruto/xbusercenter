<template>
  <div class="input-phone-box">
    <button ref="areaCodeBtn">+{{areaCode}}
      <i class="icon iconfont iconArrowtop-px"></i>
      <ul class="area-box popup">
        <li @click="choiceArea(item)" v-for="item in areaCodeList" :key="item.code">
          <span> {{item.desc}} </span> <em> +{{item.code}}</em>
        </li>
      </ul>
    </button>
    <!-- <input name="username" style="display: none;" /> -->
    <input :tabindex="tabindex" :id="id" name="username" @input="getPhoneNum" v-model="phoneNum" type="text" autocomplete="off" placeholder="输入您的手机号码" /> 
    <!-- <input type="password" name="password" style="display: none;" /> -->
    <p class="input-line"></p>
    <span v-if="warnFlag_" class="icon iconfont iconnote_"><p class="error-info">{{warnText_}}</p></span>
    
  </div>
</template>
<script>
export default {
  props:{
    tabindex:[ Number,String],
    phoneErrInfo_: Object,
    id:{
      type: String,
      default: 'phone_',
    },
  },
  watch:{
    'phoneErrInfo_.warnFlag'(val,val_){
      this.warnFlag_ = val;
      if(val){
        this.getPhoneNum();
      }
    },
    'phoneErrInfo_.warnText'(val,val_){
      this.warnText_ = val;
    },
  },
  data(){
    return {
      warnFlag_: false,
      warnText_: '',
      phoneNum: '',
      areaCode: '86',
      areaCodeList:[{
        desc: '中国大陆',
        code: '86'
      },{
        desc: '中国香港',
        code: '852'
      },{
        desc: '中国澳门',
        code: '853'
      },{
        desc: '中国台湾',
        code: '886'
      },]
    }
  },
  methods:{
    getPhoneNum(){
      // console.log(this.phoneNum)
      this.checkValue(this.phoneNum);
      this.$emit('event_get_number', {mobile: this.phoneNum,areacode: this.areaCode});
    },
    choiceArea(item){
      this.areaCode = item.code;
      this.$refs.areaCodeBtn.blur();
      this.$emit('event_get_number', {mobile: this.phoneNum,areacode: this.areaCode});
    },
    checkValue(num) {
      //this.$emit('user_blur');
      //if(this.errorFlag !== 'undefine_') return;
      
      if (num === '') {
        this.warnText_ = '手机号码不能为空';
        this.warnFlag_ = true;
        return false;
      } else if (!this.isPhoneNum(num)) {
        this.warnText_ = '手机号码有误';
        this.warnFlag_ = true;
        return false;
      }
      this.warnFlag_ = false;
      return true;
    },
  }
}
</script>
<style lang="less" scoped>
  .input-phone-box{
    position: relative;
    height: 56px;
    box-sizing: border-box;
    & > button{
      position: absolute;
      width: 94px;
      height: 100%;
      line-height: 56px;
      padding-left: 32px;
      text-align: left;
      font-size: 18px;
      color: #222;
      background: transparent;
      &:before{
        content: '';
        position: absolute;
        width: 24px;
        height: 18px;
        left: 4px;
        top: 19px;
        background: url('../../static/img/logo.png') no-repeat right -40px;
      }
      & > i{
        float: right;
        width: 16px;
        height: 18px;
        margin: 20px 2px;
        line-height: 18px;
        font-size: 12px;
        text-align: center;
        transform: rotateZ(180deg);
        transition: all .4s ease;
      }
      &:focus > i{
        transform: rotateZ(0deg);
      }
      &:focus .area-box{
        display: block;
      }
    }
    input{
      width: 100%;
      height: 100%;
      padding: 0 32px 0 94px;
      border: none;
      font-size: 16px;
      caret-color: #009aff;
      background: transparent;
      box-sizing: border-box;
      &:focus + .input-line:before{
        width: 100%;
        transition: width .7s;
      }
    }
  }
  
  .area-box{
    display: none;
    position: absolute;
    width: 140px;
    left: 2px;
    top: 50px;
    padding: 6px 0;
    text-align: left;
    background: #fff;
    &>li{
      height: 38px;
      padding-left: 20px;
      line-height: 38px;
      font-size: 14px;
      color: #222;
      span{
      }
      em{
        font-style: normal;
        color: #666;
      }
      &:hover{
        background-color: #f5f5f5;
      }
      cursor: pointer;
    }
    cursor: default;
    z-index: 9;
  }
</style>