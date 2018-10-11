// pages/admission/admission.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
  
})