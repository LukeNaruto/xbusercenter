//页脚关联网址
export const footerLink = [{
  name: '官网',
  url: '//www.minibai.com/'
}, {
  name: 'MUX',
  url: '//mux.minibai.com/'
}, {
  name: '扩展',
  url: '//plug.minibai.com/'
}, {
  name: '更新日志',
  url: '//www.minibai.com/updatelogs'
}, {
  name: '诚聘英才',
  url: '//www.lagou.com/gongsi/j56340.html'
}, {
  name: '隐私政策',
  url: '//www.minibai.com/privacypolicy.html'
}, {
  name: '社区',
  url: '//bbs.minibai.com'
}];

/* setInterval(()=>{
  choiceType[Math.floor(Math.random()*5)].count++;
},500) */
//功能同步类型
export const choiceType = [{
    name: '我的书签',
    type: 'bookmarks',
    //icon: 'iconbookmark_',
    icon: 'iconshc_',
    // count: 98,
    color: '#47b2ff'
  }, {
    name: '历史记录',
    type: 'history',
    icon: 'iconhistory_',
    // count: 938,
    color: '#31d9ef'
  }, {
    name: '下载记录',
    type: 'downloads',
    icon: 'icondownloa_',
    // count: 0,
    color: '#74da30'
  }, {
    name: '我的扩展',
    type: 'extensions',
    icon: 'iconexpansion_1',
    url: 'https://plug.minibai.com/',
    // count: 982,
    color: '#ffb942'
  }, {
    name: '主题皮肤',
    type: 'skin',
    url: 'https://skin.minibai.com/',
    icon: 'icondress_1',
    // count: 981,
    color: '#ff8e9e'
  }, {
    name: '个性设置',
    type: 'settings',
    icon: 'iconsetting_',
    url: 'chrome://settings/',
    //count: 98,
    color: '#a6a5c9'
  }
  /* , {
    name: '地址栏',
    icon: 'iconaddresslab_',
    //count: 198,
    color: '#e492ff'
  } , {
    name: '新标签',
    icon: 'iconnewlabel_',
    //count: 8,
    color: '#b196ff'
  }*/
];
export const choiceType1 = [{
  name: '账号密码',
  icon: 'iconkey_',
  color: '#ff935d'
}, {
  name: '我的书签',
  icon: 'iconbookmark_',
  color: '#47b2ff'
}, {
  name: '历史记录',
  icon: 'iconhistory_',
  color: '#31d9ef'
}, {
  name: '下载记录',
  icon: 'icondownloa_',
  color: '#74da30'
}, {
  name: '我的扩展',
  icon: 'iconexpansion_',
  color: '#ffb942'
}, {
  name: '个性设置',
  icon: 'iconsetting_',
  color: '#a6a5c9'
}]
//对应等级所需的天数
export const lvRuleData = [0, 7, 30, 60, 100, 150, 200, 250, 300, 365];
