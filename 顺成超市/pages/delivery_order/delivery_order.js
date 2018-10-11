// pages/delivery_order/delivery_order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderData: [],
    items: "",
    number: 0,
    hidden: true,
    array_goods: [],
    supplier: [],
    goodsName: "",
    goodsId:0,
    hiddenLoading: true,
    height: "",
    height1:"",
    date:"",
    amount: 0,
    totalNum: 0,
    total:"",
    array_goods_status:true,
    supplierName: '',
    supplierId: '',
    supplier_name: true,
    lists: {
      goodsName: "",
      goods_id: "",
      amount: 0,
      array_goods_status: true
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  addList: function() {
    var orderData = this.data.orderData;
    orderData.push(this.data.lists); //实质是添加lists数组内容，使for循环多一次
    this.setData({
      orderData: orderData,
    })
    console.log(this.data.orderData)
  },

  delList: function() {
    var orderData = this.data.orderData;
    orderData.pop(); //实质是删除lists数组内容，使for循环少一次
    this.setData({
      orderData: orderData,
    })
  },
  sure: function() {
    this.setData({
      hidden: true,
    })
    var that = this
    if (that.data.totalNum > that.data.amount) {
      console.log(90)
      wx.showModal({
        title: '提示',
        content: '配送数量大于需求数量',
        showCancel: false,
      })
    }
  },
  edit() {
    this.setData({
      hidden: false,
    })
  },
  
  goods(e){
    var goods = e.currentTarget.dataset.goods_id
    var selectedindex = e.currentTarget.dataset.index
    var goodsId = 'orderData[' + selectedindex + '].goods_id';
    this.setData({
      [goodsId]: goods
    })
    console.log(this.data.orderData)
  },
  numbers(e) {
    var numbers1 = Number(e.detail.value)
    var selectedindex = e.currentTarget.dataset.index
    var amount = 'orderData[' + selectedindex + '].amount';
    this.setData({
      [amount]: numbers1
    })
    console.log(this.data.orderData)
    // var that = this
    // var totalNum1 = 0
    // for (var i = 0; i < that.data.lists.length; i++) {
    //   totalNum1 = totalNum1 + that.data.lists[i].numbers
    // }
    // that.setData({
    //   totalNum: totalNum1
    // })
    // console.log(that.data.amount)
  },
  onLoad: function(options) {
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight - 30
        })
      },
    })
    let item = JSON.parse(options.items);
    console.log(item)
    let arr = item.goods
    // this.setData({ detail: object });
    // for (var i = 0; i < arr.length; i++) {
    //   arr.push({ "array_goods_status": true})
    // }
    console.log(arr)
    this.setData({
      orderData: arr,
      items: item,
      amount: item.goods[0].amount,
      date: item.delivery_date,
      supplierName: item.store_bak.store_name,
    });
    console.log(this.data.orderData)
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
      data: !val ? that.data.pageData : Object.assign(that.data.pageData, {
        page: parseInt(that.data.pageData.page) + 1
      }),
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

  //选择投料品种
  Varieties_feeding: function(e) {
    var that = this;
    var selectedindex = e.currentTarget.dataset.index
    var height =""
    if (selectedindex==0){
      height= 190 * (selectedindex + 1)
    }else{
      height = 190 + 269 * selectedindex
    }
    
    // var array_goods_status = 'lists[' + selectedindex + '].array_goods_status'
    that.setData({
      hiddenLoading: !this.data.hiddenLoading,
      init: false,
      pageData: {
        page: 1,
        limit: 30
      },
      total: '',
      state: selectedindex,
      height1: height
    })
    console.log(that.data.state)
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
  //选择日期
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  bingId(event) {
    var temp = [];
    var temp2 = [];
    var state = this.data.state
    var goodsName = 'orderData[' + state + '].goods_bak.goods_name';
    var goodsId = 'orderData[' + state + '].goods_id';
    // var array_goods_status = 'lists[' + state + '].array_goods_status';
    this.setData({
      [goodsId]: event.currentTarget.dataset.id.id,
      [goodsName]: event.currentTarget.dataset.id.goods_name,
      array_goods_status: true,
      hiddenLoading: true,
    })

  },

  // 门店
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
  bindKeyInput3(e) {
    var that = this
    that.setData({
      hiddenLoading: false,
      init: false
    })
    console.log(e.detail.value)
    wx.request({
      url: getApp().globalData.url + '/api/store' + '?store_name=' + e.detail.value,
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
  bingId3(event) {
    console.log(event.currentTarget.dataset.id)
    this.setData({
      supplierId: event.currentTarget.dataset.id.id,
      supplierName: event.currentTarget.dataset.id.store_name,
      supplier_name: true
    })
  },
  // 提交信息
  formSubmit: function (e) {
    var that = this
    var batch = []
    var arr = that.data.orderData
    // var goods = that.data.items.goods
    // for (var i = 0; i < that.data.lists.length; i++) {
    //   batch.push({ "goods_id": that.data.lists[i].goodsId, "amount": that.data.lists[i].numbers,"remark":"" })
    // }
    // console.log(batch)
    // return
    // goods.map(((item, index) => {
    //   item=Object.assign(item, {"batch": batch}) //给数组里的对象添加数组
    // }))
    // var price = that.data.orderData[0].goods_bak.price
    // goods[0]['price'] = price //添加价格到goods里
    var obj = that.data.items;
    obj.goods = arr;
    obj.delivery_date = that.data.date;
    // var order_id = that.data.items.id
    obj['store_id'] = that.data.supplierId;
    console.log(obj)
    wx.request({
      url: getApp().globalData.url + '/api/order/183',
      method: 'PUT',
      data:obj,
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
            content: '配送成功',
            showCancel: false
          })
        }
      }
    })
  },
})