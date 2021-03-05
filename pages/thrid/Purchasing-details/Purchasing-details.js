// pages/thrid/Purchasing-details/Purchasing-details.js
const api = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:'',
    goods:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取商品
    var that = this
    console.log('订单id为：', options.id)
    console.log('id为：', options)

    // 获取商品的id(别忘了跳转界面的点击事件data-id)
    const d_id = options.id
    const type = options.stctic
    // const index = options.index

    // 数据与视图的同步更新（存储获取的商品id）
    that.setData({
      d_id,
      type,
      // index
    });
    // 获得订单详情
    that.getOrder()
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
  // 获取详情
  getOrder(e){
    var that = this
    wx.request({
      url: api.apiUrl.url +'sels_receiver',
      data: {
        'token': wx.getStorageSync('token'),
        // 上面的id是存储在this.data中，所以要在this.data中取值
        'id':this.data.d_id
      },
      method: 'POST',
      success: function (res) {
        console.log('请求的代购详情',res)
        console.log('总价', res.data.data.price + res.data.data.d_price + Number(res.data.data.platform_price) )
        that.setData({
          user:res.data.data,
          goods:res.data.msg[0]
        })
        // 计算总价
        that.total()
      },
    })
  },
  // 点击导航调出地图
  Navigation(e){
    var that = this
    // 获取id、lat、lng
    const id = that.data.d_id
    const latitude = that.data.goods.lat
    const longitude = that.data.goods.lng
    console.log(longitude)
        wx.openLocation({
          latitude: Number(latitude),
          longitude: Number(longitude),
          scale: 18
        })
  },
  // 确认完成
  goPay(e) {
    var that = this
    const id = e.currentTarget.dataset.id
    wx.showModal({
      title: '提示',
      content: '是否完成抢单？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.request({
            url: api.apiUrl.url + 'update_receiver',
            data: {
              'token': wx.getStorageSync('token'),
              'id': that.data.d_id
            },
            method: 'POST',
            success: function (res) {
              console.log('点击确认完成返回', res)
              if (res.data.code == 1) {
                wx.showToast({
                  title: '抢单成功！',
                  duration: 1000,
                })
                // setTimeout(function () {
                //   wx.navigateBack({})
                // }, 1000)
              wx.navigateTo({
                url: '/pages/thrid/Distributiondetails/Distributiondetails?index=1',
              })
              } else {
                wx.showToast({
                  title: '取餐失败！',
                  icon: 'none',
                  duration: 1000,
                })
              }
            },
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 计算赏金+补助
  total(e){
    var Subsidy = 2
    // console.log('data', this.data.user)
    console.log('这里是总价', this.data.user.price + this.data.user.d_price + Number(this.data.user.platform_price) )
    this.setData({
      total: this.data.user.price + this.data.user.d_price + Number(this.data.user.platform_price) 
    })
  }
})