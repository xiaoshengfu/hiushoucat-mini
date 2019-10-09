// pages/index/undone-order/undone-order.js
var app = getApp();
var util = require('../../../utils/util.js');
Page({

  /** 
   * 页面的初始数据
   */
  data: {
    activeTab:-1, //未完成订单传入判断参数 
    id:1,  //未完成订单传入参数
    itemList: ['临时有事', '天气原因', '交通不便', '其他原因'],
    index: 0,

  },

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
    //获取消息列表
    this.getOrderList(this.data.page);
  },
  /**
   * 页面下拉刷新事件的处理函数
   */
  onPullDownRefresh: function () {
    //获取消息列表
    this.getOrderList(this.data.page);
  },
  /**
   * call
   */
  call: function (event) {
    console.log(event.currentTarget.dataset.tel)
    var tel=event.currentTarget.dataset.tel;
    wx.makePhoneCall({
      phoneNumber: tel,
    })
  },
  /**
   * 取消订单
   */
  deleteTap: function (event) {
    var that = this;
    wx.showActionSheet({
      itemList: ['临时有事', '天气原因', '交通不便', '其他原因'],
      success: function (res) {
        var reason = that.data.itemList[res.tapIndex];
        util.showModal("因" + reason + "取消订单", "", "确定", "取消", "",function (data) {
          if (data.confirm) {
            console.log(data.confirm)
            util.httpUtil(app.getPort.api1 + "/miniprogram/recycler_order/cancel_order/" + wx.getStorageSync('token'), "GET", {
              wasteOrderId: event.currentTarget.dataset.wasteorderid,
              invalidReason: reason
            },
              function (data) {
                util.promptUtil(that, "取消成功", 1)
                that.getOrderList()
              }
            )
          }
        })
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  /**
   * 获取订单列表
   */
  getOrderList: function () {
    var that = this;
    that.setData({
      newsListArr: []
    })
    if (wx.getStorageSync('token') != '') {
      util.httpUtil(app.getPort.api1 + "/miniprogram/recycler_order/list/" + wx.getStorageSync('token'), "GET", {
        state: 2
      },
        function (data) {
          console.log(data.data)
          for (var index in data.data) {
            var reserveTime = util.renderTime(data.data[index].reserveTime); //预约时间
            var list = [data.data[index], { "reserveTime": reserveTime }]
            that.data.newsListArr.push(list);
          }
          that.setData({
            newsList: that.data.newsListArr
          })
          console.log(that.data.newsList)
          if (that.data.newsListArr.length > 0) {
            that.setData({
              search: 1
            }) 
          }
          else {
            that.setData({
              search: 0
            })
          }
        }
      )
    }
    else {
      this.setData({
        search: 0
      })
    }
  }
})