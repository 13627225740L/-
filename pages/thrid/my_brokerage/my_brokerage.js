// pages/second/my_account/my_account.js
const api = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    itemList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //获取佣金明细
    this.getItemList()
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
    this.onLoad()
    wx.hideLoading();
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

  },

  //转入余额
  shiftToBalance() {
    console.log('点击了转入余额。。。。。')
    var that = this
    wx.request({
      url: api.apiUrl.url + 'trans',
      data: {
        token: wx.getStorageSync('token')
      },
      method: 'POST',
      success: function(res) {
        console.log('获取佣金', res)
        if (res.data.code == 1) {
          wx.showToast({
            title: '转入成功！',
            duration: 1000,
            success: function() {
              //获取佣金明细
              that.getItemList()
            }
          })
        } else {
          wx.showToast({
            title: '转入失败！',
            icon: 'none',
            duration: 1000,
          })
        }
      },
    })

  },

  //获取佣金明细
  getItemList() {
    var that = this
    wx.request({
      url: api.apiUrl.url + 'sel_myyong',
      data: {
        token: wx.getStorageSync('token')
      },
      method: 'POST',
      success: function(res) {
        console.log('我的佣金：', res.data)
        that.setData({
          itemList: res.data.msg,
          balance: res.data.data
        })
      },
    })
  },
})