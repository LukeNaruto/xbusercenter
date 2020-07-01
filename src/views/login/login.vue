<template>
<div id="app_">
    <div class="slider">
      <Banner />
    </div>
    <div class="main">
      <header>
        <a :href="logohref"><h1 class="logo" title="小白浏览器"></h1></a>
        <div class="crumbs-box clr">
          <button class="crumbs-btn"></button>
          <ul class="crumbs-list popup">
            <li><a :href="downloadUrl"><i class="iconwindows-px icon iconfont"></i> 下载更新</a></li>
            <li><a href="//www.minibai.com" target="_blank">进入官网</a></li>
            <li><a href="//mux.minibai.com" target="_blank">MUX</a></li>
            <!-- <li><a href="#">反馈</a></li> -->
            <!-- <li><a href="//tbbs.minibai.com" target="_blank">论坛</a></li> -->
          </ul>
        </div>
      </header>
      <div @click="alertNotBeXBFn($event)" class="main_">
        <LoginBox v-if="!isRegister"  />
        <RegisterAccount v-else/>
      </div>
      <footer>
        © {{year}} Minibai.com  <a href="//www.minibai.com/agreement.html" target="_blank"> 服务协议 </a><a href="//www.minibai.com/privacypolicy.html" target="_blank"> 隐私政策 </a>
      </footer>
    </div>
  </div>
  
</template>
<script>
import LoginBox from '../login-box';
import RegisterAccount from '../register-account';
import Banner from '@c/banner';
import {
  mapState,
  mapMutations
} from 'vuex';
export default {
  data(){
    return{
      year: 2018,
      downloadUrl: '',
      logohref: '',
    }
  },
  components:{LoginBox, Banner, RegisterAccount},
  computed: {
    ...mapState('main', {
      isLogin: 'isLogin',
      isXb: 'isXb',
      regDialogFlag: 'regDialogFlag',
      alertNotBeXB: 'alertNotBeXB',
      loginDialogFlag: 'login_dialog_flag',
      isRegister: 'isRegister'
    }),
  },
  created(){
    this.logohref = window.location.origin;
    this.year = new Date().getFullYear();
    this.downloadUrl = window.downloadUrl;
  },
  methods:{
    ...mapMutations('main',['switch_isXb','registerAccount']),
    alertNotBeXBFn(ev){
      if(!this.isXb){
        this.switch_isXb();
        ev.stopPropagation();
        
      }
    },
  }
}
</script>
<style lang="less" scoped>
#app_{
  width: 100%;
  height: 100%;
  & > div{
    float: left;
  }
}
.slider{
  width: 28%;
  min-width: 400px;
  height: 100%;
}
.main{
  position: relative;
  width: 72%;
  max-width: calc(100% - 400px);
  height: 100%;

}
  header{
    position: relative;
    height: 92px;
    padding: 24px;
    box-sizing: border-box;
  }
  .main_{
    position: absolute;
    width: 100%;
    height: 50%;
    margin: auto 0;
    top: 0;
    bottom: 0;
    box-sizing: border-box;
  }
  footer{
    position: absolute;
    width: 100%;
    height: 50px;
    bottom: 30px;
    line-height: 50px;
    font-size: 12px;
    color: #999;
    & > a{
      color: #999;
      &:hover{
        color: #666;
      }
    }
    text-align: center;
  }
  .crumbs-box{
    float: right;
    margin-top: -8px;
    padding :8px;
    &:hover{
      .crumbs-btn{
        background-color: #f1f3f4;
      }
      .crumbs-list{
        display: block;
      }
    }
  }
  .crumbs-list{
    display: none;
    position: absolute;
    right: 16px;
    top: 72px;
    padding: 8px 0;
    box-sizing: border-box;
    font-size:14px;
    li{
      height: 44px;
      line-height: 44px;
      padding: 0 20px;
      &:hover{
        background-color: #f1f3f4;
      }
    }
    a {
      color: #222;
    }
    z-index: 999;
  }
  .logo{
    width: 162px;
    height: 40px;
    margin: 4px 16px;
    display: inline-block;
    background: url('//src1.minibai.com/sourcefile/logo_black.svg') no-repeat;
    
  }
  .crumbs-btn{
    float: right;
    width: 42px;
    height: 42px;
    border-radius: 4px;
    transition: all .3s;
    background: url('../../static/img/logo.png') no-repeat right bottom;
    
  }
  .iconwindows-px{
    color: #009aff;
  }
</style>