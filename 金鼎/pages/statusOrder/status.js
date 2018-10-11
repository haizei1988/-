// pages/statusOrder/status.js
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
      limit:9999
    },
    orderData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(22222)
    this.setData({
      hiddenLoading: false,
      header: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': wx.getStorageSync('Authorization')
      },
    })
    this.goodsNameNull()
  },
  // 分页
  loadPaageMore(e) {
    console.log(8899)
    if (Number(this.data.pageData.page) <= Number(this.data.total)) {
      e.currentTarget.dataset.pageName === 'goods' ? this.goodsNameNull('more') : this.goodsNameNull('more');
    } else {
      wx.showToast({
        title: '没有更多的数据',
        icon: 'none'
      })
    }
  },
  goodsNameNull(val = '') {
    var that = this;
    that.setData({
      pageData: {
        page: 1,
        limit: 9999
      },
    })
    app.getData(app.globalData.url + '/api/order', 'get', this.data.pageData, '', this.data.header).then(res => {
      if (res.data.code === 200) {
        this.setData({
          orderData: [...res.data.message.data],
          // orderData: !res.data.message.data.length ? [] : (!val ? [...res.data.message.data] : [...that.data.orderData, ...res.data.message.data]),
          hiddenLoading: true
        })
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
    console.log(222233332)
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
  
  }
})