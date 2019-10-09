// pages/mine/login/login.js
//获取应用实例
var app = getApp();
var util = require('../../../utils/util.js');
import WxValidate from '../../../utils/vxValidate';
var inputContent = {}; //存储输入内容
Page({
  /**
   * 页面的初始数据
   */
  data: {
    activeTab: 0,
    verifycode: "", //验证码
    content: "获取验证码",
    disabled: true, //验证码按钮状态
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //删除用户信息
    wx.removeStorageSync("picUrl");
    wx.removeStorageSync("name");
    wx.removeStorageSync("user");
    wx.removeStorageSync("token");
  },
  onShow: function () {
    //如果seconds为0或者不存在可以获取验证码
    var seconds = wx.getStorageSync('seconds')
    if (seconds == 0 && seconds == '') {
      this.setData({
        content: "获取验证码",//验证码文字
        disabled: false,//验证码按钮状态
      })
    }
    else
    //若存在则调用函数
    {
      util.getVerifyCode(wx.getStorageSync('telephone'), this, function (data) {
        that.setData({
          verifycode: data.data
        })
      })
    }
    this.setData({
      tel: wx.getStorageSync("telephone")
    })
    if (this.data.tel) {
      util.useVerifyCode(this)
      inputContent['tel'] = this.data.tel;
    }
  },
  /**
   * 切换activeTab
   */
  changTab: function (event) {
    this.setData({ activeTab: event.target.dataset.activetab })
  },
  /**
   * 获取用户输入信息
   */
  bindInput: function (event) {
    inputContent[event.currentTarget.id] = event.detail.value;
    util.ChangeverifyCode(event, this);
  },
  /** 
   * 获取验证码 
   */
  getVerifyCode: function (event) {
    var that = this;
    util.getVerifyCode(inputContent['tel'], that, function (data) {
      that.setData({
        verifycode: data.data
      })
    })
  },
  /**
   * 登录提交
   */
  loginSubmit: function (event) {
    var that = this;
    //短信验证登录
    if (that.data.activeTab == 0) {
      that.WxValidate = new WxValidate({
        //验证电话信息必填 根据input name属性
        tel: {
          required:true,
          tel: true
        }, 
      },//提示信息
        {
          tel: {
            required: "手机号码不能为空",
          }
        })

    }
    //手机号密码登录
    else if (that.data.activeTab == 1) {
      that.WxValidate = new WxValidate({
        //验证电话信息必填 
        mine: {
          required:true,
          tel: true
        },
        //提示信息
        password: {
          required: true,
          minlength: 6,
          maxlength: 12
        },
      },
        {
          mine: {
            required: "手机号码不能为空",
          },
          password: {
            required: "请填写密码",
            minlength: "密码至少输入6个字母",
            maxlength: "密码不超过12个字母"
          }
        })
    }
    util.verifyUtil(event, that, function () {
      if (inputContent.verifycode==null) {
        util.promptUtil(that, "验证码不能为空",2)
        return;
      }
      //手机登录
      if (that.data.activeTab == 0) {
          util.httpUtil(app.getPort.api + "/sso/recycler_login/telephone", "POST", {
          telephone: inputContent.tel,
          verificationCode: inputContent.verifycode,
        },
          function (data) {
            if (data.stateCode == 200) {
              that.loginSucess(data);
            } else {
              util.promptUtil(that, data.message)
            }
          }
        )
      } else if (that.data.activeTab == 1) {
        //用户名密码登录
        util.httpUtil(app.getPort.api + "/sso/recycler_login/password", "POST", {
          mine: inputContent.mine,
          password: inputContent.password,
        },
          function (data) {
            if (data.stateCode == 200) {
              that.loginSucess(data);
            } else {
              util.promptUtil(that, data.message)
            }
          }
        )
      }
    });
  },
  /**
   * 登录成功后
   */
  loginSucess: function (data) {
    wx.setStorageSync("token", data.data)
    wx.removeStorageSync('seconds') //将读秒从内从中删除
    // 根据token获回收员姓名
    util.getUserInfo(function (data) {
      wx.reLaunch({
        url: '../../index/index'
      })
    })
  }
})

