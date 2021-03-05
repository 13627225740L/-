// pages/second/apply/apply.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    setLoading(e) {
      this.setData({
        loading: !this.data.loading
      })
    },

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
// wx.showNavigationBarLoading();
wx.hideNavigationBarLoading();
this.onLoad()
this.onShow()
// 停止下拉动作
wx.stopPullDownRefresh();
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

  },
  //点击底部的button
  spach(e) {
    console.log(e)
    this.setData({
      type_id: e.currentTarget.dataset.id
    })
  },

  // 页面跳转地址未设置
  // 返回首页
  tohome(e) {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  // 返回个人中心
  tomy(e) {
    wx.switchTab({
      url: '/pages/myself',
    })
  },
})