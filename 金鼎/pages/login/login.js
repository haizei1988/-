// pages/login/login.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingHidden: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    wx.setNavigationBarTitle({
      title: '溯源追溯',
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#37363B',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  formSubmit: function(e) {
    let self = this;
    if (getApp().trim(e.detail.value.phone) === '' || getApp().trim(e.detail.value.password) === '') {
      wx.showToast({
        title: '请输入账号或密码！',
        icon: 'none'
      })
      return;
    } else {
      this.setData({
        loadingHidden: false
      })
      app.getData(getApp().globalData.url + '/api/login', 'post', e.detail.value, '').then(res => {
        let token = res.data.message.token_type + ' ' + res.data.message.access_token;
        var expires_out = new Date().getTime() + res.data.message.expires_in; 
        var temp = Object.assign({}, res.data.message, { expires_out: expires_out });
        wx.setStorageSync('Authorization', token);
        wx.setStorageSync('userInfo_jdps', temp);
        wx.setStorageSync('user_id', res.data.message.user_id);
        wx.setStorage({
          key: 'userInfo',
          data: res.data.message,
        })
        wx.redirectTo({
          url: '/pages/index/index',
        })
      }).catch(error => {
        this.setData({
          loadingHidden: true
        })
      })
    }

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})