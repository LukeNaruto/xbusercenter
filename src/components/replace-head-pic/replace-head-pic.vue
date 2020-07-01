<template>
  <div class="dialog">
    <div class="container">
      <button @click="handleHideDialog" class="close" title="关闭"><i class="icon iconfont iconClose-box-px"></i></button>
      <h3 class="title">头像设置</h3>
      <div class="main">
        <div class="user-pic">
          <img src="" alt="">
          <div class="">
            <form id="pic_form" enctype="multipart/form-data">
              <input type="file" name="icon_upload" id="pic_upload" @change="handleUpload" accept="image/jpg,image/png"
                :disabled="upfileDisabled">
              <button class="button-default" type="button">自定义上传</button>
            </form>
          </div>
          <p>仅支持JPG、PNG格式，文件小于1M</p>
        </div>
        <div class="recommend-pic">
          <h4 class="recommend-title">精选推荐</h4>
          <ul class="recommend-items">

          </ul>
        </div>
        <div style="text-align: center;">
          <button class="sync-data button-default" @click="handleCancel">取消</button>
          <button class="sync-data button-blue" @click="handleSubmit">保存</button>
        </div>
      </div>
    </div>
  </div>
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
    box-shadow: 0 6px 16px rgba(0, 0, 0, .1);

    .title {
      font-size: 14px;
      line-height: 14px;
      color: #323232;
      text-align: center;
      margin-bottom: 20px;
    }

    .close {
      position: absolute;
      width: 20px;
      height: 20px;
      top: 10px;
      right: 10px;
    }
  }

  .main {
    width: 590px;
    height: 230px;
    line-height: 30px;
  }
</style>
<script>
  export default {
    data(){
      return {
        upfileDisabled: false,
      }
    },
    methods: {
      handleHideDialog() {

      },
      handleCancel() {

      },
      handleSubmit() {

      },
      handleUpload(){

      },
    }
  }
</script>