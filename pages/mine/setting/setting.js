// pages/mine/setting/setting.js
Page({
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    this.setData({name:options.name})
  },
  /**
   *  退出清除数据
   */
  quit:function()
  {
    this.setData({ name: '' })
  }
})