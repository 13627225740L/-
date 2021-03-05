// pages/second/goods_type/goods_type.js
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
    var that =this
    console.log('商品属性为：', options)
    const type_id = options.typeid
    that.setData({
      type_id
    })
    //获取商品
    this.getGoodsList()
    // 点击跳转至详情页面(如果在这里添加的话，将会报错！原因是一进来还未点击)
    // this.toDetail()
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
    this.getGoodsList()
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
  //获取商品
  getGoodsList() {
    var that =this
    const type_id = that.data.type_id
    wx.request({
      url: api.apiUrl.url + 'sou_shping',
      data: {
        type_id
      },
      method: 'POST',
      success: (result) => {
        console.log('获取的商品详情页面0', result.data.msg)
        that.setData({
          detailList: result.data.msg
        })
      },
    });
  },
  // 点击跳转至详情页面
  toDetail(res) {
    console.log('点击跳转详情,携带的当前商品ID为：', res)
    const id = res.currentTarget.dataset.id
    console.log('点击商品详情的id', res.currentTarget.dataset.id)

    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`,
    })
  }
})