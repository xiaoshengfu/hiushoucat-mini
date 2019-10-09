// pages/mine/mine.js
var app = getApp();
var util = require('../../utils/util.js');
Page({
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMineData();
  },
  onShow: function () {
    this.getMineData();
  },
  /**
   * call
   */
  call: function () {
    wx.makePhoneCall({
      phoneNumber: '17854168836',
      success: function () {
        console.log('拨打成功')
      }
    })
  },
  /**
   * 用户点分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '回收猫分享',
      path: '/pages/index/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
  ,
  /**
   * 跳转登录界面
   */
  login: function () {
    wx.navigateTo({
      url: 'login/login',
    })
  },
  /**
  * 获取我的数据
  */
  getMineData: function () {
    if (wx.getStorageSync('user'))
    {
      var user = wx.getStorageSync('user');
      this.setData({
        name: wx.getStorageSync('name'),
        pictureUrl: user.pictureUrl
      }) 
    }
  }
})