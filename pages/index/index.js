//index.js
//获取应用实例
var app = getApp();
var util = require('../../utils/util.js');
Page({
  data:
  {
    hasRefesh: false
  },

  /**
   *  首次加载且直加载一次
   */
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true     //转发携带shareTicket
    })
    var that = this;
    that.getIndexData();
  },
  /**
  * 再次返回首页刷新数据
  */
  onShow:function()
  {
    this.getIndexData();
  }
  ,
  /**
  * 下拉刷新
  */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    this.getIndexData();
  },
  /**
   * 分享
   */
  onShareAppMessage: function (res) {
    if (res.from == 'menu') {
      // 来自页面内转发按钮
    }
    return {
      title: '分享回收猫给好友',
      path: '',
      success: function (res) {
        console
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  /**
   * 获取首页数据
   */
  getIndexData: function () {
    var that = this;
    if (wx.getStorageSync('user')) {
      util.httpUtil(app.getPort.api1 + "/miniprogram/recycler_achievement/find/" + wx.getStorageSync('token'), "GET", {},
        function (data) {
          if (data.stateCode == 200) {
            that.setData({
              data: data.data
            })
          } 
        }
      )
    }
  }
})