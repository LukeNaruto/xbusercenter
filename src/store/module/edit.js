import { $api } from "@/api/axios";

export default {
  namespaced: false,
  state: {
    function: "safe",
    userInfo: {
      account: "",
      accountset: 1,
      active_days: 1,
      address: "",
      areainfo: "",
      avatar: "",
      birthday: "",
      city: "",
      days: 1,
      district: "",
      emset: 0,
      grade: 1,
      homepage: "",
      is_change: 1,
      mbset: 1,
      mobile: "",
      nickname: "",
      pdset: 1,
      province: "",
      qqset: 1,
      realname: "",
      score: 0,
      sex: 0,
      sign: "",
      wechatset: 0
    }
  },
  getters: {
    getFunction(state) {
      return state.function;
    },
    getUserInfo(state) {
      return state.userInfo;
    }
  },
  mutations: {
    setFunction(state, data) {
      state.function = data;
    },
    setUserInfo(state, data) {
      state.userInfo = data;
    }
  },
  actions: {
    setFunction({ commit }, param) {
      commit("setFunction", param);
    },

    getApiUserInfo({ commit }) {
      return new Promise((resovle, reject) => {
        $api
          .getHome({ act: "baseinfo" })
          .then(res => {
            commit("setUserInfo", {
              ...res.data,
              sex: res.data.sex + "",
              area: [res.data.province, res.data.city, res.data.district],
              avatar: res.data.avatar || require("@s/img/head-pic.png")
            });

            if (chrome.xb && res.data.is_change) {
              chrome.xb.setUserStatus(
                2,
                `{"nk":"${res.data.nickname}","av":"${res.data.avatar}"}`
              );
            }
            resovle(res);
          })
          .catch(e => {
            reject(e);
          });
      });
    }
  }
};
