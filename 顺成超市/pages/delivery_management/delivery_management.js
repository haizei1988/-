// pages/order/order.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hiddenLoading: true,
    header: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'Authorization': wx.getStorageSync('Authorization')
    },
    pageData: {
      page: 1,
      limit: 9999
    },
    orderData: [],
    index:0,
    shuzu:"",
    selectbao:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  sure: function () {
    this.setData({
      selectbao: true,
    })},
  edit(e) {
    var index=e.currentTarget.dataset.index
    
    this.setData({
      selectbao: false,
      index:index
    })
    var shuzu=this.data.orderData[index].goods
    this.setData({
     shuzu:shuzu
    })
  },
  onLoad: function (options) {
    this.setData({
      hiddenLoading: false,
      header: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': wx.getStorageSync('Authorization')
      }
    })
      app.getData(app.globalData.url + '/api/delivery', 'get', this.data.pageData, '', this.data.header).then(res => {
        if (res.data.code === 200) {
          this.setData({
            orderData: res.data.message.data,
            hiddenLoading: true
          })
          // console.log(this.data.orderData)
        }
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  goto: function (e) {
    let str = JSON.stringify(e.currentTarget.dataset.item);
    wx.navigateTo({
      url: '/pages/delivery_order/delivery_order?items=' + str,
      success: function (res) {
        // success
      },
    })
  }
})