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
    lists: [{ goodsName: "", goodsId: "", num_unit: "", specification: "", trace_out_num: "", remark: "", weight: "", meterIn: true, meterOut: false, order_status:true}],
    unit: ["请选择单位", "箱", "瓶", "支", "袋", '千克'],
    unit_index: 0,
    goods_id: '',
    state: "",
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
  addList: function () {
    var lists = this.data.lists;
    var newData = { goodsName: "", goodsId: "", num_unit: "", specification: "", trace_out_num: "", remark:"", weight: "", meterIn: false, meterOut: true, order_status: true };
    lists.push(newData);//实质是添加lists数组内容，使for循环多一次
    this.setData({
      lists: lists,
    })
  },

  delList: function () {
    var lists = this.data.lists;
    lists.pop();      //实质是删除lists数组内容，使for循环少一次
    this.setData({
      lists: lists,
    })
  },
  inputs(e){
    var inputs1 = e.detail.value
    var selectedindex = e.currentTarget.dataset.index
    var types = e.currentTarget.dataset.type
    var types = 'lists[' + selectedindex + '].'+types;
    this.setData({
      [types]: inputs1
    })
    console.log(this.data.lists)
  },
  remark(e){
    var remark1 = e.detail.value
    var selectedindex = e.currentTarget.dataset.index
    var remark = 'lists[' + selectedindex + '].' + remark;
    this.setData({
      [remark]: remark1
    })
    console.log(this.data.lists)
  },
  onLoad: function (options) {
    let that = this;
    //设置时间
    var time = util.formatTime(new Date());
    wx.getSystemInfo({
      success: function (res) {
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
    var state = this.data.state
    var goodsName = 'lists[' + state + '].goodsName';
    var goodsId = 'lists[' + state + '].goodsId';
    var num_unit = 'lists[' + state + '].num_unit';
    var order_status = 'lists[' + state + '].order_status';
    this.setData({
      [goodsName]: event.currentTarget.dataset.id.goods_name,
      [goodsId]: event.currentTarget.dataset.id.id,
      [order_status]: true,
      [num_unit]: event.currentTarget.dataset.id.num_unit
    })
    console.log(this.data.lists)
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
    var selectedindex = e.currentTarget.dataset.index
    var order_status = 'lists[' + selectedindex + '].order_status';
    this.setData({
      [order_status]: false,
      hiddenLoading: false,
      goods_name: e.detail.value,
      state: selectedindex 
    })
    if (this.data.goods_name === '') {
      this.getGoodsAll();
    } else {
      this.getGoodsSingle(this.data.goods_name);
    }
  },
  formSubmit: function (e) {
    // meterOut 为false 类型为进场数量
    let val = e.detail.value;
    // if (getApp().trim(e.detail.value.goods_name) === '') {
    //   wx.showToast({
    //     title: '商品名称不能为空',
    //     icon: 'none'
    //   })
    //   return;
    // }
    // if (getApp().trim(e.detail.value.num_unit) === '') {
    //   wx.showToast({
    //     title: '单位不能为空',
    //     icon: 'none'
    //   })
    //   return;
    // }
    // if (getApp().trim(e.detail.value.num_unit) === '') {
    //   wx.showToast({
    //     title: '单位不能为空',
    //     icon: 'none'
    //   })
    //   return;
    // }
    // 进场数量 trace_in_num
    // if (!this.data.meterOut && getApp().trim(e.detail.value.trace_in_num) === '') {
    //   wx.showToast({
    //     title: '进场数量不能为空',
    //     icon: 'none'
    //   })
    //   return;
    // }
    // if (this.data.meterOut && getApp().trim(e.detail.value.weight) === '') {
    //   wx.showToast({
    //     title: '重量不能为空',
    //     icon: 'none'
    //   })
    //   return;
    // }
    // if (!this.data.meterOut) {
    //   val.weight = 0
    // }
    // if (this.data.meterOut) {
    //   val.trace_in_num = 0
    // }
    var arr = []
    var delivery_date = this.data.delivery_date
    for (var i = 0; i < this.data.lists.length; i++) {
       var that=this
      arr.push({ "goods_id": that.data.lists[i].goodsId, "num_unit": that.data.lists[i].num_unit, "specification": that.data.lists[i].specification, "weight": that.data.lists[i].specification, "trace_out_num": that.data.lists[i].trace_out_num, "remark": that.data.lists[i].remark})
    }
    var data={
      delivery_date: delivery_date,
      goods:arr
    }
    app.getData(app.globalData.url + '/api/order', 'post', data, '', this.data.header).then(res => {
      if (res.data.code == 200) {
        wx.showModal({
          title: '提示',
          content: '添加成功',
          showCancel: false
        })
      }
    })
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    // wx.navigateTo({
    //   url: '../index/index',
    // })
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      delivery_date: e.detail.value
    })
  },
  onSelect(event) {
    // 进场 in true out false 
    var selectedindex = event.currentTarget.dataset.index
    console.log(selectedindex)
    var meterIn = 'lists[' + selectedindex + '].meterIn';
    var meterOut = 'lists[' + selectedindex + '].meterOut';
    this.setData({
      [meterIn]: event.currentTarget.dataset.meter === 'in' ? true : false,
      [meterOut]: event.currentTarget.dataset.meter === 'in' ? false : true
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