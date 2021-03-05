// pages/second/my_account/my_account.js

const app = getApp()

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
  onLoad: function (options) {
    //获取账户详情
    this.getAccount()
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
    //获取账户详情
    this.getAccount()
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

  //点击充值
  toRecharge() {
    console.log('点击了充值')
  },


  //点击提现
  toDeposit() {
    wx.navigateTo({
      url: '/pages/thrid/deposit/deposit',
    })
  },

  //获取账户详情
  getAccount() {
    var that = this
    wx.request({
      url: api.apiUrl.url + 'sel_mytx',
      data:
      {
        token: wx.getStorageSync('token')
      },
      method: 'POST',
      success: function (res) {
        console.log('我的账户：', res.data)
        that.setData({
          itemList: res.data.msg,
          balance: res.data.data
        })
      },
    })
  },
})