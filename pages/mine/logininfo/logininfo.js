// pages/mine/logininfo/logininfo.js
var app = getApp();
var util = require('../../../utils/util.js');
Page({
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //没登录跳转登录页面
    if (!util.isLogin()) {
      wx.navigateTo({
        url: '../../mine/login/login',
      })
    }
    this.getMineData();
  },

  /**
   * 获取我的数据
   */
  getMineData: function () {
    var that = this;
    that.setData({
      userdata: wx.getStorageSync('user')
    })
  }
})