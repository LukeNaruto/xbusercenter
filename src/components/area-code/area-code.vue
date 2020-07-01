<template>
  <div class="area-box">
    <button @click="handleHideArea" class="close" title="关闭"><i class="icon iconfont iconClose-box-px"></i></button>
    <button class="search-btn"><i class="icon iconfont icongengduo-sousuo-px"></i></button>
    <input name="321" id="lalal_" @keyup="handleSearch"  v-model="searchKey"  class="search-input" type="text" placeholder="搜索国家/地区" autocomplete="new-password">
    <!-- <input type="password" style="display:none"> -->
    <ul class="area-select" @click="handleSelectArea($event)">
      <li v-for="(value, key) in areaCodeData" :key="key" :data-code="key">
        {{value}}
        <p></p>
      </li>
    </ul>
    
  </div>
</template>
<style lang="less" scoped> 
  @blue: #009aff;
  .area-box{
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    padding: 20px 32px;
    background: #fff;
    z-index: 9;
  }
  .area-select{
    height: 350px;
    overflow: auto;
    border-top: 1px solid #f5f5f5;
    margin: 20px -32px 0;
    &>li{
      position: relative;
      height: 46px;
      line-height: 46px;
      padding: 2px 32px;
      //border-bottom: 1px solid #f5f5f5;
      font-size: 14px;
      color: #1b1b1b;
      background: #fff;
      cursor: pointer;
      &:hover{
        background: #f5f5f5;
      }
      &>p{
        position: absolute;
        left: 0;
        bottom: 0;
        width: calc(100% - 64px);
        margin: 0 32px;
        border-bottom: 1px solid #f5f5f5;
      }
    }
  }
  .search-input {
    width: 100%;
    height: 38px;
    outline: none;
    padding: 0 40px 0 14px;
    border: 1px solid #fff;
    box-sizing: border-box;
    border-radius: 18px;
    background: #f5f5f5;
    transition: border 0.4s;
    &:focus{
      background: #fff;
      border-color: @blue;
      box-shadow: 0 0 2px @blue;
    }
  }
  .search-btn{
    position: absolute;
    right: 48px;
    top: 26px;
    background: transparent;
    font-size: 14px;
    cursor: default;
    // &:hover i{
      //color: @blue;
    // }
  }
  .close {
    position: absolute;
    width: 20px;
    height: 20px;
    top: 6px;
    right: 6px;
  }
</style>
<script>
  export default {
    data() {
      return {
        areaCodeData:{
          '86': 'CN 86 中国大陆',
          '852': 'HK 852 中國香港',
          '853': 'MO 853 中國澳門',
          '886': 'TW 886 中國台灣',
        },
        areaCodeData_:{},
        searchKey:'',
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
      this.areaCodeData_={
        ...this.areaCodeData
      }
    },
    watch:{
      
    },
    methods: {
      handleSelectArea(ev){
        let target = ev.target;
        if(target.nodeName.toLocaleLowerCase() === 'li'){
          this.$emit('user_area_code',target.getAttribute('data-code'));
          this.$emit('user_area_code_hide');
        }
      },
      handleSearch(){
        if(!this.searchKey) {
          this.areaCodeData = {
            ...this.areaCodeData_
          };
          return;
        }
        let data = {};
        for(var attr in this.areaCodeData_){
          let target = this.areaCodeData_[attr].toLocaleLowerCase(),
              searchKey = this.searchKey.toLocaleLowerCase();
          if(target.indexOf(searchKey) != -1){
            data[attr] = this.areaCodeData_[attr];
          }
        }
        this.areaCodeData = data;
      },
      handleHideArea(){
        this.$emit('user_area_code_hide');
      },
    }
  }
</script>