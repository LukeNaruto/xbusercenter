<template>
  <div class="main">
    <!-- <ul class="skip-box">
      <li v-for="(item,key) in BBSTypeData" :key="key"><strong @click="handleSkipToBBS(item.url)"><i class="icon iconfont" :class="item.icon"></i>{{item.name}} <span v-if="item.count" class="icon iconfont iconmessage_1"></span></strong></li>
    </ul> -->
    <ul class="choice-type">
      <li v-for="(item, key) in choiceType" :key="key" @click="handleSkipToType(item)">
        <i class="icon iconfont" :class="item.icon" :style="{color: item.color}"></i>
        <p>{{item.name}}</p>
      </li>
    </ul>
    <!-- <div style="text-align: center;">
      <button class="sync-data" @click="handleSyncData__"><i class="icon iconfont iconrefresh_"></i>同步数据</button>
    </div> -->
    <transition name="fade">
      <SyncDataDialog @user_hide_sync_dialog="handleSyncData" v-show="showOrHideSyncBox"></SyncDataDialog>
    </transition>
  </div>
</template>
<style lang="less" scoped>
  .main{
    width: 100%;
    margin-top: 62px;
    border-radius: 4px;
    background: #fff;
    padding-top: 60px;
  }
  .skip-box{
    height: 100px;
    padding: 30px 0;
    display: flex;
    align-items: center;
    justify-content: space-around;
    box-shadow: 0 2px 27px rgba(99,135,255,.15);
    margin-bottom: 30px;
    box-sizing: border-box;
    &>li{
      width: 33%;
      text-align: center;
      font-size: 14px;
      color: #2e3033;
      
      &:nth-of-type(2){
        border-left: 1px solid #e3e3e4;
        border-right: 1px solid #e3e3e4;
      }
    }
    strong{
      position: relative;
      font-weight: normal;
      color: #2e3033;
      padding-left: 34px;
      vertical-align: middle;
      cursor: pointer;
      &:hover{
        color: #009aff;
      }
    }
    span{
      position: absolute;
      top: -12px;
      margin-left: 10px;
      font-size: 16px;
      color: #ff5635;
    }
    i.icon{
      position: absolute;
      left: 0;
      top: -10px;
      font-size: 26px;
    }
  }
  .choice-type{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    &>li{
      width: 275px;
      height: 150px;
      margin: 1px;
      border-radius: 4px;
      text-align: center;
      cursor: pointer;
      transition: all .2s ease-in-out;
      border: 1px solid transparent;
      //background: greenyellow;
      &:hover{
        margin-top: -2px;
        box-shadow: 0 5px 10px #f4f4f4;
        border-color: #f2f2f2;
      }
    }
    .icon{
      font-size: 50px;
      margin: 36px auto 2px;
      display: block;
    }
    p{
      font-size: 14px;
      color: #2e3033;
    }
  }
  .sync-data{
    height: 40px;
    width: 150px;
    border: 1px solid #009aff;
    border-radius: 20px;
    color: #009aff;
    background: #fff;
    margin-top: 20px;
    transition: all .3s ease-in-out;
    .icon{
      font-size: 14px;
      margin-right: 8px;
    }
    &:hover{
      background: #f1f9ff;
    }
  }
</style>
<script>
import SyncDataDialog from '../sync-data-dialog';
import {choiceType} from '@const';
import { mapState, mapMutations, mapActions } from 'vuex';
export default {
  components:{
    SyncDataDialog
  },
  data(){
    return {
      showOrHideDialog: false,
      choiceType,
      BBSTypeData_:[{
        name: '我的消息',
        icon: 'iconmessage_',
        url: '#我的消息',
      },{
        name: '我的贴子',
        icon: 'iconpost_',
        url: '#我的贴子',
      },{
        name: '我的活动',
        icon: 'iconactivity_1',
        url: '#我的活动',
      }]
    }
  },
  computed: {
    ...mapState('main',{
      showOrHideSyncBox : 'showOrHideSyncBox',
      isLogin: 'isLogin',
      BBSTypeData(state){
        this.BBSTypeData_[0].count = state.user_info_data.bbs_message;
        this.BBSTypeData_[1].count = state.user_info_data.bbs_post;
        this.BBSTypeData_[2].count = state.user_info_data.bbs_activity;
        return this.BBSTypeData_;
      }
    }),
  },
  methods:{
    ...mapMutations('main',{handleSkipToBBS:'skipToForum',handleSkipToType:'skipToType',handleSyncData:'switchSyncData'}),
    handleChoiceType(){
      this.showOrHideDialog = true;
    },
    handleHideDialog(){
      this.showOrHideDialog = false;
    },
    handleSyncData__(){
      this.handleSyncData();
      if(chrome.xb && this.isLogin) chrome.xb.showSyncWn(63);
    },
  }
}
</script>