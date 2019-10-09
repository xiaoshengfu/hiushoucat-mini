//app.js
App({
  onLaunch: function () {
    wx.removeStorageSync('seconds')  //移除读秒

    wx.setStorageSync("longitude", 116.98737);//经度
    wx.setStorageSync("latitude", 36.67789);//纬度
  },
  getPort: {
    api: "https://sso.wujiantao.cn",  //登录
    api1: "https://mini.wujiantao.cn", 
  }
})
