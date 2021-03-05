// pages/second/help/help.js
const api = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    itemList: [

    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    // 使用帮助中心
    wx.request({
      url: api.apiUrl.url + 'help_list',
      method: 'POST',
      success: function (res) {
        console.log('获取帮助中心', res)
        that.setData({
          itemList: res.data.molist
        })
      },
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
  // 点击展开详情
  toDetils(e) {
    console.log('点击事件')
    const id = parseInt(e.currentTarget.dataset.id)
    this.setData({
      id
    });
    console.log("当前的id", id);
    if (this.data.stctic == 0) {
      this.setData({
        status: 0,
      })
    } else {
      this.setData({
        stctic: 1,
      })
    }
  },
})