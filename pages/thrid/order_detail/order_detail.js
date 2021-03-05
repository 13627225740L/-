// pages/thrid/confirmOrder/confirmOrder.js
const api = getApp()

// 引入SDK核心类
var QQMapWX = require('../../../utils/qqmap-wx-jssdk/qqmap-wx-jssdk.js');
var qqmapsdk;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: 291,
    type: 0,
    payType: 1,
    // 平台补助
    Subsidy: +2,
    infoList:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'SXCBZ-YYFLD-HCX4C-H5MCY-SQTM5-7AFAN'
    });


    // 获取商品
    var that = this
    console.log('订单id为：', options.id)
    console.log('id为：', options)

    // 获取商品的id(别忘了跳转界面的点击事件data-id)
    const d_id = options.id
    const type = options.stctic

    // 数据与视图的同步更新（存储获取的商品id）
    that.setData({
      d_id,
      type,
    });
    // 获得订单详情
    that.getOrder()
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // 获得订单详情
    this.getOrder()
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

  // 点击取单(进入地图的导航)
  totake(e) {
    var that = this
    const id = that.data.d_id
    const latitude = that.data.goodsList[0].lat
    const longitude = that.data.goodsList[0].lng
    wx.openLocation({
      latitude: Number(latitude),
      longitude: Number(longitude),
      scale: 18
    })
    wx.request({
      url: api.apiUrl.url + 'delivery',
      data: {
        id,
      },
      method: 'POST',
      success: function(res) {
        console.log('完成收货',res)
      },
    })
  },
  tocalling(e) {
    const phone = this.data.infoList.list.phone
    wx.showModal({
      title: '温馨提示',
      content: '是否现在联系TA？',
      success: function(res) {
        if (res.confirm) {
          console.log('点击确定了');
          wx.makePhoneCall({
            phoneNumber:phone
          });
        } else if (res.cancel) {
          console.log('点击取消了');
          return false;
        }
      }
    })
  },

  //点击送单
  toOrder(e) {
    var that = this
    const id = that.data.d_id
    const latitude = that.data.lats
    const longitude = that.data.lngs
        wx.openLocation({
          latitude: Number(latitude),
          longitude: Number(longitude),
          scale: 18
        })
  },

  //获取订单详情
  getOrder() {
    var that = this
    wx.request({
      url: api.apiUrl.url + 'sel_receiver',
      data: {
        'token': wx.getStorageSync('token'),
        'id': that.data.d_id
      },
      method: 'POST',
      success: function(res) {
        console.log('请求的订单列表', res.data)
        const receiver = res.data.data.list
        var take_name = receiver.names
        var names = take_name.replace(/(.{1}).*(.{1})/, '$1****$2')
        var mobile = receiver.phone
        var phone = mobile.replace(/(.{3}).*(.{4})/, '$1****$2');
        const site = res.data.data.list.address[1] + res.data.data.list.address[2] + res.data.data.list.info
        that.setData({
          names,
          phone,
          infoList: res.data.data,
          goodsList: res.data.msg
        })
        // 获取总价
        that.getTotal()
        that.siteText(site)
      }
    })
  },

  //地址解析坐标
  siteText(site) {
    console.log('这是地址', site)
    var that = this
    qqmapsdk.geocoder({
      address:site,
      success: function (res) {
        console.log('这是解析的坐标', res)
        const lats = res.result.location.lat
        const lngs = res.result.location.lng
        that.setData({
          lats,
          lngs
        })
      }
    })
  },

  //送餐员点击送达
  toService() {
    var that = this
    wx.showModal({
      title: '提示',
      content: '是否确认送达？当买家确认收货后，打赏金额及本金将于次日到账，24小时买家自动收货。',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.request({
            url: api.apiUrl.url + 'take_meals',
            data: {
              token: wx.getStorageSync('token'),
              id,
            },
            method: 'POST',
            success: function(res) {
              console.log('点击送达。。。', res)
              if (res.data.code == 1) {
                wx.showToast({
                  title: '送达成功！',
                  duration: 1000,
                })
                setTimeout(function() {
                  wx.navigateBack({})
                }, 1000)
              }
            },
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //计算总价
  getTotal(e) {
    // // 获取商品的金额
    var that = this
    var Subsidy = 2
    // console.log('打印that.data', that.data.infoList)
    console.log('总金额', that.data.infoList.price + that.data.infoList.d_price + Number(that.data.infoList.platform_price))
      that.setData({
        total: that.data.infoList.price + that.data.infoList.d_price + Number(that.data.infoList.platform_price)
      })
  },
// 点击确认完成
  goPay(e){
    const id = this.data.d_id
  wx.showModal({
      title: '提示',
      content: '是否配送本单是否完成？',
      success(res) {
        if (res.confirm){
          console.log('用户点击确定')
          wx.request({
            url: api.apiUrl.url + 'take_meals',
            data: {
              'token': wx.getStorageSync('token'),
              id,
            },
            method: 'POST',
            success: function(res){
              console.log('点击完成返回',res)
              if (res.data.code == 1){
                wx.showToast({
                  title: '订单完成！',
                  duration:1000,
                })
                setTimeout(function(){
                  wx.navigateBack({
                    
                  })
                },1000)
              }
            },
          })
        }else if (res.cancel){
          console.log('用户点击取消')
        }
      }
    })
  },
})