<template>
  <div class="editAvatar">
    <div class="title">
      <!-- <button
        :class="[
          'button-cancel',
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].includes(Number(status.avatarId)) &&
            'mr-10'
        ]"
        type="button"
        @click="setFunction('avatar'), (status.avatarId = '')"
      >
        取消修改
      </button> -->
      <button
        class="button-primary"
        type="button"
        @click="saveAvatar"
        v-show="
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].includes(Number(status.avatarId))
        "
      >
        保存修改
      </button>
    </div>

    <div class="content">
      <!-- <div class="title">精选推荐</div> -->
      <div class="image-box" @click="chooseAvatar">
        <div avatarId="1" :class="['avatar', 'avatar-1', 'first', { active: status.avatarId == 1 }]" />
        <div avatarId="2" :class="['avatar', 'avatar-2', { active: status.avatarId == 2 }]" />
        <div avatarId="3" :class="['avatar', 'avatar-3', { active: status.avatarId == 3 }]" />
        <div avatarId="4" :class="['avatar', 'avatar-4', { active: status.avatarId == 4 }]" />
        <div avatarId="5" :class="['avatar', 'avatar-5', { active: status.avatarId == 5 }]" />
        <div avatarId="6" :class="['avatar', 'avatar-6', 'first', { active: status.avatarId == 6 }]" />
        <div avatarId="7" :class="['avatar', 'avatar-7', { active: status.avatarId == 7 }]" />
        <div avatarId="8" :class="['avatar', 'avatar-8', { active: status.avatarId == 8 }]" />
        <div avatarId="9" :class="['avatar', 'avatar-9', { active: status.avatarId == 9 }]" />
        <div avatarId="10" :class="['avatar', 'avatar-10', { active: status.avatarId == 10 }]" />
        <!-- <img
          avatarId="1"
          :class="['avatar', 'first', { active: status.avatarId == 1 }]"
          src="@s/img/boy_1.png"
        />
        <img
          avatarId="2"
          :class="['avatar', { active: status.avatarId == 2 }]"
          src="@s/img/boy_2.png"
        />
        <img
          avatarId="3"
          :class="['avatar', { active: status.avatarId == 3 }]"
          src="@s/img/boy_3.png"
        />
        <img
          avatarId="4"
          :class="['avatar', { active: status.avatarId == 4 }]"
          src="@s/img/boy_4.png"
        />
        <img
          avatarId="5"
          :class="['avatar', { active: status.avatarId == 5 }]"
          src="@s/img/boy_5.png"
        />
        <img
          avatarId="6"
          :class="['avatar', 'first', { active: status.avatarId == 6 }]"
          src="@s/img/girl_1.png"
        />
        <img
          avatarId="7"
          :class="['avatar', { active: status.avatarId == 7 }]"
          src="@s/img/girl_2.png"
        />
        <img
          avatarId="8"
          :class="['avatar', { active: status.avatarId == 8 }]"
          src="@s/img/girl_3.png"
        />
        <img
          avatarId="9"
          :class="['avatar', { active: status.avatarId == 9 }]"
          src="@s/img/girl_4.png"
        />
        <img
          avatarId="10"
          :class="['avatar', { active: status.avatarId == 10 }]"
          src="@s/img/girl_5.png"
        /> -->
      </div>

      <Upload
        class="upload"
        action
        :show-upload-list="false"
        :before-upload="beforeUpload"
        accept="image/jpg, image/jpeg, image/png"
        :format="['jpg', 'jpeg', 'png']"
      >
        <button class="button" type="button" @click="status.avatarId = ''">
          自定义上传
        </button>
      </Upload>

      <Modal
        v-model="status.cropper"
        class="modal cropper-container"
        :styles="{ width: '354px' }"
        :closable="false"
        :mask-closable="false"
        :footer-hide="true"
      >
        <div class="cropper-title">自定义头像</div>
        <vueCropper
          ref="cropper"
          class="cropper"
          :img="data.previewAvatar"
          outputType="png"
          :autoCrop="true"
          :fixed="true"
          :info="false"
          :fixedNumber="[1, 1]"
          :centerBox="status.centerBox"
        />
        <div class="cropper-tools">
          <span
            class="iconfont icongengduo-zuoxuanzhuan-px"
            @click="rotateLeft"
          ></span>
          <span
            class="iconfont icongengduo-suoxiao-px"
            @click="changeScale(-1)"
          ></span>
          <span
            class="iconfont icongengduo-fangda-px"
            @click="changeScale(1)"
          ></span>
          <span
            class="iconfont icongengduo-youxuanzhuan-px"
            @click="rotateRight"
          ></span>
        </div>
        <div class="cropper-buttons">
          <button class="button-cancel" type="button" @click="resetCropper">
            重置
          </button>
          <button class="button-primary" type="button" @click="cutAvatar">
            确定
          </button>
          <button class="button-cancel" type="button" @click="cancelCropper">
            取消
          </button>
        </div>
      </Modal>
      <div class="notice">仅支持JPG、PNG格式，文件小于10M</div>
    </div>
  </div>
</template>

<script>
import { VueCropper } from "vue-cropper";
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
export default {
  name: "avatar",
  components: {
    VueCropper
  },
  data() {
    return {
      status: {
        // 头像修改
        avatar: null, // 头像
        cropper: false, // 裁剪组件显示
        // 头像修改
        avatarId: "", // 精选头像ID
        centerBox: true
      },
      data: {
        file: null, // 上传头像保存的file
        previewAvatar: null // 头像
      }
    };
  },
  // props: ['userData'],
  computed: {
    ...mapGetters(["getFunction", "getUserInfo"])
  },

  created() {},

  methods: {
    ...mapMutations(["setFunction"]),
    ...mapActions("main", {
      initData: "handleGetUserInfo"
    }),

    chooseAvatar(e) {
      const _id = e.target.getAttribute("avatarId");

      if (_id != null && _id != undefined) {
        this.status.avatarId = _id;
      }
    },

    beforeUpload(file) {
      if (file.size > 1024 * 1024 * 10) {
        this.$Message.info({
          content:
            '<span class="icon iconfont iconfail-px1"></span>请选择小于10M的图片',
          duration: 2.5
        });
        return;
      }
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = e => {
        let _file = e.target.result;
        // this.data.file = this.$base64.encode(_file);
        this.data.previewAvatar = _file;
        this.status.cropper = true;

        // 控制，截图框是否被限制在图片里面
        setTimeout(() => {
          this.status.centerBox = false;
        }, 500);
      };
      return false;
    },

    saveAvatar() {
      const { avatarId } = this.status;
      const { file } = this.data;
      let _data = {
        act: "modifyavatar"
      };
      if ([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].includes(Number(avatarId))) {
        _data.avatar_id = avatarId;
      } else {
        _data.avatar = file;
      }

      this.$api.postHome(_data).then(res => {
        this.initData();
        this.setFunction('avatar');
        //if (chrome.xb) chrome.xb.setUserStatus(2, '{"nk":"____昵称____","av":"___//xxx.png___"}');
        // console.log('头像修改成功__', res)
      });
      // .catch(error => {
      //   console.log('头像修改失败__', error)
      // });
    },

    changeScale(num) {
      num = num || 1;
      this.$refs.cropper.changeScale(num);
    },

    rotateLeft() {
      this.$refs.cropper.rotateLeft();
    },

    rotateRight() {
      this.$refs.cropper.rotateRight();
    },

    cutAvatar() {
      this.$refs.cropper.getCropData(data => {
        this.data.file = data;
        this.saveAvatar();
        this.cancelCropper();
      });
    },

    resetCropper() {
      this.$refs.cropper.refresh();
    },

    cancelCropper() {
      this.status.cropper = false;

      // 控制，截图框是否被限制在图片里面
      setTimeout(() => {
        this.$refs.cropper.refresh();
        this.status.centerBox = true;
      }, 500);
    }
  }
};
</script>

<style lang="less" scoped>
@import "./style.less";
</style>
