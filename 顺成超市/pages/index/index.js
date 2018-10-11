//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: '',
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '/pages/logs/logs'
    })
  },
  onLoad: function () {
    // this.setData({
    //   userInfo: app.globalData.userType
    // })
    var role=wx.getStorageSync("role")
    if (role=="管理员"){
    this.setData({
      userInfo: "order"
    })
    }else{
      this.setData({
        userInfo: "ship"
      })
    }
    if (!wx.getStorageSync('Authorization')) {
      wx.redirectTo({
        url: '/pages/login/login',
      })
      return;
    }
  },
  onShow() {
    // 判断user是否过期，刷新令牌
    if (wx.getStorageSync('userInfo_jdps')) {
      // 设置过期区域未5min
      let promise_time = new Date().getTime() - 300000;
      let login_time = wx.getStorageSync('userInfo_shop').expires_out;
      if ((login_time - promise_time) < 300000) {
        wx.redirectTo({
          url: '/pages/login/login',
        })
        return;
      }
    }
  },
  camera: function () {
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        // wx.navigateTo({
        //   url: '../out/out?src=' + res.result, //
        //   success: function () {
        //   },       //成功后的回调；
        //   fail: function () { },         //失败后的回调；
        //   complete: function () { }      //结束后的回调(成功，失败都会执行)
        // })
        // console.log(res)
      }
    })
  },
})
