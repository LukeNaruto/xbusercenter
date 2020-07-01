<template>
  <div class="info-grade-bar">
    <div class="grade-logo">LV{{curData.grade}}</div>
    <div class="info-grade-progress-1"><div class="info-grade-progress-2" :style="{width: progress2 + 'px'}"></div></div>
    <strong v-if="curData.grade < 10">&ensp;LV{{curData.grade + 1}}</strong>
    <span v-if="curData.grade < 10">&ensp;(升级还需{{needMore}}天)</span>
    <div class="lv-rule">
      <i class="icon iconfont icondoubt_"></i> <span> 规则</span>
      <div class="rule-detail">
        <span class="mark"></span>
        <div class="title clr">
          <h4>升级规则</h4>
          <p>当前等级: <span>LV{{curData.grade}}</span></p>
        </div>
        <ul class="steps-box clr">
          <li class="steps-item" :class="curData.grade > key+1 ? 'steps-item-finish' : (curData.grade < key+1 ? 'steps-item-wait' : 'steps-item-process')" v-for="(item,key) in lvRuleData" :key="key">
            <div class="steps-head">LV{{key + 1}}</div>
            <div class="steps-main">{{item}}天</div>
            <div class="steps-tail" v-if="(key + 1) < lvRuleData.length"></div>
          </li>
        </ul>
        <p>每天启动+登录小白浏览器并累计在线满10分钟可以正常增长等级</p>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
@stepsHeadColor1: #009aff;
@stepsHeadColor2: #fff;
@stepsMainColor: #8b9199;
  .info-grade-bar{
    position: relative;
    font-size: 12px;
  }
  .grade-logo{
    position: absolute;
    width: 50px;
    height: 50px;
    line-height: 50px;
    left: 0;
    top: -20px;
    font-weight: bold;
    background: url('../../static/img/lvbg.svg') no-repeat;
    text-align: center;
    background-size: cover;
  }
  .info-grade-progress-1{
    width: 278px;
    height: 8px;
    margin-left: 44px;
    border-radius: 20px;
    display: inline-block;
    background: #fff;
    overflow: hidden;
  }
  .info-grade-progress-2{
    width: 178px;
    height: 8px;
    border-radius: 20px;
    background-image: linear-gradient(left,#ffda8e,#ffb960);
  }
  .lv-rule{
    position: relative;
    height: 32px;
    margin-left: 20px;
    padding-left: 20px;
    float: right;
    &:hover .rule-detail{
      z-index: 9;
      opacity: 1;
    }
    cursor: pointer;
    i{ position: absolute; left: 0;top: -4px; }
  }
  .rule-detail{
    opacity: 0;
    position: absolute;
    width: 570px;
    height: 250px;
    left: -282px;
    top: 24px;
    border: 1px solid #f2f2f2;
    box-sizing: border-box;
    padding: 28px;
    border-radius: 2px;
    box-shadow: 0 5px 15px rgba(73,126,255,.1);
    background: #fff;
    z-index: -9;
    cursor: default;
    color: @stepsMainColor;
    transition: opacity .5s ease-in-out;
    .mark{
      position: absolute;
      top: -16px;
      left: 280px;    
      border: 8px solid transparent;
      border-bottom: 8px solid #fff;
      z-index: 9999;
    }
    .title{
      height: 36px;
      line-height: 36px;
      margin-bottom: 40px;
      border-bottom: 1px solid #f2f2f2;
      h4{ font-size: 16px; color: #343434; float: left;}
      p{font-size: 14px; color: #686868; float: right;}
      span{font-size: 18px; color: @stepsHeadColor1;}
    }
    &>p{line-height: 28px; margin-top: 22px; font-size: 14px;text-align: center;}
  }
  .steps-box{
    margin-right: -26px;
  }
  .steps-item{
    position: relative;
    width: 52px;
    height: 70px;
    float: left;
    &-finish{
      .steps-head{
        line-height: 34px;
        border: 2px solid @stepsHeadColor1;
        color: @stepsHeadColor1;
      }
      .steps-tail{
        display: block;
      }
    }
    &-process{
      .steps-head{
        background: @stepsHeadColor1;
        box-shadow: 0 5px 15px rgba(73,126,255,.1);
        color: @stepsHeadColor2;
      }
    }
    &-wait{
      .steps-head{
        background: #f2f2f2;
        color: #353535;
      }
    }
  }
  .steps-main{
    width: 38px;
    height: 30px;
    line-height: 30px;
    text-align: center;
  }
  .steps-tail{
    display: none;
    position: absolute;
    width: 14px;
    height: 2px;
    left: 38px;
    top: 18px;
    background: @stepsHeadColor1;
  }
  .steps-head{
    width: 38px;
    height: 38px;
    line-height:38px;
    border-radius: 50%;
    text-align: center;
    box-sizing: border-box;
  }
</style>
<script>
import {lvRuleData} from '@const';
export default {
  props:['curData'],
  data(){
    return {
      //curLv: 2,
      lvRuleData,
      progress2: 0,
      needMore: 0,
    }
  },
  created(){
  },
  mounted(){
    this.init();
  },
  watch:{
    curData(){
      this.init();
    }
  },
  methods:{
    init(){
      let rate = 278 * (this.curData.active_days - this.lvRuleData[this.curData.grade-1]) / (this.lvRuleData[this.curData.grade] - this.lvRuleData[this.curData.grade-1]);
      this.needMore =  this.lvRuleData[this.curData.grade] - this.curData.active_days;
      if( this.curData.active_days >= 365 ){
        rate = 278;
      }
      var timer = setInterval(()=>{
        this.progress2++;
        if(this.progress2 >= rate){
          clearInterval(timer)
        }
      },10)
    }
  }
}
</script>
