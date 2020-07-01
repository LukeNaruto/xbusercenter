<template>
  <div @mouseenter="intervelBanner" @mouseleave="continueBanner" class="container">
    <div class="banner-box">
      <ul class="banner-list">
        <li v-for="item in banner" :key="item.index" :class="{active: curItem == item.index}" :style="{'background-image': 'url(' + item.url + ')'}">
          <p>{{item.desc}}</p>
          <span>{{item.desc_sub}}</span>
        </li>
      </ul>
    </div>
    <ul class="banner-list-contro">
      <li @click="switchBanner(item)" v-for="item in banner" :class="{active: curItem == item.index}" :key="item.index"></li>
    </ul>
  </div>
</template>
<script>
import chrome1 from '@s/img/chrome1.jpg';
import chrome2 from '@s/img/chrome2.jpg';
import { setTimeout, clearTimeout } from 'timers';
export default {
  data(){
    return{
      banner:[{
        url: chrome1,
        desc: '无限定制，随心所欲',
        desc_sub: '尝鲜全定制化设计，如此与众不同'
      },{
        url: chrome2,
        desc: 'CHROMIUM',
        desc_sub: 'Chrome66，极致响应，超快渲染，性能更强劲'
      }],
      curItem: 0,
      timer: null,
      interval: 4000,
      index: 0,
      /* resizeFlag: false,
      timerMove: null, */
    }
  },
  created(){
    this.initBanner();
  },
  mounted(){
    this.continueBanner();
    /* window.onresize = () => {
      if(this.resizeFlag) return;
      this.resizeFlag = true;
      this.intervelBanner();
    };
    window.onmousemove = () => {
      this.timerMove = setTimeout(() => {
        if(this.resizeFlag){
          clearTimeout(this.timerMove);
          this.continueBanner();
        }
        this.resizeFlag = false;
      },0);
      
    } */
  },
  methods:{
    intervelBanner(){
      clearTimeout(this.timer);
    },
    switchBanner(item){
      if(this.curItem === item.index) return;
      this.curItem = item.index;
    },
    continueBanner(){
      clearTimeout(this.timer);
      this.timer = setTimeout(()=>{
        let cur = this.banner[this.index];
        this.switchBanner(cur);
        this.index++;
        if(this.index >= this.banner.length){
          this.index = 0;
        }
        this.continueBanner();
      },this.interval);
    },
    initBanner(){
      this.banner.forEach((item,index) => {
        item.index = index;
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .banner-list{
    position: relative;
    height: 100%;
    & > li{
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center center;
      opacity: 0;
      transition: all 1s;
      &.active{
        opacity: 1;
      }
      p,span{
        position: absolute;
        width: 100%;
        left: 0;
        text-align: center;
      }
      p{
        top: calc(20% - 70px);
        font-size: 40px;
        color: #fff;
      }
      span{
        top: 20%;
        font-size: 16px;
        color: #9a9da1;
      }
      &:nth-child(2) p{
        font-size: 50px;
      }
    }
  }
  .container{background: #fff;
    position: relative;
    width: 100%;
    height: 100%;
    .banner-box{
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
  }
  .banner-list-contro{
    position: absolute;
    width: 100%;
    height: 4px;
    bottom: 28px;
    left: 0;
    text-align: center;
    & > li{
      display: inline-block;
      width: 24px;
      height: 4px;
      &.active{
        background: #009aff;
      }
      margin: 0 2px;
      background: #0d4679;
      cursor: pointer;
    }
    z-index: 9;
  }
</style>