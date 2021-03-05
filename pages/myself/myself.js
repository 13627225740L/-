// pages/myself/myself.js
const api = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    // 弹出二维码
    showModal: false,

    //充值活动开关
    switch_on: 2,
    showModal: false,
    orderNum: 0,
    orderNum1: 0,
    orderNum2: 0,
    orderNum3: 0,
    orderNum4: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.showLoading({
      title: '加载中，请稍后。',
    });
    //获取个人信息
    this.getMyInfo()

    //充值活动开关
    this.getSwitch()

    //  获取设备屏幕高宽
    this.getAppWidHeig()
  },

  //充值活动开关
  getSwitch() {
    var that = this
    wx.request({
      url: api.apiUrl.url + 'hd_str',
      success: function (res) {
        console.log('充值活动开关。1：开启，2关闭')
        console.log('充值活动', res)
        that.setData({
          switch_on: res.data.msg
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

    //获取个人信息
    this.getMyInfo()
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

  //跳转至生活费/跳转至会员充值中心（个人账户）
  toVousher(e) {
    wx.navigateTo({
      url: '/pages/second/Vousher/Vousher',
    })
  },

  //跳转至充值活动
  toInvest() {
    wx.navigateTo({
      url: '/pages/thrid/invest/invest',
    })
  },

  // 邀请赚钱
  btn: function () {
    this.setData({
      showModal: true
    })
  },

  // 送餐补助
  tomy_performance() {
    wx.navigateTo({
      url: '/pages/thrid/my_performance/my_performance',
    })
  },


  //  关于我们
  toAbout() {
    wx.navigateTo({
      url: '/pages/second/about/about',
    })
  },
  // 跳转至个人佣金 页面
  toCommision(e) {
    console.log(e)
    wx.navigateTo({
      url: '/pages/thrid/my_brokerage/my_brokerage',
    })
  },
  // 跳转至送餐认证
  toatterstion(e) {
    console.log(e)
    wx.navigateTo({
      url: `/pages/second/atterstion/atterstion`,
    })
  },
  // 跳转至我的订单
  toAssess(e) {
    console.log(e)
    const id = e.currentTarget.dataset.tabid
    wx.navigateTo({
      url: `/pages/second/assess/assess?id=${id}`,
    })
  },

  //跳转至我的收货地址
  toAddress() {
    wx.navigateTo({
      url: '/pages/thrid/address/address',
    })
  },

  // 页面跳转至帮助中心
  tohelp(e) {
    console.log(e)
    // const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/second/help/help`,
    })
  },
  // 页面跳转至区域加盟代理
  toagent(e) {
    console.log(e)
    wx.navigateTo({
      url: `/pages/second/agent/agent`,
    })
  },

  //跳转至我的银行卡
  toMycard() {
    wx.navigateTo({
      url: '/pages/thrid/my_card/my_card'
    })
  },

  //跳转至待配送订单
  toDistribution() {
    wx.navigateTo({
      url: '/pages/thrid/Distributiondetails/Distributiondetails'
    })
  },
  // toDistribution() {
  //   wx.navigateTo({
  //     url: '/pages/thrid/distribution/distribution'
  //   })
  // },

  //获取个人信息
  getMyInfo() {
    var that = this
    wx.request({
      url: api.apiUrl.url + 'my',
      data: {
        token: wx.getStorageSync('token')
      },
      method: 'POST',
      success: function (res) {
        console.log('获取到的个人信息为：', res.data)
        that.setData({
          user: res.data.msg,
          image: res.data.data,
          orderNum: res.data.count,
          orderNum1: res.data.data1,
          orderNum2: res.data.data2,
          orderNum3: res.data.data3,
          orderNum4: res.data.data4,
        })
        wx.hideLoading();
      },
    })
  },

  //获取屏幕高宽
  getAppWidHeig() {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        console.log('窗口宽度', res.windowWidth)
        console.log('窗口高度', res.windowHeight)
        that.setData({
          windowHeight: res.windowHeight * 0.72,
          windowWidth: res.windowWidth * 0.8
        })
      },
    })
  },

  // 弹出二维码以及预览保存等

  btn: function () {
    this.setData({
      showModal: true
    })
  },

  // 禁止屏幕滚动
  preventTouchMove: function () { },

  // 弹出层里面的弹窗
  ok: function () {
    this.setData({
      showModal: false
    })
  },

  // 预览图片
  previewImage: function (e) {
    const current = e.target.dataset.url;
    var yy = [current]
    wx.previewImage({
      current: current,
      urls: yy
    })
  },

  //保存图片
  picSave(e) {
    var that = this
    console.log('二维码图片地址为：', e.target.dataset.url)
    wx.downloadFile({
      url: e.target.dataset.url,
      success: function (res) {
        console.log('493749', res)
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (res) {
            console.log(res)
            wx.showToast({
              title: '图片保存成功！',
            })
            setTimeout(function () {
              that.setData({
                showModal: false
              })
            }, 2000)
          },
          fail: function (err) {
            console.log(err)
            wx.showToast({
              title: '图片保存失败！',
              icon: 'none'
            })
          }
        })
      },
      fail: function (err) {
        console.log(err)
        wx.showToast({
          title: '您取消了授权!',
          icon: 'none'
        })
      }
    })
  },
})