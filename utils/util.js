var app = getApp();
/**
 * http请求
 */
function httpUtil(url, method, data, callBack) {
  wx.showNavigationBarLoading();
  wx.request({
    url: url,
    method: method,
    data: data,
    header: { "Content-Type": "application/json" },
    success: function (res) {
      isTokenFail(this, res.data)
      callBack(res.data);
      console.log(res.data)
    },
    fail: function (error) {
      showToast("请求失败");
    },
    complete: function (res) {
      wx.stopPullDownRefresh();
      wx.hideNavigationBarLoading();
    }
  })
}

/**
 * 1 蓝色 2 红色
 */
function promptUtil(that, information, type) {
  that.setData(
    {
      information: information,
      type: type == 1 ? "success" : "fail"
    }
  );
}
/**
 *  提示
 */
function showToast(title, icon, duration) {
  wx.showToast({
    title: title || "",
    icon: icon || 'success',
    duration: duration || 2000
  })
}
/**
 * ​Modal 宽口 
 */
function showModal(title, content, confirmText, cancelText, showCancel, callback) {
  var that = this;
  wx.showModal({
    title: title,
    content: content,
    confirmText: confirmText || "确定",
    cancelText: cancelText || "取消",
    showCancel: showCancel || true,
    confirmColor: "#00ACFF",
    cancelColor: "#000000",
    success: function (res) {
      callback.call(that, res)
    }
  })
}
/**
 * 是否登录
 */
function isLogin() {
  if (wx.getStorageSync("token")) {
    return true;
  }
  return false;
}

/**
 * 登录提示
 */
function isLoginModal() {
  if (!wx.getStorageSync("token")) {
    wx.navigateTo({
      url: '/pages/mine/login/login'
    })
  }
}

/**
 * token失效
 */
function isTokenFail(that, message) {
  if (message=="身份认证失败，请重新登录！") {
    console.log(message)
    promptUtil(that, message, 2);
    wx.removeStorageSync("token");
    wx.removeStorageSync("user");
    wx.removeStorageSync("name");
  }
}

/**
 * 验证表单
 */
function verifyUtil(event, that, callback) {
  promptUtil(that, "")
  var verify = event.detail.value
  if (!that.WxValidate.checkForm(event)) {
    //传入调用检验方法
    var errorMsg = that.WxValidate.errorList
    promptUtil(that, errorMsg[0].msg)
  }
  else {
    callback.call(this)
  }
}
/**
 * 验证码按钮可用
 */
function useVerifyCode(that) {
  that.setData({
    disabled: false
  })
}
/**
 * 改变验证码按钮状态
 */
function ChangeverifyCode(event, that) {
  if (event.currentTarget.id == 'tel' && (/^1(3|4|5|7|8)\d{9}$/.test(event.detail.value))) {
    // $/.test(s)是判断传给s这个变量的字符是否以xxx结尾的                               
    //判断event.detail.value 是否以1开始 后接除了2，6之外的数 后加9个任意数字
    that.setData({
      disabled: false
    })
  } else if (event.currentTarget.id == 'tel' && !(/^1(3|4|5|7|8)\d{9}$/.test(event.detail.value))) {
    that.setData({
      disabled: true
    })
  }
}

/**
 * 获取验证码
 */
function getVerifyCode(tel, that, callback) {
  var seconds = wx.getStorageSync('seconds');
  if (seconds == 0 || seconds == '') {
    seconds = 120
  }
  this.httpUtil(app.getPort.api + "/sso/recycler_login/send_sms", "GET", { telephone: tel }, function (data) { })
  var timeFunction = setInterval(function () {
    if (seconds <= 0) {
      clearInterval(timeFunction);
      that.setData({
        content: "重发验证码",
        disabled: false
      })
    } else {
      that.setData({
        content: seconds + "秒后重试",
        disabled: true
      })
      seconds--;
    }
    wx.setStorageSync('seconds', seconds)
  }, 1000, seconds);
}
/**
 * 获取账号基本信息
 */
function getUserInfo(callback) {
  this.httpUtil(app.getPort.api1 + "/miniprogram/recycler/find/" + wx.getStorageSync("token"), "GET", {},
    function (data) {
      if (data.stateCode == 200) {
        wx.setStorageSync("user", data.data)
        wx.setStorageSync("name", data.data.name)
        wx.setStorageSync('telephone', data.data.telephone)  //缓存本地，登录自动填入
        callback.call(this, data)
      }
    }
  )
}


/**
 * 转换日期格式(时间戳转换为datetime格式)
 */

function renderTime(cellval) {
  var dateVal = cellval + "";
  if (cellval != null) {
    var date = new Date(parseInt(dateVal.replace("/Date(", "").replace(")/", ""), 10));
    var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();

    var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

    return date.getFullYear() + "-" + month + "-" + currentDate + " " + hours + ":" + minutes + ":" + seconds;
  }
}
module.exports = {
  httpUtil: httpUtil,
  promptUtil: promptUtil,
  showToast: showToast,
  showModal: showModal,
  isLogin: isLogin,
  isLoginModal: isLoginModal,
  isTokenFail: isTokenFail,
  verifyUtil: verifyUtil,
  useVerifyCode: useVerifyCode,
  ChangeverifyCode: ChangeverifyCode,
  getVerifyCode: getVerifyCode,
  getUserInfo: getUserInfo,
  renderTime: renderTime,
}
