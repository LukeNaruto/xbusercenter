export const isXbBrowser = () => {
  if(navigator.xbVersion){
    return true;
  }
  var c = /XiaoBai\/?(.*)/,
      d = navigator.userAgent.match(c);
  return d != null;
}
export const isPhoneNum = num => {
  var reg = /^1[3-9]\d{9}$/,
    num = num + ''
  return reg.test(num)
}
export const isPhoneCode = num => {
  var reg = /^\d{6}$/,
    num = num + ''
  return reg.test(num)
}
export const isAccount = num => {
  var reg = /^(\d|[a-z]|[A-Z]){6,16}$/,
    num = num + ''
  return reg.test(num)
}
export const isPassWord = num => {
  var reg = /^(\d|[a-z]|[A-Z]){6,20}$/,
    num = num + ''
  return reg.test(num)
}
export const message_success = function(slot) {
  this.$Message.info({
    content: '<span class="icon iconfont iconSuccess-px1"></span>' + slot,
    duration: 2
  })
}
export const message_default = function(slot) {
  this.$Message.info({
    content: '<span class="icon iconfont iconPrompt-px2"></span>' + slot,
    duration: 2
  })
}
export const message_error = function(slot) {
  this.$Message.info({
    content: '<span class="icon iconfont iconfail-px1"></span>' + slot,
    duration: 2
  })
}
/**
 * @description 判断json的值是否为''和undefined，并筛选数据
 * @param {Object} json json对象
 */
export const deleteNullKeys = json => {
  let result = {}
  for (const key in json) {
    if (json[key] !== '' && json[key] !== undefined) result[key] = json[key]
  }
  return result
}

/**
 * @description 判断data的值是否为''、undefined、长度为0
 * @param {Object,Number,String} data
 */
export const isEmpty = data => {
  if (data === '' || data === undefined || data.length === 0) return true
  else return false
}
export const getLocationSearchKey = (key) => {
  let str = location.search.slice(1);
  if(str.length > 0){
    let entryArr_ = str.split('&');
    for(let i=0,len=entryArr_.length;len>i;i++){
      let arr = entryArr_[i].split('=');
      if(arr[0] === key){
        const value = arr[1];
        if(isNaN(+value)) return value;
        else return +value;
      }
    }
  }
  return '';
}

export function checkBrowserVersion(v_ = [10,1,0,0]){
  var userAgent = window.navigator.userAgent;
  if(!isXbBrowser()) return true;
  var version = navigator.xbVersion || userAgent.split('XiaoBai/')[1],
    versionArr = version.replace(/\(XBCEF\)/,'').split('.');
    for(var i=0,len = versionArr.length;len>i;i++){
      if(+versionArr[i] > v_[i]){
        return true;//浏览器版本比设定版本v_高
      }
    }
  return false;//浏览器版本比设定版本v_低或相同
}


export const handleJump_url = (url,cb) => {
  if(url){
    const mold = !url.indexOf('xbbrowser://');
    if(mold) chrome.xb.openUrl(url, 0, false);
    else location.replace(url);
  }else {
    cb && cb();
  }
};
