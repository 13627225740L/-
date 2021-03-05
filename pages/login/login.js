// pages/login/login.js
const api = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    isScope: false,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.scopeStatus();

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

  // 获取授权状态
  scopeStatus() {
    wx.getSetting({
      success: res => {
        if (res.authSetting["scope.userInfo"]) {
          wx.showLoading({
            title: '加载中',
            // mask什么意思
            mask:true,
            success: function (res) {
              wx.switchTab({
                url: '/pages/index/index',
              })
            },
          })
          this.setData({
            isScope: false
          });
        } else {
          this.setData({
            isScope: true
          });
        }
      }
    });
  },


  // 获取用户信息
  xc() {
    var that = this
    wx.login({
      success(res) {
        if (res.code) {
          //发起网络请求向后台传递code换取token
          console.log(res.code)
          wx.request({
            url: api.apiUrl.url + 'user',
            method: 'post',
            data: {
              code: res.code,
            },
            success: function (data) {
              console.log("返回用户信息")
              console.log(data)
              wx.setStorageSync('token', data.data.token)
              //获取用户头像及昵称传后台入库
              wx.getUserInfo({
                //成功的回调函数，获取到用户头像以及昵称
                success(res1) {
                  console.log('8409328048', res1)
                  //传值给后台，根据token入库
                  console.log('提交，', wx.getStorageSync('token'))
                  const username = res1.userInfo.nickName
                  const usertv = res1.userInfo.avatarUrl
                  const gender = res1.userInfo.gender
                  wx.getLocation({
                    type: 'wgs84',
                    success: function (res) {
                      const lat = res.latitude
                      const lng = res.longitude
                      wx.request({
                        url: api.apiUrl.url + 'upuser',
                        method: 'post',
                        data: {
                          token: wx.getStorageSync('token'),
                          username,
                          usertv,
                          gender,
                          lat,
                          lng
                        },
                        success: function (data) {
                          console.log('返回值，', data)
                          wx.reLaunch({
                            url: '/pages/index/index',
                          })
                        }
                      })
                    },
                  })
                }
              })
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },

  onSumbin() {

  },

})