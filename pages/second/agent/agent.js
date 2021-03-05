// pages/second/agent/agent.js
const api = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    //获取区域
    wx.request({
      url: api.apiUrl.url + 'sel_quyu',
      method: 'POST',
      success: function (res) {
        console.log('获取的区域：', res.data)
        that.setData({
          image: res.data.data,
          siteList: res.data.msg
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
  //获取姓名
  getName(e) {
    var that = this
    const names = e.detail.value
    // console.log(names)
    that.setData({
      names
    })
  },

  // //获取身份证
  getIDcard(e) {
    var that = this
    const idcard = e.detail.value
    // console.log(idcard)
    that.setData({
      idcard
    })
  },


  // //获取手机号码
  getMobile(e) {
    var that = this
    const mobile = e.detail.value
    // console.log(mobile)
    that.setData({
      phone: mobile
    })
  },


  // //获取申请理由
  getReason(e) {
    var that = this
    const reason = e.detail.value
    // console.log(reason)
    that.setData({
      info: reason
    })
  },

  //获取区域
  siteChange(e) {
    var that = this
    const index = e.detail.value
    console.log(that.data.siteList[index].title)
    const siteTitle = that.data.siteList[index].title
    that.setData({
      index,
      siteTitle
    })
  },


  // 提交申请
  onSubmit(e) {
    var that = this
    const names = that.data.names
    const idcard = that.data.idcard
    const phone = that.data.phone
    const info = that.data.info
    const title = that.data.siteTitle

    var idCardNum = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
    var mobile = /^(((13[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;

    if (!idCardNum.test(idcard)) {
      wx.showToast({
        title: '身份证号码有误',
        duration: 2000,
        icon: 'none'
      });
      return false;
    } else if (names == '') {
      wx.showToast({
        title: '请输入姓名！',
        icon: 'none',
        duration: 1000,
      });
      return false;
    } else if (idcard == '') {
      wx.showToast({
        title: '请输入身份证号！',
        icon: 'none',
        duration: 1000,
      });
      return false;
    } else if (!mobile.test(phone)) {
      wx.showToast({
        title: '手机号有误！',
        icon: 'none'
      })
      return false;
    } else {
      //提交资料给后台
      wx.request({
        url: api.apiUrl.url + 'add_quyu',
        data: {
          token: wx.getStorageSync('token'),
          names,
          idcard,
          phone,
          info,
          title
        },
        method: 'POST',
        success: function (res) {
          console.log('提交申请返回： ', res.data)
          if (res.data.code == 1) {
            wx.showToast({
              title: '提交成功！',
              icon: 'none',
              duration: 1500,
              success: function () {
                setTimeout(function () {
                  wx.navigateBack({})
                }, 1500)
              }
            })
          } else {
            wx.showToast({
              title: '提交失败',
              icon: 'none',
              duration: 1000,
            })
          }
        },
      })
    }
  },
})