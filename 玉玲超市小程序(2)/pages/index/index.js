//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '/pages/logs/logs'
    })
  },
  onShow() {
    // 判断user是否过期，刷新令牌
    if (wx.getStorageSync('userInfo_shop')) {
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

  onLoad: function () {
    console.log("hahahahahaha")
    console.log(wx.getStorageSync('Authorization'))
    if (!wx.getStorageSync('Authorization')) {  
      console.log("xixiixiix")
      // wx.navigateTo({
      //   url: '/pages/login/login',
      // })
      wx.redirectTo({
        url: '/pages/login/login',
      })
      return;
    }
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
