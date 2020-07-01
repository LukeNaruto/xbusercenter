import { $api } from './axios'
import {
  isXbBrowser,
  isPhoneNum,
  isPhoneCode,
  isAccount,
  isPassWord,
  deleteNullKeys,
  message_success,
  message_default,
  message_error,
  getLocationSearchKey,
  checkBrowserVersion
} from '../libs/util'
const api_ = Vue => {
  if (api_.installed) return
  api_.installed = true
  Object.defineProperties(Vue.prototype, {
    $api: {
      get() {
        return $api
      }
    },
    // isXb: {
    //   get() {
    //     return isXbBrowser()
    //   }
    // },
    isPhoneNum: {
      get() {
        return isPhoneNum
      }
    },
    getLocationSearchKey: {
      get() {
        return getLocationSearchKey
      }
    },
    isPhoneCode: {
      get() {
        return isPhoneCode
      }
    },
    isAccount: {
      get() {
        return isAccount
      }
    },
    isPassWord: {
      get() {
        return isPassWord
      }
    },
    message_success:{
      get() {
        return message_success
      }
    },
    message_default:{
      get() {
        return message_default
      }
    },
    message_error:{
      get() {
        return message_error
      }
    },
    deleteNullKeys: {
      get() {
        return deleteNullKeys
      }
    },
    checkBrowserVersion: {
      get() {
        return checkBrowserVersion
      }
    }
  })
}
export default api_
