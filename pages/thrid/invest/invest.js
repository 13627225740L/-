// pages/thrid/invest/invest.js
//获取以封装全局变量的接口地址 
const api = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    activeC: 0,
    combolist: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //获取套餐
    this.getItem()

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

  //获取套餐
  getItem() {
    var that = this
    wx.request({
      url: api.apiUrl.url + 'sel_hd',
      method: 'POST',
      success: function(res) {
        console.log('获取的套餐详情',res)
        that.setData({
          image:res.data.data,
          combolist: res.data.msg,
          id: res.data.msg[0].id
        })

      },
    })
  },

  //点击选择套餐
  toChange(e) {
    console.log(e)
    const id = e.currentTarget.dataset.id
    const activeC = e.currentTarget.dataset.index
    this.setData({
      id,
      activeC
    })
  },
  // 选择支付方式
  goPay(e) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '确认选择该套餐？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.request({
            url: api.apiUrl.url + 'payhd',
            data: {
              token: wx.getStorageSync('token'),
              id:that.data.id
            },
            method: 'POST',
            success: function(res) {
              console.log('发起充值：', res)
              const timeStamp = res.data.timeStamp;
              const nonceStr = res.data.nonceStr;
              const wxpackage = res.data.package;
              const signType = res.data.signType;
              const paySign = res.data.paySign;
              //调起支付
              wx.requestPayment({
                timeStamp,
                nonceStr,
                package: wxpackage,
                signType,
                paySign,
                success: function (res) {
                  console.log(res)
                  wx.showToast({
                    title: '充值成功！',
                    duration: 1500,
                  })
                  setTimeout(function(){
                    wx.redirectTo({
                      url: '/pages/second/Vousher/Vousher',
                    })
                  },1500)
                },
                fail: function (res) {
                  console.log("支付失败")
                  wx.showToast({
                    title: '支付失败',
                    icon: 'none',
                  });
                },
              })
            },
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})