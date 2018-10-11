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
    lists: [{ goodsName: "", goodsId: "", numbers: "", remark:"", array_goods_status:true }],
    index: 0,
    index1: 0,
    index2: 0,
    index3: 0,
    selectedindex:0,
    array_goods_status: true,
    feeder_name: true,
    supplier_name: true,
    goodsName: "",
    goodsId: "",
    goodsId2: "",
    supplierName: '',
    supplierId: '',
    hiddenLoading: true,
    height: '',
    state:""
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
  addList: function () {
    var lists = this.data.lists;
    var newData = { goodsName: "", goodsId: "", numbers: "", remark:"",array_goods_status: true};
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
  hidden(e) {
    var that = this
    var selectedindex = e.currentTarget.dataset.index
    var array_goods_status = 'lists[' + selectedindex + '].array_goods_status'
    that.setData({
      [array_goods_status]: true,
    })
  },
  hidden2(){
    this.setData({
      supplier_name:true
    })
  },
  numbers(e){
    var numbers1=e.detail.value
    var selectedindex = e.currentTarget.dataset.index
    
    var numbers = 'lists[' + selectedindex + '].numbers';
    this.setData({
      [numbers]: numbers1
    })
    console.log(this.data.lists)
  },
  remark(e) {
    var remark1 = e.detail.value
    var selectedindex = e.currentTarget.dataset.index

    var remark = 'lists[' + selectedindex + '].remark';
    this.setData({
      [remark]: remark1
    })
    console.log(this.data.lists)
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
  Varieties_feeding: function (e) {
    var that = this;
    var selectedindex=e.currentTarget.dataset.index
    var array_goods_status = 'lists[' + selectedindex + '].array_goods_status'
    that.setData({
      hiddenLoading: !this.data.hiddenLoading,
      init: false,
      pageData: {
        page: 1,
        limit: 30
      },
      total: '',
      state: selectedindex
    })
    console.log(that.data.state)
    if (that.data.goodsName != "") {
      this.goodsNameValue();
    } else {
      //投料品种
      this.goodsNameNull();
    }
    that.setData({
      [array_goods_status]: false,
      feeder_name: true,
      supplier_name: true,
    })

  },
  supplierValue() {
    let that = this;
    wx.request({
      url: getApp().globalData.url + '/api/store' + '?store_name=' + that.data.supplierName,
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
      url: getApp().globalData.url + '/api/store',
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
    var that = this
    that.setData({
      hiddenLoading: false,
      init: false
    })
    console.log(e.detail.value)
    wx.request({
      url: getApp().globalData.url + "/api/store" + '?store_name=' + e.detail.value,
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
            hiddenLoading: true,
            init: true
          })
          console.log(that.data.array_goods)
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
    for (var i of event.currentTarget.dataset.id.num_unit) {
      temp2.push(i);
    }
  
    var state = this.data.state
    var goodsName = 'lists['+state+'].goodsName';
    var goodsId = 'lists[' + state +'].goodsId';
    var array_goods_status = 'lists[' + state + '].array_goods_status';
    this.setData({
      [goodsId]: event.currentTarget.dataset.id.id,
      [goodsName]: event.currentTarget.dataset.id.goods_name,
      [array_goods_status]: true,
      hiddenLoading: true,
      specification: [...temp],
      danwei: [...temp2]
    })
    console.log(this.data.lists)
  },
  //供货商投料品id
  bingId3(event) {
    this.setData({
      supplierId: event.currentTarget.dataset.id.id,
      supplierName: event.currentTarget.dataset.id.store_name,
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
      index5: e.detail.value
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
    var arr=[]
    console.log(222222)
    var delivery_date=that.data.date
    var store_id=that.data.supplierId
    for(var i=0;i<that.data.lists.length;i++){ 
      console.log(that.data.lists[i].goodsId)
      arr.push({ "goods_id": that.data.lists[i].goodsId, "amount": that.data.lists[i].numbers, "remark": that.data.lists[i].remark}) 
    }
    console.log(arr)
      wx.request({
        url: getApp().globalData.url + '/api/order',
        method: 'POST',
        data: {
          delivery_date: delivery_date,
          store_id: store_id,
          goods: arr,
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
  },
  onShow: function () {

  },

})
