<template>
  <div class="sync-settings">
    <div class="title">
      <!-- 账户书签同步功能小白正在进行维护，将会在XX月XX日恢复正常使用，给您带来的不便小白深感歉意 -->
      <div class="cell">
        <div class="title">
          <span class="iconfont iconnickname_" />同步数据开关
        </div>
        <div class="content">
          <div @click="()=>onSwitchClick(mainSwitch.status, mainSwitch.type)">
            <i-switch
              :value="mainSwitch.status"
              :disabled="!mainSwitch.enabled"
              :before-change="preventSwitch"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="content">
      <div v-for="(value, key) in switchList" :key="key" class="cell">
        <div class="title">
          <span class="iconfont iconnickname_" />{{value.label}}
        </div>
        <div class="content">
          <div @click="()=>onSwitchClick(value.status, value.type)">
            <i-switch
              :value="value.status"
              :disabled="!value.enabled"
              :before-change="preventSwitch"
            />
          </div>
          <!-- <i-switch
            :value="value.status"
            :disabled="!value.enabled"
            :true-value="true"
            :false-value="false"
            :before-change="()=>setSyncSetting(value.status, value.type)"
          /> -->
          <button v-if="value.type!=-1" class="btn-primary btn-clear" type="button" @click="clearSyncData(value.type)">清空</button>
        </div>
      </div>
    </div>

    <Modal v-model="status.modal"
           class="modal sync"
           :styles="{'width':'400px'}"
           :closable="false"
           :mask-closable="false"
           :footer-hide="true">
      <div slot="header"
           class="ivu-modal-header-inner">
        <button title="关闭"
                class="close"
                @click="handleModal(false)">
          <i class="icon iconfont iconClose-box-px" />
        </button>
      </div>
      <div class="text">
        确定要清空该数据吗？本操作不会删除登录之前的本地数据
      </div>
      <div class="footer flex-center">
        <button class="btn-primary" :disabled="status.disableConfirm" @click="confirm()">确定{{status.second}}</button>
        <button class="btn-cancel btn-clear" @click="handleModal(false)">取消</button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import _ from "lodash";

export default {
  name: 'SyncSettings',
  data () {
    return {
      status: {
        modal: false,
        disableConfirm: true,
        timeout: null,
        interval: null,
        second: "(5s)"
      },
      mainSwitch: {type: -1, label: "同步数据开关", status: false, enabled: true},
      switchList: [
        {type: 0, label: "账户书签"},
        {type: 5, label: "账户密码"},
        {type: 6, label: "设置"},
        {type: 3, label: "皮肤"},
        {type: 4, label: "账户扩展"},
        {type: 2, label: "历史记录"},
        {type: 1, label: "下载记录"},
        {type: 7, label: "新标签页"},
      ],
      userInfo: {
        icon_url: "",
        user_id: "",
        user_name: "",
        user_token: ""
      },
      clearType:''
    }
  },
  computed: {
  },

  created () {
    // 获取switch开关初始数据
    this.getSwitchData();
    this.getUserInfo()
  },

  methods: {
    // 获取switch开关初始数据
    getUserInfo(){
      chrome.xb.getUserInfo((res)=>{
        this.userInfo = res;
      })
    },

    // 获取switch开关初始数据
    async getSwitchData(){
      const _switchStatus = await this.handleSwitchStatus();
      console.log(_switchStatus);
      const _switchDisabled = await this.handleSwitchDisabled();
      console.log(_switchDisabled);

      const r1 = this.mergeWithkey(_switchStatus, _switchDisabled, "type");
      const result = this.mergeWithkey(this.switchList, r1, "type");

      const statusArray = _.map(_switchStatus, "status");

      if(statusArray.includes(true)) {
        console.log("同步数据开关，开");
        this.mainSwitch.status = true;
      } else {
        console.log("同步数据开关，关");
        this.mainSwitch.status = false;
      }

      // if(statusArray.includes(true)) {
      //   console.log("同步数据开关，开");
      //   result.unshift({ type: -1, enabled: true, status: true, label: "同步数据开关"})
      // } else {
      //   console.log("同步数据开关，关");
      //   result.unshift({ type: -1, enabled: true, status: false, label: "同步数据开关"})
      // }

      // const switchList = JSON.parse(JSON.stringify(this.switchList))

      this.switchList = result;
      console.log(JSON.parse(JSON.stringify(this.switchList)));
    },

    mergeWithkey(arr1, arr2, key){
      // 从其中一个生成映射表，具体用哪个取决于你希望用哪一个作为基数据，
      // 那么就把另一个生成映射表，比如我希望用 b 作为基数据
      const pairs = arr1.map(t => [t[key], t]);
      const aMap = new Map(pairs);

      // 现在来遍历 b，生成对应的数据，这个 r 就是结果
      const r = arr2.map(t => ({...t, ...(aMap.get(t[key]) || {})}));
      // 解释 aMap.get(t[key]) || {}：
      // 由于 aMap.get(...) 可能取到 undefined，所以用 {} 代替，
      // 以避免合并的时候出错
      return r;
    },

    // 获取当前所有同步项的开关状态
    async handleSwitchStatus() {
      const _switchStatus = await new Promise((resolve,reject)=>{
        chrome.xb.getAllSyncTypeSwitchState((res)=>{
          resolve(res)
        });
      });

      return _switchStatus;
    },

    // 获取当前所有同步项的禁用状态
    async handleSwitchDisabled() {
      const _switchDisabled = await new Promise((resolve,reject)=>{
        chrome.xb.getAllSyncTypeSwitchWndState((res) => {
          _(res).forEach((value, key) => {
            res[key].enabled = value.status;
            delete res[key].status;
          });
          resolve(res)
        });
      });

      return _switchDisabled;
    },

    onSwitchClick (status, type) {
      this.setSyncSetting(status, type);
    },

    preventSwitch (status, type) {
      return new Promise((resolve,reject)=>{
        reject();
      })
    },

    // 开关同步状态
    setSyncSetting (status, type) {
      status = !status;
      console.log(status, type);
      // return new Promise((resolve,reject)=>{
      //   chrome.xb.setSyncSwitchWithType(this.userInfo.user_token, type, status, (res)=>{
      //     if(res[0]===true){
      //       this.getSwitchData();
      //       resolve()
      //     }else{
      //       reject()
      //     }
      //   });
      // });
      chrome.xb.setSyncSwitchWithType(this.userInfo.user_token, type, status, (res)=>{
        console.log(res);
        if(res === true){
          this.getSwitchData();
        }
      });
    },

    // 清空同步数据
    clearSyncData (type) {
      this.handleModal(true);
      this.clearType = type;
      this.status.disableConfirm = true;
      clearTimeout(this.status.timeout);
      this.status.timeout = setTimeout(() => {
        this.status.disableConfirm = false;
      }, 5000)
      this.countdown();
    },

    // 操作弹窗
    handleModal (status) {
      this.status.modal = status;
    },
    
    // 确定按钮倒数计时
    countdown () {
      this.status.second = `(5s)`
      let num = 5;
      clearInterval(this.status.interval)
      this.status.interval = setInterval(() => {
        if(num > 1) {
          num--
          this.status.second = `(${num}s)`
        }
        else {
          this.status.second = ""
        }
      }, 1000);
    },

    confirm () {
      console.log("clearType" ,this.clearType);
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
      this.handleModal(false)
      chrome.xb.clearSyncDataWithType(this.userInfo.user_token, this.clearType, (res)=>{
        console.log(res)
      })
    },
  }
}
</script>

<style lang="less" scoped>
@import "./style.less";
</style>
