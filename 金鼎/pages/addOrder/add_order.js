// pages/addOrder/add_order.js
var app = getApp();
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    delivery_date: '',
    meterIn: true,
    hiddenLoading: true,
    meterOut: false,
    order_status: true,
    trace_in_num: '',
    weight: '',
    height: '',
    array_goods: [],
    goods_name: '',
    num_unit: '',
    unit: ["请选择单位", "箱", "瓶", "支", "袋", '千克'],
    unit_index: 0,
    goods_id: '',
    pageData: {
      page: 1,
      limit: 9999
    },
    header: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'Authorization': wx.getStorageSync('Authorization')
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    //设置时间
    var time = util.formatTime(new Date());
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          height: res.windowHeight - 50,
          delivery_date: time
        })
      },
    })
  },
  unit(e) {
    this.setData({
      unit_index: e.detail.value
    })
  },
  bingId(event) {
    this.setData({
      goods_name: event.currentTarget.dataset.id.goods_name,
      goods_id: event.currentTarget.dataset.id.id,
      order_status: true,
      num_unit: event.currentTarget.dataset.id.num_unit
    })

  },
  getGoodsAll() {
    let that = this;
    app.getData(app.globalData.url + '/api/goods', 'get', this.data.pageData, '', this.data.header).then(res => {
      if (res.data.code === 200) {
        that.setData({
          array_goods: [...res.data.message.data],
          hiddenLoading: true
        })
      } else {
        that.setData({
          hiddenLoading: true
        })
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: res.data.messgae,
        })
      }
    })
  },
  getGoodsSingle(val) {
    let that = this;
    app.getData(app.globalData.url + '/api/goods?goods_name=' + val, 'get', '', '', this.data.header).then(res => {
      if (res.data.code === 200) {
        that.setData({
          array_goods: !res.data.message.data.length ? [] : [...res.data.message.data],
          hiddenLoading: true
        })


      } else {
        that.setData({
          hiddenLoading: true
        })
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: res.data.messgae,
        })
      }
    })
  },
  // 获取焦点
  getOrderData(e) {
    let that = this;
    this.setData({
      order_status: false,
      hiddenLoading: false,
      goods_name: e.detail.value
    })
    if (this.data.goods_name === '') {
      this.getGoodsAll();
    } else {
      this.getGoodsSingle(this.data.goods_name);
    }
  },
  formSubmit: function(e) {
    // meterOut 为false 类型为进场数量
    let val = e.detail.value;
    if (getApp().trim(e.detail.value.goods_name) === '') {
      wx.showToast({
        title: '商品名称不能为空',
        icon: 'none'
      })
      return;
    }
    if (getApp().trim(e.detail.value.num_unit) === '') {
      wx.showToast({
        title: '单位不能为空',
        icon: 'none'
      })
      return;
    }
    if (getApp().trim(e.detail.value.num_unit) === '') {
      wx.showToast({
        title: '单位不能为空',
        icon: 'none'
      })
      return;
    }
    // 进场数量 trace_in_num
    if (!this.data.meterOut && getApp().trim(e.detail.value.trace_in_num) === '') {
      wx.showToast({
        title: '进场数量不能为空',
        icon: 'none'
      })
      return;
    }
    if (this.data.meterOut && getApp().trim(e.detail.value.weight) === '') {
      wx.showToast({
        title: '重量不能为空',
        icon: 'none'
      })
      return;
    }
    if (!this.data.meterOut) {
      val.weight = 0
    }
    if (this.data.meterOut) {
      val.trace_in_num = 0
    }
    app.getData(app.globalData.url + '/api/order', 'post', val, '', this.data.header).then(res => {
      if (res.data.code === 200) {
        wx.showToast({
          title: '保存成功',
          icon: 'none'
        })
      }
    })
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    // wx.navigateTo({
    //   url: '../index/index',
    // })
  },
  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      delivery_date: e.detail.value
    })
  },
  onSelect(event) {
    // 进场 in true out false 
    this.setData({
      meterIn: event.currentTarget.dataset.meter === 'in' ? true : false,
      meterOut: event.currentTarget.dataset.meter === 'in' ? false : true
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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