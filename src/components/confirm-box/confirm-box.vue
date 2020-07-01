<template>
<transition name="fade">
  <div class="dialog">
    <div class="container_ clr">
      <span class="icon iconfont" :class="curIconType.icon" :style="{color: curIconType.color}"></span>
      <span>
        <slot></slot>
      </span>
      <button class="button-default" @click="cancel">{{cancelText}}</button>
      <button class="button-blue" @click="ok">{{okText}}</button>
    </div>
  </div>
</transition>
</template>
<style lang="less" scoped>
  .dialog{
    text-align: center;
  }
  .container_{
    position: relative;
    display: inline-block;
    height: 58px;
    padding: 14px 24px 14px 56px;
    margin: 10px auto;
    background: #fff;
    border-radius: 2px;
    font-size: 14px;
    color: #222;
    box-shadow: 0 6px 16px rgba(0,0,0,.1);
    &>span{
      margin-right: 14px;
    }
    button{
      height: 34px;
      line-height: 34px;
      padding: 0 20px;
      font-size: 12px;
    }
    .button-blue{
      margin-left: 6px;
    }
    .icon{
      position: absolute;
      top: 10px;
      left: 18px;
      font-size: 26px;
    }
  }
</style>
<script>
export default {
  props:{
    cancelText:{
      type: String,
      default: '取消'
    },
    okText:{
      type: String,
      default: '确认'
    },
    isIconType:{
      type: String,
      default: 'default'
    },
  },
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
      curIconType: null,
    }
  },
  created(){
    this.curIconType = this.iconType[this.isIconType];
  },
  methods:{
    cancel(){
      this.$emit('user_on_cancel');
    },
    ok(){
      this.$emit('user_on_ok');
    }
  }
}
</script>