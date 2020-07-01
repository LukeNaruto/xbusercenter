<template>
<transition name="fade">
  <div class="dialog">
    <div class="container">
      <button @click="handleHideDialog" class="close" title="关闭"><i class="icon iconfont iconClose-box-px"></i></button>
      <h3 class="title">同步数据</h3>
      <div class="subtitle">
        <p class="fLeft">请选择要同步的数据项:</p>
        <label class="checkbox-default fRight">
          <input type="checkbox" v-model="checkAll" class="checkbox-input" @change="handleCheckAll">
          <span class="checkbox-inner"></span>
          全选
        </label>
      </div>
      <ul class="sync-type clr">
        <li class="sync-item" v-for="(item, key) in choiceType1" :key="key">
          <i class="icon iconfont" :class="item.icon" :style="{color: item.color}"></i>
          <label class="checkbox-wrapper">
            <input type="checkbox" v-model="checkAllGroup" :value="item.name" @change="checkAllGroupChange" class="checkbox-input">
            <span class="checkbox-inner"></span>
            {{item.name}}
          </label>
        </li>
      </ul>
      <div style="text-align: center;">
        <button class="sync-data button-blue" @click="handleSubmitChoice">保存并同步</button>
      </div>
    </div>
  </div>
</transition>
</template>
<style lang="less" scoped>
  .container {
    position: relative;
    width: 440px;
    height: 450px;
    margin: 152px auto;
    padding: 20px;
    border: 1px solid #d7d7d8;
    border-radius: 2px;
    font-size: 12px;
    box-sizing: border-box;
    background: #fff;
    box-shadow: 0 6px 16px rgba(0,0,0,.1);
    .title {
      font-size: 14px;
      line-height: 14px;
      color: #323232;
      text-align: center;
      margin-bottom: 20px;
    }
    .subtitle{
      height: 30px;
      line-height: 30px;
    }
    .close {
      position: absolute;
      width: 20px;
      height: 20px;
      top: 10px;
      right: 10px;
    }
  }
  .sync-type{
    margin-right: -10px;
  }
  .sync-item {
    position: relative;
    float: left;
    width: 194px;
    height: 80px;
    padding: 0 16px;
    border: 1px solid #eee;
    box-sizing: border-box;
    border-radius: 4px;
    margin: 0 10px 10px 0;
    .icon {
      font-size: 50px;
    }
  }
  
  .checkbox-wrapper {
    position: absolute;
    left: 0;
    top: 0;
    display: block;
    width: 100%;
    height: 100%;
    line-height: 80px;
    padding-left: 82px;
    color: #2e3033;
    cursor: pointer;
  }
  .checkbox-default{
    display: inline;
    cursor: pointer;
    & .checkbox-inner{
      position: relative;
      bottom: -2px;
      right: unset;
    }
  }
  .checkbox-input {
    position: absolute;
    opacity: 0;
    &:checked+.checkbox-inner {
      background: #009bf1;
    }
  }

  .checkbox-inner {
    position: absolute;
    bottom: 10px;
    right: 10px;
    display: inline-block;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #eee;

    //border: 1px solid #c2c2c2;
    &:after {
      content: " ";
      position: absolute;
      width: 6px;
      height: 10px;
      left: 4px;
      top: 1px;
      border: 2px solid #fff;
      border-top: 0;
      border-left: 0;
      transform: rotate(45deg);
      //background-color: #009bf1;
    }
  }
  .sync-data{
    width: 120px;
    height: 36px;
    margin-top: 30px;
    border-radius: 2px;
  }
</style>
<script>
import {choiceType1} from '@const';
  export default {
    data() {
      return {
        checkAll: false,
        checkAllGroup: [],
        choiceType1,
      }
    },
    methods: {
      handleCheckAll() {
        if (this.checkAll) {
          this.checkAllGroup = ['账号密码','我的书签','历史记录','个性设置','下载记录','我的扩展'];
        } else {
          this.checkAllGroup = [];
        }
      },
      checkAllGroupChange() {
        if (this.checkAllGroup.length === this.choiceType1.length) {
          this.checkAll = true;
        } else {
          this.checkAll = false;
        }
      },
      handleHideDialog() {
        this.$emit('user_hide_sync_dialog');
      },
      handleSubmitChoice(){
        // console.log(this.checkAllGroup)
      }
    }
  }
</script>