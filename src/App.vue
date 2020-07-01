<template>
  <div id="app" v-show="!toOther" :class="{'info-edit': isEdit, logined: !loginDialogFlag && !isEdit }">
    <header v-if="!loginDialogFlag" class="clr" :class="{'info-edit': isEdit}">
      <a :href="logohref"><h1 class="logo">个人中心</h1></a>
      <div class="handle-info">
        <div v-show="!isEdit" v-if="isLogin" class="change-info fLeft" >
          <router-link to="/edit">
            <button>编辑资料</button>
          </router-link>
          &ensp;|&ensp;
        </div>
        <router-link v-show="isEdit" v-if="isLogin"  to="/">
          <button class="back">返回</button>
        </router-link>
        <div v-show="!isEdit" class="change-login fRight">
          <button v-if="isLogin" @click="handleLoginout_">退出登录</button>
          <!-- <button v-else @click="handleShowLogin">立即登录</button> -->
        </div>
      </div>
    </header>
    
    <keep-alive>
      <router-view :userData="userData"></router-view>
    </keep-alive>
    <FooterLink v-if="!loginDialogFlag"></FooterLink>
    <ConfirmBox v-if="sureLoginout" @user_on_cancel="handleLoginoutCancel" @user_on_ok="handleLoginoutOK">确认退出登录！</ConfirmBox>
    <!-- <AlertBox v-if="isNotrace" v-show="alertNotrace" isIconType="error" okText="确认" @user_alert_close="hide_isNotrace" @user_alert_ok="hide_isNotrace">使用“普通模式”打开此页面才能正常体验此模块哦</AlertBox> -->
    <!-- <ConfirmBox v-if="bookmarksImportFlag" @user_on_cancel="handleHideComfirm" @user_on_ok="handleBeOK" cancelText="撤销导入"
      okText="确认导入">本地书签已经自动导入到小白浏览器账号</ConfirmBox> -->
  </div>
</template>


<script>
import FooterLink from '@c/footer-link';
import Home from './views/home';
import InfoEdit from './views/info-edit';
import { mapState, mapMutations, mapActions } from 'vuex';
import {handleJump_url} from './libs/util';
export default {
  components: {
    FooterLink,
    Home,
    InfoEdit,
  },
  data() {
    return {
      sureLoginout:false,
      logohref: ''
    }
  },
  created() {
    window.puc = this;
    if(!this.isXb)return;
    let thirdlogin = JSON.parse(this.$cookies.get('thirdlogin') || '{}') || {};
    let jump_url = thirdlogin.jump_url;
    if(thirdlogin.c === '' && location.hash === '#thirdlogin'){
      this.set_toOther(true);
      this.get_bbs_jssrc(thirdlogin.bbs_jssrc);
      setTimeout(()=>{
        handleJump_url(jump_url);
      },1000);
    }else{
      this.handleGetUserInfo().then((res)=>{
        if (location.hash === '#thirdlogin') {
          
          let jump_url = thirdlogin.jump_url;
          this.get_bbs_jssrc(thirdlogin.bbs_jssrc);
          if(chrome.xb && chrome.xb.setUserStatus) chrome.xb.setUserStatus(1,thirdlogin.c);
          if(jump_url) setTimeout(()=>{
              handleJump_url(jump_url);
          },1000);
          location.hash = '';
        }
      }).catch((error)=>{
        this.handleShowLogin();
      });
    }

    this.logohref = window.location.origin;
    this.get_hash(location.hash);
    
  },
  computed: {
    ...mapState('main',{
      userData : 'user_info_data',
      isLogin: 'isLogin',
      isEdit: 'isEdit',
      isXb:'isXb',
      isNotrace: 'isNotrace',
      loginDialogFlag: 'login_dialog_flag',
      toOther: 'toOther',
    }),
  },
  watch:{
    '$route' (to, from) {
      //tabs切换
      // console.log(to, from)
      if(to.path === '/edit'){
        this.show_edit();
      }else{
        this.hide_edit();
      }
    },
  },
  mounted(){

  },
  methods: {
    ...mapMutations('main',{
      handleShowLogin: 'show_login_dialog',
      get_hash:'get_hash',
      show_edit:'show_edit',
      hide_edit:'hide_edit',
      hide_isNotrace: 'hide_isNotrace',
      get_bbs_jssrc: 'get_bbs_jssrc',
      set_toOther: 'set_toOther',
    }),
    ...mapActions('main',['handleGetUserInfo','handleLoginout']),
    handleLoginout_(){
      this.sureLoginout = true;
    },
    handleLoginoutOK() {
      this.handleLoginout().then(res=>{
        this.sureLoginout = false;
      })
    },
    handleLoginoutCancel(){
      this.sureLoginout = false;
    },
  }
}
</script>
<style lang="less" scoped>
  #app {
    width: 100%;
    height: 100%;
    min-width: 1100px;
    min-height: 938px;
    background-repeat: no-repeat;
    background-size: 100% 350px;
    &.info-edit {
      background: #f8f9fa;
    }
    &.logined{
      background-image: url("./static/img/main_bg.jpg");
    }
  }
  header{
    width: 1100px;
    //background: #f8f9fa;
    margin: 0 auto;
  }
  .info-edit{
    .logo,.handle-info button{
      color: #2e3033;
    }
    .logo{
      margin-left: 70px;
      background-image: url('./static/img/minibai.svg');
    }
  }
  .logo{
    background: url('./static/img/minibai.svg') no-repeat 0;
    background-size: 40px 40px;
    height: 60px;
    line-height: 58px;
    padding-left: 50px;
    display: inline-block;
    font-size: 20px;
    color: #fff;
  }
  .handle-info{
    height: 60px;
    line-height: 60px;
    float: right;
    color: #fff;
    font-size: 14px;
    button{
      color: #fff;
      background: transparent;
    }
    .back{
      width: 80px;
      height: 32px;
      line-height: 32px;
      border-radius: 32px;
      margin-right: 70px;
      padding-top: 0;
      background-color: rgb(255, 255, 255);
      box-shadow: 0px 1px 4px 0px rgba(155, 155, 155, 0.16);

    }
  }
  
</style>
