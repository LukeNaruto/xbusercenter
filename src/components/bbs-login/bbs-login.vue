<template>
<transition name="fade">
  <div class="dialog">
    <div class="container clr">
      <button @click.stop="close" class="close" title="关闭"><i class="icon iconfont iconClose-box-px"></i></button>
      
      <h3 class="title"> 小白快速登录 </h3>
      <p class="desc">请点击头像授权登录</p>
      <p class="desc">或关闭本窗口登录其他账号</p>
      <div class="header-img"
            @click="shortcutLoginBBS"
           :style="`background-image: url(${avatar ? avatar : headPic})`"></div>
    </div>
  </div>
</transition>
</template>
<style lang="less" scoped>
  .dialog{
    //text-align: center;
  }
  .container{
    position: relative;
    width: 440px;
    height: 300px;
    padding: 30px 84px;
    background: #fff;
    border-radius: 2px;
    font-size: 14px;
    color: #222;
    text-align: center;
    box-shadow: 0 6px 16px rgba(0,0,0,.1);
    
  }
  .title{
    margin-bottom: 16px;
    font-size: 18px;
  }
  .desc{
    font-size: 14px;
  }
  .close {
    position: absolute;
    width: 20px;
    height: 20px;
    top: 10px;
    right: 10px;
  }
  
.header-img {
  width: 120px;
  height: 120px;
  margin: 20px auto 0;
  border-radius: 50%;
  border: 4px solid #eff1f3;
  box-sizing: border-box;
  overflow: hidden;
  background-color: #fff;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
}
.header-img:hover{
    box-shadow: 0 0 4px rgba(0,0,0,.1);

}
</style>
<script>
import headPic from '@s/img/head-pic.png';
import { mapState, mapMutations, mapActions } from 'vuex';
export default {//
  data(){
    return {
      headPic,
      act: '',
      curIconType:null,
      userData:{

      }
    }
  },
  props:{
    avatar: String
  },
  created(){
    this.ori = this.getLocationSearchKey('ori') || 0;
    switch(this.ori){
      case 1:
        this.act = 'bbslogin'
        break;
      case 3:
        this.act = 'asstlogin'
        break;
    }
  },
  methods:{
    ...mapMutations('main',['get_bbs_jssrc']),
    shortcutLoginBBS(){
      const act = this.act;
      this.$api.getHome({act}).then((res)=>{
        this.get_bbs_jssrc(res.data.bbs_jssrc);
        setTimeout(()=>{
          location.href = res.data.jump_url;
        },1000); 
      })
    },
    close(){
      this.$emit('shortcut_login_close');
    }
  }
}
</script>