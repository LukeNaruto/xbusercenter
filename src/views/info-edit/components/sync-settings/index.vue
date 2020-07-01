<template>
  <div class="sync-settings">
    <div class="title">
      <!-- 账户书签同步功能小白正在进行维护，将会在XX月XX日恢复正常使用，给您带来的不便小白深感歉意 -->
      <div class="cell">
        <div class="title">同步数据开关</div>
        <div class="content">
          <i-switch
            size="small"
            :value="mainSwitch.status"
            :disabled="!mainSwitch.enabled"
            :before-change="()=> setSyncSetting(mainSwitch.status, mainSwitch.type)"
          />
        </div>
      </div>
    </div>

    <div class="content">
      <div v-for="(value, key) in switchList" :key="key" class="cell">
        <div class="title">
          <span :class="`iconfont ${value.icon} mr-10`" />
          {{value.label}}
        </div>
        <div class="content">
          <a v-if="(value.type!=3 && value.type!=0) || (noLowVInNB && value.type == 0)" class="btn-clear" 
            :title="!value.status ? '开启此项同步功能后才可以初始化' : ''" 
            :style="{'color': !value.status ? '#aaa' : ''}" 
            @click="!value.status ? null : clearSyncData(value.type)">
            初始化
          </a>
          <i-switch
            class="mt-3"
            size="small"
            :value="value.status"
            :disabled="!value.enabled"
            :before-change="()=> setSyncSetting(value.status, value.type)"
          />
        </div>
      </div>
    </div>

    <div v-show="status.isShowNotice" class="notice">{{status.noticeText}}功能小白正在进行维护，给您带来的不便小白深感歉意</div>

    <Modal
      v-model="status.modal"
      class="modal sync"
      :styles="{'width':'360px'}"
      :closable="false"
      :mask-closable="false"
      :footer-hide="true"
    >
      <div slot="header" class="modal-header">
        <button title="关闭" class="close" @click="handleModal(false)">
          <i class="icon iconfont iconClose-box-px" />
        </button>
      </div>
      <div class="content">
        <div class="content-left flex-center">
          <i class="icon iconfont iconPrompt-px2" />
        </div>
        <div class="content-right">
          确定要初始化该数据吗？<!-- 本操作
          不会删除登录前的本地数据！ -->
        </div>
      </div>
      <div class="footer flex-center">
        <button
          class="btn-primary"
          :disabled="status.disableConfirm"
          @click="confirm()"
        >确定{{status.second}}</button>
        <button class="btn-cancel ml-6" @click="handleModal(false)">取消</button>
      </div>
    </Modal>
    <Modal
      v-model="status.modal1"
      class="modal sync"
      :styles="{'width':'360px'}"
      :closable="false"
      :mask-closable="false"
      :footer-hide="true"
    >
      <div slot="header" class="modal-header">
        <button title="关闭" class="close" @click="status.modal1 = false;">
          <i class="icon iconfont iconClose-box-px" />
        </button>
      </div>
      <div class="content">
        <div class="content-left flex-center">
          <i class="icon iconfont iconPrompt-px2" />
        </div>
        <div class="content-right" style="white-space:unset;font-size:12px;">
          <p style="line-height: 16px;">升级至最新版方可初始化，请运行</p>
          <p>“菜单” 》 “帮助” 》 “在线升级”</p>
        </div>
      </div>
      <div class="footer flex-center">
        <button
          class="btn-primary"
          @click="status.modal1 = false;"
        >知道了</button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import _ from "lodash";

export default {
  name: "SyncSettings",
  data() {
    return {
      status: {
        modal1: false,
        modal: false,
        disableConfirm: true,
        timeout: null,
        interval: null,
        second: "(5)",
        isShowNotice: false,
        noticeText: ""
      },
      mainSwitch: {
        type: -1,
        label: "同步数据开关",
        status: false,
        enabled: true
      },
      switchList: [
        { type: 0, label: "我的书签", icon: "iconAccount" },
        { type: 5, label: "账号密码", icon: "iconpassword" },
        { type: 6, label: "我的设置", icon: "iconSet" },
        { type: 3, label: "我的皮肤", icon: "iconclothes" },
        { type: 4, label: "我的扩展", icon: "iconplugin" },
        { type: 2, label: "历史记录", icon: "iconhistory" },
        { type: 1, label: "下载记录", icon: "icondownload" },
        { type: 7, label: "新标签页", icon: "iconlabel" }
      ],
      userInfo: {
        icon_url: "",
        user_id: "",
        user_name: "",
        user_token: ""
      },
      clearType: "",
      noLowVInNB: true,
      notifyUpgrade: false,
    };
  },
  created() {
    // 获取switch开关初始数据
    this.getSwitchData();
    // this.getUserInfo();
    this.xbProduct_Version();
  },
  watch: {
    $route: {
      handler: function(val, oldVal) {
        // console.log(val);
        if (val.name === "edit") {
          this.getSwitchData();
        }
      },
      // 深度观察监听
      deep: true
    }
  },
  methods: {
    ...mapActions("main", ["handleLoginout"]),
    xbProduct_Version(){
      switch(navigator.xbProduct){
        case '0':
          this.notifyUpgrade = !this.checkBrowserVersion([10,2,2802,1479]);
          break;
        case '1':
          this.noLowVInNB = this.checkBrowserVersion([10,2,2821,1486]);
          break;
      }
    },
    // 获取switch开关初始数据
    // getUserInfo() {
    //   chrome.xb.getUserInfo((res)=>{
    //     this.userInfo = res;
    //   })
    // },

    // 获取switch开关数据
    async getSwitchData() {
      const _switchStatus = await this.handleSwitchStatus();
      const _switchDisabled = await this.handleSwitchDisabled();
      // console.log('getAllSyncTypeSwitchState',_switchStatus);
      // console.log('getAllSyncTypeSwitchWndState',_switchDisabled);
      const r1 = this.mergeWithkey(_switchStatus, _switchDisabled, "type");
      const result = this.mergeWithkey(r1, this.switchList, "type");

      this.switchList = result;
      // console.log(JSON.parse(JSON.stringify(result)));

      // 操作notice
      const disabledArray = _.map(_switchDisabled, "enabled");
      if (disabledArray.includes(false)) {
        this.status.isShowNotice = true;
      } else {
        this.status.isShowNotice = false;
      }
      const newTextArrary = [];
      result.forEach(item => {
        if (item.enabled === false) {
          newTextArrary.push(item.label);
        }
      });
      let newText = newTextArrary.join("、");
      this.status.noticeText = newText;

      // 操作总开关
      const statusArray = _.map(_switchStatus, "status");
      if (statusArray.includes(true)) {
        // console.log("同步数据开关，开");
        this.mainSwitch.status = true;
      } else {
        // console.log("同步数据开关，关");
        this.mainSwitch.status = false;
      }
    },

    mergeWithkey(arr1, arr2, key) {
      // 从其中一个生成映射表，具体用哪个取决于你希望用哪一个作为基数据，
      // 那么就把另一个生成映射表，比如我希望用 b 作为基数据
      const pairs = arr1.map(t => [t[key], t]);
      const aMap = new Map(pairs);

      // 现在来遍历 b，生成对应的数据，这个 r 就是结果
      const r = arr2.map(t => ({ ...t, ...(aMap.get(t[key]) || {}) }));
      // 解释 aMap.get(t[key]) || {}：
      // 由于 aMap.get(...) 可能取到 undefined，所以用 {} 代替，
      // 以避免合并的时候出错
      return r;
    },

    // 获取当前所有同步项的开关状态
    async handleSwitchStatus() {
      const _switchStatus = await new Promise((resolve, reject) => {
        chrome.xb.getAllSyncTypeSwitchState(res => {
          // console.log("所有同步项的开关状态",res);
          resolve(res);
        });
      });

      return _switchStatus;
    },

    // 获取当前所有同步项的禁用状态
    async handleSwitchDisabled() {
      const _switchDisabled = await new Promise((resolve, reject) => {
        chrome.xb.getAllSyncTypeSwitchWndState(res => {
          // console.log("所有同步项的禁用状态",res);
          _(res).forEach((value, key) => {
            res[key].enabled = value.status;
            // res[key].enabled = false;
            delete res[key].status;
          });
          resolve(res);
        });
      });

      return _switchDisabled;
    },

    // 开关同步状态
    setSyncSetting(status, type) {
      const { status: mainStatus } = this.mainSwitch;
      // console.log(status,mainStatus);
      
      status = !status;
      const token = this.getToken();

      return new Promise((resolve, reject) => {
        if (type === -1 && mainStatus === false) {
          resolve();
        } else {
          chrome.xb.setSyncSwitchWithType(token, type, status, res => {
            if (res === true) {
              this.getSwitchData();
              resolve();
            } else {
              this.getSwitchData();
              // reject();
            }
          });
        }
      });
    },

    // 清空同步数据
    clearSyncData(type) {
      if(this.notifyUpgrade && type == 0){
        this.status.modal1 = true;
        return;
      }
      this.handleModal(true);
      this.clearType = type;
      this.status.disableConfirm = true;
      clearTimeout(this.status.timeout);
      this.status.timeout = setTimeout(() => {
        this.status.disableConfirm = false;
      }, 5000);
      this.countdown();
    },

    // 操作弹窗
    handleModal(status) {
      this.status.modal = status;
    },

    // 确定按钮倒数计时
    countdown() {
      this.status.second = `(5)`;
      let num = 5;
      clearInterval(this.status.interval);
      this.status.interval = setInterval(() => {
        if (num > 1) {
          num--;
          this.status.second = `(${num})`;
        } else {
          this.status.second = "";
        }
      }, 1000);
    },

    // 从cookie拿token
    getToken(status) {
      const cookie = document.cookie.split(";");
      let token = "";

      cookie.forEach(item => {
        if (item.replace(/\s*/g, "").indexOf("token=") === 0) {
          token = item.replace(/\s*/g, "").replace("token=", "");
        }
      });

      // 如果token为""，自动登出
      if (token === "") {
        this.handleLoginout().then(res => {
          this.$router.push("/");
        });
      }

      return token;
    },

    confirm() {
      // console.log("clearType" ,this.clearType);
      // this.$Modal.confirm({
      //   title: '确定要清空该数据吗？',
      //   content: '<p>本操作不会删除登录之前的本地数据</p>',
      //   onOk: () => {
      //     this.$Message.info('Clicked ok');
      //   },
      //   onCancel: () => {
      //     this.$Message.info('Clicked cancel');
      //   },
      //   footer: "123213"
      // });
      const token = this.getToken();

      this.handleModal(false);

      chrome.xb.clearSyncDataWithType(token, this.clearType, status => {
        if (status === true) {
          chrome.settingsPrivate.setPref(
            "browser.new_tab_clear_signal",
            true,
            "",
            res => {
              // console.log("个人中心清空成功！");
            }
          );
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "./style.less";
</style>
