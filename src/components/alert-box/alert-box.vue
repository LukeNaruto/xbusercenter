<template>
<transition name="fade">
  <div class="dialog">
    <div class="container clr">
      <button @click.stop="close" class="close" title="关闭"><i class="icon iconfont iconClose-box-px"></i></button>
      <span class="icon iconfont" :class="curIconType.icon" :style="{color: curIconType.color}"></span>
      <p>
        <slot></slot>
      </p>
      <div class="button-box">
        <slot slot="button"></slot>
        <button class="button-blue" @click.stop="ok">{{okText}}</button>
      </div>
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
    width: 360px;
    height: 190px;
    padding: 30px 84px;
    margin: 232px auto;
    background: #fff;
    border-radius: 2px;
    font-size: 14px;
    color: #222;
    box-shadow: 0 6px 16px rgba(0,0,0,.1);
    &>p{
      line-height: 18px;
      margin: 18px 0 0 38px;
    }
    &>span.icon{
      position: absolute;
      left: 84px;
      top: 42px;
      font-size: 30px;
    }
    .button-box{
      position: absolute;
      width: 100%;
      left: 0;
      bottom: 30px;
      text-align: center;
    }
    .button-blue{
      height: 34px;
      line-height: 34px;
      padding: 0 20px;
      font-size: 12px;
    }
  }
  .close {
    position: absolute;
    width: 20px;
    height: 20px;
    top: 10px;
    right: 10px;
  }
</style>
<script>
export default {//
  data(){
    return {
      iconType:{
        default:{
          icon: 'iconPrompt-px2',
          color: '#009bf1'
        },
        success:{
          icon: 'iconSuccess-px1',
          color: '#31df9b'
        },
        error:{
          icon: 'iconfail-px1',
          color: '#ef7255'
        }
      },
      curIconType:null,
    }
  },
  props:{
    okText:{
      type: String,
      default: '确认'
    },
    isIconType:{
      type: String,
      default: 'default'
    }
  },
  created(){
    this.curIconType = this.iconType[this.isIconType];
  },
  methods:{
    ok(){
      this.$emit('user_alert_ok');
    },
    close(){
      this.$emit('user_alert_close');
    }
  }
}
</script>