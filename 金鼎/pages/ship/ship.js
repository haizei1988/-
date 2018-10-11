// pages/ship/ship.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_id: '',
    price: '',
    translate_car_id: '',
    driver_person_id: '',
    header: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'Authorization': wx.getStorageSync('Authorization')
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    this.setData({
      order_id: e.id
    })
  },
  formSubmit(e) {
    if (!(/^[1-9]\d*$|[1-9]\d*\.[0-9]\d*|0\.[0-9]\d*$/g.test(e.detail.value.price))) {
      wx.showToast({
        title: '输入单价无效!',
        icon: 'none'
      })
      return;
    }
    if (app.trim(e.detail.value.translate_car_id) === '') {
      wx.showToast({
        title: '车辆信息不能为空!',
        icon: 'none'
      })
      return;
    }
    if (!(/^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/.test(e.detail.value.driver_person_id))) {
      wx.showToast({
        title: '输入运输人员不合法!',
        icon: 'none'
      })
      return;
    }
    var temp = e.detail.value;
    temp['order_id'] = this.data.order_id;
    app.getData(app.globalData.url + '/api/out_message', 'post', temp, '', this.data.header).then(res => {
      if(res.data.code === 200) {
        wx.showToast({
          title: '保存成功',
          icon: 'none'
        })
        wx.navigateTo({
          url: '../statusOrder/status'
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