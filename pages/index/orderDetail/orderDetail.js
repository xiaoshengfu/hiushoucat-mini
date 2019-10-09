// pages/index/orderDetail/orderDetail.js
var app = getApp();
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    itemList: ['身体原因', '天气原因', '紧急事情', '其他原因'],// 取消原因
    latitude: wx.getStorageSync('latitude'),    //纬度 
    longitude: wx.getStorageSync('longitude'),  //经度
    priceList: [],  //废品真是价格数量表
    wasteOrderItems: [],  //废品订单小表
    wasteOrder: [], //提交的废品订单
    times: 0,  // 循环次数
    markers: [{
      id: 0,
      latitude: 36.677,
      longitude: 116.98,
      width: 30,
      height: 30,
      bgColor: '#d81e06',
      color: '#d81e06'
    },
    {
      id: 1,
      latitude: wx.getStorageSync('latitude'),
      longitude: wx.getStorageSync('longitude'),
      width: 30,
      height: 30
    }],
    polyline: [
      {
        points:
        [{
          latitude: 36.677,
          longitude: 116.98,
        }, {
          latitude: wx.getStorageSync('latitude'),
          longitude: wx.getStorageSync('longitude'),
        }],
        width: 2,
        borderWidth: 2,
        arrowLine: true,
        color: '#00ACFF',
      }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var activeTab=options.activeTab
    var wasteOrderId = options.wasteOrderId
    var id = options.id
    this.setData({
      wasteOrderId: wasteOrderId,
      id:id,
      activeTab: activeTab
      })
    this.getOrderDetail(wasteOrderId)
  },
  /**
  *获取实际单价 
 */
  getRealPice: function (event) { 
    var num = 1;
    var name = event.currentTarget.dataset.name;
    var orderItemId = event.currentTarget.dataset.orderitemid;
    var realPrice = event.detail.value
    for (let index in this.data.priceList) {    //遍历该废品是否在列表有记录
      if (this.data.priceList[index].orderItemId == orderItemId) {    //如果有记录
        var num = 2;
        var realNumber = this.data.priceList[index].realNumber  //将列表里的数据取出

        this.data.priceList.splice(index, 1)    //删除该条记录
        this.data.wasteOrderItems.splice(index, 1)    //删除该条记录

        this.data.priceList.push({ orderItemId:orderItemId,name: name, realNumber: realNumber, realPrice: realPrice });  //重新加入该数据
        this.data.wasteOrderItems.push({ orderItemId: orderItemId, realUnitPrice: realPrice * 100, realNum: realNumber })

      }
    }
    if (num == 1)      //如果没有记录
    {
      var realNumber = -1
      this.data.priceList.push({ orderItemId:orderItemId, name: name, realNumber: realNumber, realPrice: realPrice });
      this.data.wasteOrderItems.push({ orderItemId: orderItemId, realUnitPrice: realPrice * 100, realNum: realNumber })
    }
    this.totalMoney()
  },
  /**
  *获取实际个数 
 */
  getNum: function (event) {
    var num = 1;
    var name = event.currentTarget.dataset.name;
    var orderItemId = event.currentTarget.dataset.orderitemid;
    var realNumber = event.detail.value
    for (let index in this.data.priceList) {    //遍历该废品是否在列表有记录
      if (this.data.priceList[index].orderItemId == orderItemId) {    //如果有记录
        var num = 2;
        var realPrice = this.data.priceList[index].realPrice  //将列表里的数据取出

        this.data.priceList.splice(index, 1)    //删除该条记录
        this.data.wasteOrderItems.splice(index, 1)    //删除该条记录

        this.data.priceList.push({ orderItemId: orderItemId, name: name, realNumber: realNumber, realPrice: realPrice });  //重新加入该数据
        this.data.wasteOrderItems.push({ orderItemId: orderItemId, realUnitPrice: realPrice * 100, realNum: realNumber })
      }
    }
    if (num == 1)      //如果没有记录
    {
      var realPrice = -1
      this.data.priceList.push({ orderItemId: orderItemId, name: name, orderItemId: orderItemId, realNumber: realNumber, realPrice: realPrice });
      this.data.wasteOrderItems.push({ orderItemId: orderItemId, realUnitPrice: realPrice * 100, realNum: realNumber })
    }
    this.totalMoney();
  },
  /**
   *合计
  */
  totalMoney: function () {
    var totalMoney = 0;
    for (let index in this.data.priceList) {
      if (this.data.priceList[index].realNumber != -1 && this.data.priceList[index].realPrice != -1) {
        totalMoney = totalMoney + this.data.priceList[index].realNumber * this.data.priceList[index].realPrice
      }
    }
    this.setData({
      totalMoney: totalMoney.toFixed(2)
    })
  },
  /**
  *提交订单 
  */
  toSubmit: function () {
    var that = this;
    var id = 1;
    this.setData({        //每次提交将提示条件设置为空
      information: null
    })
    if (this.data.wasteOrderItems.length == 0) {
      util.promptUtil(that, "请填写完整数据", 2)
      return
    } else {
      for (let index in this.data.wasteOrderItems) {
        if (this.data.wasteOrderItems[index].realNum == -1 || this.data.wasteOrderItems[index].realUnitPrice == -1 || this.data.num != this.data.wasteOrderItems.length) {
          util.promptUtil(that, "请填写完整数据", 2)
          return
        }
      }
    }
    // var wasteOrder = { wasteOrderId: this.data.wasteOrderId, wasteOrderItems: this.data.wasteOrderItems };
    var wasteOrderId = this.data.wasteOrderId
    var wasteOrderItems = this.data.wasteOrderItems
    util.showModal("是否提交订单", "", "确定", "取消", "", function (data) {
      if (data.confirm) {
        util.httpUtil(app.getPort.api1 + "/miniprogram/recycler_order/edit_order_price/" + wx.getStorageSync('token'), "POST",
          {
            wasteOrderId: wasteOrderId,
            wasteOrderItems: wasteOrderItems
          },
          function (data) {
            util.promptUtil(that, "提交成功", 1)
            wx.redirectTo({
              url: '../index'
            })
          }
        )
      } else if (data.cancle) {
      }
    })

  },
  /**
   *获取订单信息 
  */
  getOrderDetail: function (wasteOrderId) {
    var that = this;
    util.httpUtil(app.getPort.api1 + "/miniprogram/recycler_order/find_order_details/" + wx.getStorageSync('token'), "GET",
      {
        wasteOrderId: wasteOrderId
      },
      function (data) {
        console.log(data.data)
        that.setData({
          List: data.data,
          reserveTime: util.renderTime(data.data.reserveTime),  //预约时间
          confirmTime:util.renderTime(data.data.confirmTime),   //派单时间
          estimatePrice: (data.data.estimatePrice / 100).toFixed(2),
          realUnitPrice: (data.data.realPrice/ 100).toFixed(2),
          num: data.data.wasteOrderItems.length
        })
        console.log(that.data.List)
      }
    )
  }
})