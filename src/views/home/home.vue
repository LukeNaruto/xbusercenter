<template>
  <div class="container" :class="{unlogined: loginDialogFlag}">
    <div v-if="!loginDialogFlag" class="info-panel clr">
      <div class="header-img"
           :style="`background-image: url(${userData.avatar ? userData.avatar : headPic})`"></div>
      <div class="info-grade">
        <div @click="setNickName" :style="{cursor: userData.nickname == '未设置' ? 'pointer' : ''}" class="info-name">{{userData.nickname}}</div>
        <ProgressEl :curData="userData"></ProgressEl>
        <div class="sync">
          
          <button @click="handleSync" :class="['sync-button', sync.running ? 'disabled': '']" :disabled="sync.running "><span class="icon iconfont iconrefresh_"></span> {{sync.button}}</button>
          <span v-if="sync.date">（{{formatDate(sync.date)}} 时同步）</span>
        </div>
      </div>
      <div class="used-days">
        <p class="title">小白浏览器已陪伴您</p>
        <h3 class="days">{{userData.days}}<span> - 天</span></h3>
      </div>
    </div>
    <SyncData v-if="!loginDialogFlag"></SyncData>

    <AlertBox v-if="!isXb"
              v-show="alertNotBeXB"
              isIconType="error"
              okText="下载小白浏览器"
              @user_alert_close="switch_isXb"
              @user_alert_ok="handleDownloadXb">使用小白浏览器打开此页面才能正常体验此模块哦</AlertBox>
    <!-- <LoginDialog v-if="loginDialogFlag"
                 @user_hide_login="hide_login_dialog"></LoginDialog> -->
    <Login v-if="loginDialogFlag" />
    <!-- <registerDialog v-if="regDialogFlag"></registerDialog> -->
  </div>
</template>

<script>
import ProgressEl from '@c/progress';
import SyncData from '@c/sync-data';
import headPic from '@s/img/head-pic.png';
import Login from '../login';
import {
  mapState,
  mapMutations
} from 'vuex';
export default {
  props: ['userData'],
  components: {
    ProgressEl,
    SyncData,
    Login
  },
  data () {
    return {
      headPic,
      sync:{
        button: '同步数据',
        date: '',
        disabled: false,
        timer: null,
        running: false,
      }
    }
  },
  created () {
    if (!this.isXb) return;
    if (location.hash === '#thirdreg' && this.isLogin) {
      location.hash = '';
    }
    if (location.hash === '#thirdreg' && !this.isLogin) {
      this.show_regDialog()
    }
  },
  destroyed(){
    clearInterval(this.sync.timer);
  },
  watch: {
    $route(val, val_){
      if(this.isLogin) this.initSyncStatus();
    },
    isLogin(val){
      clearInterval(this.sync.timer);
      if(val){
        this.sync.timer = setInterval(this.initSyncStatus, 1000);
      }
    }
  },
  computed: {
    ...mapState('main', {
      isLogin: 'isLogin',
      isXb: 'isXb',
      regDialogFlag: 'regDialogFlag',
      alertNotBeXB: 'alertNotBeXB',
      loginDialogFlag: 'login_dialog_flag',
    }),
  },
  methods: {
    ...mapMutations('main', ['show_login_dialog', 'switch_isXb', 'hide_login_dialog', 'show_regDialog']),
    handleSync(){
      if(!chrome.xb.startSyncByManual)return ;
      if(this.sync.disabled){
        this.$router.push('/edit?t=sync');
        return ;
      }
      let runSync = false, now = new Date().getTime();;
      if(!localStorage.getItem('_s_t_')){
        runSync = true;
      } else {
        let last = +localStorage.getItem('_s_t_');
        runSync = (last + 1000 * 10) <= now;
      }
      if(runSync && !this.sync.running){
        let token = this.$cookies.get('token');
        localStorage.setItem('_s_t_', now);
        chrome.xb.startSyncByManual(token,(res)=>{
          this.sync.running = true;

          let error_reason = (function() {
            switch(res.error_reason){
              case 'token is wrong':
                  return 'token 错误';
              case 'sync not start':
                  return '同步未启动';
              default:
                return '';
            }
          })();
          if(error_reason){
            	this.$Message.info({
              content: '<span class="icon iconfont iconfail-px1"></span>' + error_reason,
              duration: 2.5,
            });
          }
        })
      }
    },
    initSyncStatus(){
      if(!chrome.xb || !chrome.xb.getSyncStatus) return;
      const promises = [];
      promises[0] = new Promise(resolve => {
        chrome. xb.getAllSyncTypeSwitchState(resolve);
      });
      promises[1] = new Promise(resolve => {
        if(chrome.xb.getSyncStatus) {chrome.xb.getSyncStatus(resolve);}
      });
      Promise.all(promises).then(result => {
        let {sync_timer, is_running} = result[1];
        this.sync.disabled = result[0].every(sync => {
          return !sync.status;
        });
        this.sync.date = sync_timer;
        this.sync.running = is_running;
        this.sync.button = this.sync.disabled ? '去开启同步' :( is_running ? '同步中…' : '同步数据');
      });
      
    },
    handleDownloadXb () {
      window.open('//www.minibai.com', '_blank');
    },
    setNickName(){
      if(this.userData.nickname === '未设置'){
        this.$router.push('/edit?t=nk');
      }
    },
    toTwo(num){
      return num > 9 ? num : '0' + num;
    },
    formatDate(s){
      let time = new Date(s * 1000),year,month,date,hour,minute,second,timeStr;
      year = time.getFullYear();
      month = time.getMonth() + 1;
      date = time.getDate();
      hour = this.toTwo(time.getHours());
      minute = this.toTwo(time.getMinutes());
      second = this.toTwo(time.getSeconds());
      timeStr = year +'-'+month +'-'+ date + ' '+ hour +':'+ minute + ':'+ second;
      return timeStr;
    }
  }
}
</script>
<style lang="less" scoped>
.info-panel {
  padding-top: 42px;
  color: #fff;
}

.info-grade {
  float: left;
  margin-top: 24px;
}

.used-days {
  width: 270px;
  height: 170px;
  margin-top: 16px;
  padding: 10px 0 0 0;
  text-align: center;
  background: url("../../static/img/days_bg.png") no-repeat;
  float: right;

  .title {
    height: 40px;
    line-height: 40px;
    font-size: 16px;
  }

  .days {
    height: 90px;
    line-height: 90px;
    font-size: 56px;

    & > span {
      position: relative;
      top: -4px;
      font-size: 24px;
    }
  }
}

.info-name {
  font-size: 26px;
  margin-bottom: 10px;
}
.sync{
  height: 32px;
  line-height: 32px;
  margin-top: 24px;
  .sync-button{
    float: left;
    padding: 0 22px;
    border-radius: 32px;
    background-color: #fff;
    font-size: 14px;
    color: #3eafff;
    box-shadow: 0px 1px 4px 0px rgba(155, 155, 155, 0.16);
    transition: all .3s ease-in;
    &.disabled{
      cursor: not-allowed;
    }
  }
  &:hover .sync-button{
    background-color: #f1f9ff;
  }
}
.header-img {
  width: 120px;
  height: 120px;
  margin: 28px 40px 0 0;
  border-radius: 50%;
  float: left;
  border: 4px solid #fff;
  box-shadow: 0 10px 20px rgba(84, 122, 255, 0.23);
  box-sizing: border-box;
  overflow: hidden;
  background-color: #fff;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

.container {
  width: 1100px;
  height: calc(100% - 180px);
  margin: 0 auto;
  box-sizing: border-box;
  &.unlogined{
    width: 100%;
    height:100%;
  }
}
</style>
