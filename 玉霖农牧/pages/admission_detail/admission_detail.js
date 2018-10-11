// pages/admission_detail/admission_detail.js

var util = require('../../utils/util.js')
var app = getApp()
Page({
  data: {
    danwei: [],
    specification: [],
    index_speci: 0,
    index_speci2: 0,
    pageData: {
      page: 1,
      limit: 30
    },
    total: '',
    array_goods: [],
    array_goods_name: ["q", "s"],
    date: "",
    result: [{
      num: 1,
      name: "合格"
    }, {
      num: 0,
      name: "不合格"
    }],
    result_name: ["数量", "重量"],
    result2: [{
      num: 1,
      name: "合格"
    }, {
      num: 0,
      name: "不合格"
    }],
    result_name2: ["合格", "不合格"],
    index: 0,
    index1: 0,
    index2: 0,
    index3: 0,
    index4: 0,
    index5: 0,
    index6: 0,
    index7: 0,
    array_goods_status: true,
    feeder_name: true,
    goodsName: "",
    supplier_name: true,
    init: false,
    height: '',
    hiddenLoading: true,
    leixing: "采购数量"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight - 30
        })
      },
    })
    //设置时间
    var time = util.formatTime(new Date());
    console.log(time)
    that.setData({
      date: time,
      date2: time
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  // 分页
  loadPaageMore(e) {
    if (Number(this.data.pageData.page) <= Number(this.data.total)) {
      e.currentTarget.dataset.pageName === 'goods' ? this.goodsNameNull('more') : this.supplierNull('more');
    } else {
      wx.showToast({
        title: '没有更多的数据',
        icon: 'none'
      })
    }
  },
  goodsNameValue() {
    var that = this;
    that.setData({
      init: false,
      pageData: {
        page: 1,
        limit: 30
      }
    })
    wx.request({
      url: getApp().globalData.url + '/api/inputs_basic' + '?inputs_name=' + that.data.goodsName,
      method: 'GET',
      header: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': wx.getStorageSync('Authorization')
      },
      success: res => {
        if (res.data.code == 200) {
          that.setData({
            array_goods: !res.data.message.data.length ? [] : [...res.data.message.data],
            hiddenLoading: true,
            init: true
          })
        } else if (res.data.code == 401) {
          that.setData({
            hiddenLoading: true,
            init: true
          })
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: res.data.message,
          })
        }
      }
    })
  },
  goodsNameNull(val = '') {
    var that = this;
    var temp = {};
    that.setData({
      hiddenLoading: false,
      init: false
    })
    wx.request({
      url: getApp().globalData.url + '/api/inputs_basic',
      method: 'GET',
      data: !val ? that.data.pageData : Object.assign(that.data.pageData, { page: parseInt(that.data.pageData.page) + 1 }),
      header: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': wx.getStorageSync('Authorization')
      },
      success: res => {
        if (res.data.code == 200) {
          that.setData({
            array_goods: !res.data.message.data.length ? [] : (!val ? [...res.data.message.data] : [...that.data.array_goods, ...res.data.message.data]),
            hiddenLoading: true,
            init: true,
            total: res.data.message.total
          })
        } else if (res.data.code == 401) {
          wx.showModal({
            title: '提示',
            showCancel: false,
            hiddenLoading: true,
            init: true,
            content: res.data.message,
          })
        }
      }
    })
  },
  // 赋值投料品品种id
  bingId(event) {
    var temp = [];
    var temp2 = [];
    for (var i of event.currentTarget.dataset.id.specification) {
      temp.push(i);
    }
    for (var i of event.currentTarget.dataset.id.unit) {
      temp2.push(i);
    }
    this.setData({
      goodsId: event.currentTarget.dataset.id.id,
      goodsName: event.currentTarget.dataset.id.inputs_name,
      array_goods_status: true,
      hiddenLoading: true,
      specification: [...temp],
      danwei: [...temp2]
    })
  },
  //选择种子
  Varieties_feeding: function () {
    var that = this;
    that.setData({
      hiddenLoading: !this.data.hiddenLoading,
      init: false,
      pageData: {
        page: 1,
        limit: 30
      },
      total: ''
    })
    if (that.data.goodsName != "") {
      this.goodsNameValue();
    } else {
      //投料品种
      this.goodsNameNull();
    }
    that.setData({
      array_goods_status: false,
      feeder_name: true,
      supplier_name: true,
    })

  },
  //选择商品
  picker_goods: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  //选择进场时间
  bindDateChange2: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  //选择采购日期
  bindDateChange3: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date2: e.detail.value
    })
  },

  bindTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },
  //检疫结果
  result: function (e) {
    this.setData({
      index4: e.detail.value
    })
    if (this.data.index4 == 0) {
      this.setData({
        leixing: "采购数量"
      })
    } else {
      this.setData({
        leixing: "采购重量"
      })
    }
  },
  result2: function (e) {
    this.setData({
      index3: e.detail.value
    })

  },
  danwei: function (e) {
    this.setData({
      index_speci2: e.detail.value
    })
  },
  specification: function (e) {
    this.setData({
      index_speci: e.detail.value
    })
  },
  //模糊查询
  bindKeyInput(e) {
    var that = this
    that.setData({
      hiddenLoading: false,
      init: false
    })
    if (e.detail.value !== '') {
      wx.request({
        url: getApp().globalData.url + '/api/inputs_basic' + '?inputs_name=' + e.detail.value,
        method: 'GET',
        header: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'Authorization': wx.getStorageSync('Authorization')
        },
        success: res => {
          if (res.data.code == 200) {
            that.setData({
              array_goods: !res.data.message.data.length ? [] : [...res.data.message.data],
              hiddenLoading: true,
              init: true
            })
          } else if (res.data.code == 401) {
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: res.data.message,
              hiddenLoading: true
            })
          }
        }
      })
    } else {
      this.goodsNameNull();
    }
  },
  hidden: function () {
    console.log("jinru")
    this.setData({
      array_goods_status: true,
      feeder_name: true,
      supplier_name: true,
    })
  },
  //发送信息
  formSubmit: function (e) {
    var that = this
    var inputs_basic_id = that.data.goodsId;
    var quality_standard = e.detail.value.qualification_number
    var production_batch_number = e.detail.value.production_batch_number
    var buy_time = that.data.date
    var buy_amount = e.detail.value.buy_amount;
    var buy_weight = e.detail.value.buy_weight
    var manufacture_date = that.data.date2
    var sales_order_number = e.detail.value.sales_order_number
    var inspection_result = that.data.result2[that.data.index3].num


    var specification = that.data.specification[that.data.index_speci] //规格
    var danwei = that.data.danwei[that.data.index_speci2]

    wx.request({
      url: getApp().globalData.url + '/api/inputs',
      method: 'POST',
      data: {
        inputs_basic_id: inputs_basic_id,
        quality_standard: quality_standard,
        production_batch_number: production_batch_number,
        manufacture_date: manufacture_date,
        buy_time: buy_time,
        buy_amount: buy_amount,
        buy_weight: buy_weight,
        sales_order_number: sales_order_number,
        inspection_result: inspection_result,
        specification: specification, //规格
        unit: danwei,
      },
      header: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': wx.getStorageSync('Authorization')
      },
      success: res => {
        console.log(res)
        if (res.data.code == 200) {
          wx.showModal({
            title: '提示',
            content: '添加成功',
            showCancel: false
          })
        } else if (res.data.code == 422) {
          wx.showModal({
            title: '提示',
            content: '请检查输入完整信息',
            showCancel: false
          })
        }
      }
    })
  }
})