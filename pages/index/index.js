// pages/index/index.js
// 引入SDK核心类
var QQMapWX = require('../../utils/qqmap-wx-jssdk/qqmap-wx-jssdk.js');
var qqmapsdk;
const api = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 地址定位
    welcome: '花果园爆款美食',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'SXCBZ-YYFLD-HCX4C-H5MCY-SQTM5-7AFAN'
    });

    var that = this
    //获取轮播图
    that.getBanner()
    //获取商品详情
    that.getGoodsList()
    //获取当前位置
    this.getSite()
    //获取个人信息
    this.getMyInfo()
  },

  //获取个人信息
  getMyInfo() {
    var that = this
    wx.request({
      url: api.apiUrl.url + 'my',
      data: {
        token: wx.getStorageSync('token')
      },
      method: 'POST',
      success: function(res) {
        console.log('获取到的个人信息为：', res.data)
        that.setData({
          user: res.data.msg,
        })
      },
    })
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
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //点击高评分
  toHight() {
    wx.navigateTo({
      url: `/pages/second/goods_type/goods_type?typeid=${1}`,
    })
  },

  //点击特色美食
  toSpecialty() {
    wx.navigateTo({
      url: `/pages/second/goods_type/goods_type?typeid=${2}`,
    })
  },

  //点击新鲜水果
  toFruits() {
    wx.navigateTo({
      url: `/pages/second/goods_type/goods_type?typeid=${3}`,
    })
  },
  
  //点击其他推荐
  toElse() {
    wx.navigateTo({
      url: `/pages/second/goods_type/goods_type?typeid=${4}`,
    })
  },

  // 获取商品详情 
  toDetail(e) {
    // 输出
    console.log(e)
    //提交
    const id = e.currentTarget.dataset.id
    // 页面跳转
    wx.navigateTo({
      // 跳转页面的地址（携带id），携带id的拼接方法如下：页面地址?id=${id}
      url: `/pages/detail/detail?id=${id}`,
    })
  },

  //获取轮播
  getBanner() {
    // 声明
    var that = this
    // 获取轮播图
    wx.request({
      // 接口地址 此处顶部以引用  const api = getApp(),此处的()倘若忘记，则会出现报错，下面的url会出现未定义
      url: api.apiUrl.url + 'rotation',
      // 获取的方法
      method: 'POST',
      // 获取成功的函数
      success: function(res) {
        // 数据输出（用于查看是否以获得所请求的数据）
        console.log(res)
        // 视图及数据的更新（保存）
        that.setData({
          spannerlist: res.data.msg
        })
      },
    })
  },

  //获取商品列表
  getGoodsList() {
    var that = this
    wx.request({
      url: api.apiUrl.url + 'shping',
      method: 'POST',
      success: function(res) {
        console.log('获取商品列表', res.data.msg)
        const goods = res.data.msg
        // var goodsItem = []
        console.log('列表', goods)
        that.setData({
          detailList: res.data.msg,
        })
      },
    })
  },

  //获取当前位置
  getSite() {
    var that = this
    // 获取地址
    wx.getLocation({
      type: 'wgs84',
      success: function(res){
        console.log(res)
        const lat = res.latitude
        const lng = res.longitude
        wx.request({
          url: api.apiUrl.url + 'upjing',
          data: {
            token: wx.getStorageSync('token'),
            lat,
            lng,
          },
          method: 'POST',
          success: function(res) {
            that.getSiteText(lat, lng)
          },
        })
      },
    })
  },
  //地址逆解析
  getSiteText(lat, lng) {
    var that = this
    const city = "nvabarData.city"
    const district = "nvabarData.district"
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: lat,
        longitude: lng
      },
      success: function (res) {
        // console.log('这是解析的地址', res)
        const siteInfo = res.result.address
        that.setData({
          siteInfo
        })
        // console.log('data里的值为：', that.data)
      }
    })
  }
})