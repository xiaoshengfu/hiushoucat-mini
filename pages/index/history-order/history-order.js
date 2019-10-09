// pages/index/completed-order/completed-order.js
//获取应用实例
var app = getApp();
var util = require('../../../utils/util.js');
Page({
  /** 
   * 初始化页面数据 
   */
  data: {
    
    id:2,  //历史订单传入判断参数
    search: 1, 
    orderListArr: [],  //信息列表
    items: ['已完成', '已失效'],
    activeTab: 0,   //默认选中的tabls模块
    site: {
      windowWidth: 0,  //窗口宽度
      itemWidth: 0,   // 每一项宽度
    },
  },  
  /**
   * call
   */
  call: function (event) {
    var tel = event.currentTarget.dataset.tel;
    wx.makePhoneCall({
      phoneNumber: 'tel',
    })
  },
  /**
   * 初始化页面参数
   */
  setSite:function()
  {
    var res = wx.getSystemInfoSync();
    this.data.site.windowWidth = res.windowWidth;  //设置页面宽度
    this.data.site.itemWidth = this.data.site.windowWidth / this.data.items.length; //设置页面每个item的宽度 
    this.setData
    ({ 
      site: this.data.site 
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //初试化界面参数
    this.setSite();
    //没登录跳转登录页面
    if (!util.isLogin()) {
      wx.navigateTo({
        url: '../../mine/login/login',
      })
    }
    //获取消息列表
    this.getHistoryOrderList(this.data.activeTab);
  },
  /*获取active页面*/
  changeTabTap: function (event) {
    console.log(event.currentTarget.dataset.index)
    var activeTab = event.currentTarget.dataset.index;
    this.setData({ activeTab: activeTab })
    this.getHistoryOrderList(activeTab);
  },
  /**
   * 获取订单列表
   */
  getHistoryOrderList: function (activeTab) {
    this.setData({
      orderListArr: [],
      newsList: []
    })
    var that = this;
    var state = 4;
    if (activeTab == 1) {
      state = 3
    }
    if (wx.getStorageSync('token') != '') {
      util.httpUtil(app.getPort.api1 + "/miniprogram/recycler_order/list/" + wx.getStorageSync('token'), "GET", {
        state: state
      },
        function (data) {
          console.log(state)
          for (var index in data.data) {
            var reserveTime = util.renderTime(data.data[index].reserveTime); //预约时间
            var list = [data.data[index], { "reserveTime": reserveTime }]
            that.data.orderListArr.push(list);
          }
          that.setData({
            newsList: that.data.orderListArr
          })
          console.log(that.data.newsList)
          if (that.data.newsList.length < 1) {
            that.setData({
              search: 0
            })
          }
          else {  //网络中断后存在token，刷新
            that.setData({
              search: 1
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