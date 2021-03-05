// pages/thrid/address/address.js
const api = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    addressList: [],
  },

  // 返回收货地址给订单
  fhdd(e) {
    console.log(e.currentTarget.dataset.id)
    var that = this;
    if (that.data.id > 0) {
      wx.setStorageSync("add_id", e.currentTarget.dataset.id)
      wx.navigateBack({})
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //获取收货地址
    this.getAddressList()

    var that = this
    if (options.id != null) {
      that.setData({
        id: options.id
      })
    }

    //获取收货地址
    this.getAddressList()
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
    //获取收货地址
    this.getAddressList()
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
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //修改默认地址
  checkboxChange(e) {
    var that = this
    console.log('当前点击收货地址ID为：', e.currentTarget.dataset.id);
    wx.request({
      url: api.apiUrl.url + 'set_address',
      data: {
        id: e.currentTarget.dataset.id,
        token: wx.getStorageSync('token')
      },
      method: 'POST',
      success: function(res) {
        console.log(res)
        that.getAddressList()
      },

    })

  },



  //跳转至添加地址中心
  toAdd(e) {
    console.log(e)
    wx.navigateTo({
      url: '/pages/thrid/add_address/add_address',
    })
  },

  //获取收货地址
  getAddressList() {
    var that = this
    wx.request({
      url: api.apiUrl.url + 'sele_address',
      data: {
        token: wx.getStorageSync('token')
      },
      method: 'POST',
      success: function(res) {
        console.log(res)
        that.setData({
          addressList: res.data.msg
        })
      },
    })
  },

  // 编辑收货地址
  toModify(e) {

    // 将当前地址的名字、号码、详细地址存入缓存
    console.log('点击修改收货地址，携带的值为：', e.currentTarget.dataset)
    const siteInfo = e.currentTarget.dataset
    wx.setStorageSync('siteInfo', siteInfo);
    // 跳转至修改界面
    this._goToSomePage('/pages/thrid/modify_address/modify_address')
  },

  // 跳转至非Bar界面
  _goToSomePage(url) {
    wx.navigateTo({
      url: url,
    })
  },

  //删除当前收货地址
  toDel(e) {
    console.log('点击删除收货地址，携带的ID值为：', e.currentTarget.dataset.id)
    const id = e.currentTarget.dataset.id
    var that = this;
    wx.request({
      url: api.apiUrl.url + 'delete_address',
      method: 'POST',
      data: {
        id: id,
        'token': wx.getStorageSync('token')
      },
      success: res => {
        console.log(res)
        if (res.data.code == 1)
          wx.showToast({
            title: '删除成功',
            success: 'none'
          })
        that.onLoad('')
      }
    })
  },
})