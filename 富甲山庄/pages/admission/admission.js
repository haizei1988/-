// pages/admission/admission.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src:"",
    name:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  this.setData({
    name:options.name
  })
  },
  camera:function(){
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        wx.navigateTo({
          url: '../out/out?src=' + res.result, //
          success: function () {
          },       //成功后的回调；
          fail: function () { },         //失败后的回调；
          complete: function () { }      //结束后的回调(成功，失败都会执行)
        })
        console.log(res)
      }
    })
 },
  navigata:function(){
    console.log(this.data.name)
    if (this.data.name =='投料采购'){
      wx.navigateTo({
        url: '/pages/admission_detail/admission_detail',
      })
    } else if (this.data.name == '种子'){
      wx.navigateTo({
        url: '/pages/seed_procurement/seed_procurement',
      })
    } else if (this.data.name == '肥料'){
      wx.navigateTo({
        url: '/pages/fertilizer_procurement/fertilizer_procurement',
      })
    } else if (this.data.name == '农药'){
      wx.navigateTo({
        url: '/pages/pesticide_procurement/pesticide_procurement',
      })
    } else if (this.data.name == '种植基础') {
      wx.navigateTo({
        url: '/pages/planting_basis/planting_basis',
      })
    } else if (this.data.name == '种植过程') {
      wx.navigateTo({
        url: '/pages/planting_process/planting_process',
      })
    }
  }
})