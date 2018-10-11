// pages/admission_detail/admission_detail.js

var util = require('../../utils/util.js')
var app = getApp()
Page({
  data: {
    pageData: {
      page: 1,
      limit: 30
    },
    total: '',
    hidden: false,
    xuanze: true,
    jinchang_num: false,
    zhongliang: true,
    array_goods: [],
    supplier: [],
    init: false,
    date: "",
    time: "1",
    zongjia: 0,
    zhong_zong: 0,
    trace_in_num: 0,
    weight: 0,
    price: 0,
    price1: 0,
    result: [{
      num: 0,
      name: "不合格"
    }, {
      num: 1,
      name: "合格"
    }],
    specification: [],
    index_speci: 0,
    index_speci2: 0,
    result_name: ["不合格", "合格"],
    style: ["请输入类型", "上源追溯", "交易凭证号", "动物检疫合格证明", "肉品品质检验合格证号", "蔬果产地证明号", "蔬果检测合格证号", "自生产批次号"],
    danwei: [],
    index: 0,
    index1: 0,
    index2: 0,
    index3: 0,
    index4: 1,
    index5: 0,
    index6: 0,
    array_goods_status: true,
    feeder_name: true,
    supplier_name: true,
    goodsName: "",
    goodsId: "",
    goodsId2: "",
    supplierName: '',
    supplierId: '',
    hiddenLoading: true,
    height: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    //设置时间
    var time = util.formatTime(new Date());
    console.log(time)
    that.setData({
      date: time
    });
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight - 30
        })
      },
    })
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
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.dd()
  },
  hidden() {
    var that = this
    that.setData({
      array_goods_status: true,
      feeder_name: true,
      supplier_name: true,
    })
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
      url: getApp().globalData.url + '/api/goods' + '?goods_name=' + that.data.goodsName,
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
      url: getApp().globalData.url + '/api/goods',
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
  //选择投料品种
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
  supplierValue() {
    let that = this;
    wx.request({
      url: getApp().globalData.url + '/api/wholesaler' + '?supplier_name=' + that.data.supplierName,
      method: 'GET',
      header: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': wx.getStorageSync('Authorization')
      },
      success: res => {
        console.log(res)
        if (res.data.code == 200) {
          that.setData({
            supplier: !res.data.message.data.length ? [] : [...res.data.message.data],
            hiddenLoading: !this.data.hiddenLoading,
            init: true
          })
        } else if (res.data.code == 401) {
          wx.showModal({
            title: '提示',
            showCancel: false,
            hiddenLoading: !this.data.hiddenLoading,
            content: res.data.message,
          })
        }
      }
    })
  },
  supplierNull(val = '') {
    let that = this;
    wx.request({
      url: getApp().globalData.url + '/api/wholesaler',
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
            supplier: !res.data.message.data.length ? [] : (!val ? [...res.data.message.data] : [...that.data.supplier, ...res.data.message.data]),
            hiddenLoading: !this.data.hiddenLoading,
            init: true,
            total: res.data.message.total
          })
          console.log(that.data.supplier)
        } else if (res.data.code == 401) {
          wx.showModal({
            title: '提示',
            showCancel: false,
            hiddenLoading: !this.data.hiddenLoading,
            content: res.data.message,
          })
        }
      }
    })
  },
  //选择供货商
  supplier_name() {
    var that = this
    that.setData({
      hiddenLoading: !this.data.hiddenLoading,
      init: false,
      pageData: {
        page: 1,
        limit: 30
      },
      total: ''
    })
    if (that.data.supplierName != "") {
      that.supplierValue();
    } else {
      that.supplierNull();
    }
    that.setData({
      array_goods_status: true,
      feeder_name: true,
      supplier_name: false,
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
        url: getApp().globalData.url + '/api/goods' + '?goods_name=' + e.detail.value,
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
  //供货商
  bindKeyInput3(e) {
    var that = this;
    that.setData({
      hiddenLoading: false,
      init: false
    })
    if (e.detail.value !== '') {
      that.supplierValue();
    } else {
      that.supplierNull();
    }

  },
  // 赋值投料品品种id
  bingId(event) {
    var temp = [];
    var temp2 = [];
    for (var i of event.currentTarget.dataset.id.specification) {
      temp.push(i);
    }
    for (var i of event.currentTarget.dataset.id.num_unit) {
      temp2.push(i);
    }
    this.setData({
      goodsId: event.currentTarget.dataset.id.goods_code,
      goodsName: event.currentTarget.dataset.id.goods_name,
      array_goods_status: true,
      hiddenLoading: true,
      specification: [...temp],
      danwei: [...temp2]
    })
  },
  //供货商投料品id
  bingId3(event) {
    this.setData({
      supplierId: event.currentTarget.dataset.id.supplier_no,
      supplierName: event.currentTarget.dataset.id.supplier_name,
      supplier_name: true
    })
  },
  //选择进场时间
  bindDateChange2: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },
  //检疫结果
  result: function (e) {
    this.setData({
      index4: e.detail.value
    })
  },

  //选择进场数量or重量
  jinchang_num: function () {
    this.setData({
      jinchang_num: !this.data.jinchang_num,
      zhongliang: true,
    })
  },
  zhongliang: function () {
    this.setData({
      zhongliang: !this.data.zhongliang,
      jinchang_num: true,
    })
  },
  //选择单位
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
  //凭证类型
  style: function (e) {
    this.setData({
      index6: e.detail.value
    })
  },

  //输入进场数量
  inputChange1: function (e) {
    console.log(e)
    var that = this
    that.setData({
      trace_in_num: e.detail.value
    })
    this.dd()
  },

  inputChange2: function (e) {
    console.log(e)
    var that = this
    that.setData({
      price: e.detail.value
    })
    this.dd()
  },
  dd: function () {

    var that = this
    var trace_in_num = that.data.trace_in_num
    var price = that.data.price
    that.setData({
      zongjia: parseFloat(trace_in_num * price).toFixed(2)
    })
  },

  //输入重量
  inputChange11: function (e) {
    console.log(e)
    var that = this
    that.setData({
      weight: e.detail.value
    })
    this.dd1()
  },

  inputChange21: function (e) {
    console.log(e)
    var that = this
    that.setData({
      price1: e.detail.value
    })
    this.dd1()
  },
  dd1: function () {
    console.log(1)
    var that = this
    var weight = that.data.weight
    var price1 = that.data.price1
    that.setData({
      zhong_zong: parseFloat(weight * price1).toFixed(2)
    })
    console.log(that.data.zhong_zong)
  },

  //发送信息
  formSubmit: function (e) {
    var that = this
    var goods_code = that.data.goodsId
    var goods_name = that.data.goodsName
    var whole_saler_out_code = that.data.supplierId
    var whole_saler_out_name = that.data.supplierName
    var in_date = that.data.date
    var result = that.data.result[that.data.index4].num

    var transporter_code = e.detail.value.car_num //运输车牌号 
    var voucher_type = Number(that.data.index6) === 0 ? '' : Number(that.data.index6)//凭证类型

    var voucher_code = e.detail.value.Voucher_num //凭证通号
    var specification = that.data.specification[that.data.index_speci]//规格
    console.log(specification)
    // if (goods_code == "" || whole_saler_out_code == "" || in_date == "" || transporter_code==""||voucher_code==""){
    //   wx.showModal({
    //     title: '提示',
    //     content: '请输入完整信息',
    //     showCancel:false
    //   })
    //   return

    // }
    if (that.data.jinchang_num == false) {
      var trace_in_num = that.data.trace_in_num
      trace_in_num = e.detail.value.jinchang_num
      console.log(trace_in_num)
      var price = that.data.price
      price = e.detail.value.danjia
      var weight = 0
      console.log(price)
      var danwei = that.data.danwei[that.data.index_speci2]
      console.log(Number(trace_in_num * price))
      that.setData({
        zongjia: parseFloat(trace_in_num * price).toFixed(2)
      })
      if (price == "") {
        wx.showModal({
          title: '提示',
          content: '请输入价格',
          showCancel: false
        })
        return
      }
      //  进场数量

      wx.request({
        url: getApp().globalData.url + '/api/entrance_message',
        method: 'POST',
        data: {
          weight: weight,
          goods_code: goods_code,
          goods_name: goods_name,
          whole_saler_out_code: whole_saler_out_code,
          whole_saler_out_name: whole_saler_out_name,
          in_date: in_date,
          result: result,
          transporter_code: transporter_code, //运输车牌号 
          voucher_type: voucher_type === 0 ? '' : voucher_type, //凭证类型
          voucher_code: voucher_code, //凭证通号
          trace_in_num: trace_in_num, //进场数
          specification: specification, //规格
          price: price,
          num_unit: danwei,
          // zongjia: that.data.zongjia
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
          }
          if (res.data.code != 200 || res.data.code != 422) {
            wx.showModal({
              title: '提示',
              content: res.data.message,
              showCancel: false
            })
          }
          if (res.data.code == 422) {
            wx.showModal({
              title: '提示',
              content: '请填入完整信息',
              showCancel: false
            })
          }
        }
      })
    } else {
      //  重量
      var weight = e.detail.value.weight
      console.log(weight)
      var price = e.detail.value.danjia2
      var trace_in_num = 0
      console.log(price)
      var danwei = that.data.danwei[that.data.index_speci2]
      console.log(Number(trace_in_num * price))
      that.setData({
        zhong_zong: parseFloat(weight * price).toFixed(2)
      })
      if (price == "") {
        wx.showModal({
          title: '提示',
          content: '请输入价格',
          showCancel: false
        })
        return
      }
      wx.request({
        url: getApp().globalData.url + '/api/entrance_message',
        method: 'POST',
        data: {
          goods_code: goods_code,
          goods_name: goods_name,
          whole_saler_out_code: whole_saler_out_code,
          whole_saler_out_name: whole_saler_out_name,
          in_date: in_date,
          result: result,
          weight: weight,
          transporter_code: transporter_code, //运输车牌号 
          voucher_type: voucher_type === 0 ? '' : voucher_type, //凭证类型
          voucher_code: voucher_code, //凭证通号
          trace_in_num: trace_in_num, //进场数
          specification: specification, //规格
          price: price,
          num_unit: danwei,
          // zongjia: that.data.zhong_zong
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
          }
        }
      })
    }
  },
  onShow: function () {
  
  },

})
