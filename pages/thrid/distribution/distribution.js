// pages/thrid/distribution/distribution.js
const api = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取我的配送单
    this.getOrder()
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
    //获取我的配送单
    this.getOrder()
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
    this.onLoad()
    wx.hideLoading();
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


  //获取我的配送单
  getOrder() {
    var that = this
    // 使用帮助中心
    wx.request({
      url: api.apiUrl.url + 'my_receiver',
      data: {
        token: wx.getStorageSync('token'),
      },
      method: 'POST',
      success: function (res) {
        console.log('获取我的配送单', res)
        that.setData({
          orderList: res.data.msg
        })
      },
    })
  },

  //跳转至详情界面
  toDetils(e) {
    console.log(e)
    const id = e.currentTarget.dataset.id
    var that = this
    wx.navigateTo({
      url: '/pages/thrid/order_detail/order_detail?id=' + id + "&stctic=" + 1,
    })
  },

  //点击取消
  toDel(e) {
    var that = this
    const id = e.currentTarget.dataset.id
    wx.showModal({
      title: '提示',
      content: '是否取消本订单？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.request({
            url: api.apiUrl.url + 'set_receiver',
            data: {
              token: wx.getStorageSync('token'),
              id,
            },
            method: 'POST',
            success: function (res) {
              console.log('获取我的配送单', res)
              if (res.data.code == 1) {
                wx.showToast({
                  title: '取消成功',
                  duration: 1000,
                })
              }
              that.getOrder()
            },
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
})