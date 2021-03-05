// pages/thrid/binding-card/binding-card.js
const api = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    cardType: '',
    name: '',
    phoneNumber: '',
    bankname: '',
    bankNumber: '',
  },
  //手机号
  getPhone: function (e) {
    this.setData({
      phoneNumber: e.detail.value
    })
  },
  // 姓名
  getName: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  // 银行卡账号
  getCardNumber: function (e) {
    console.log(e)
    this.setData({
      bankNumber: e.detail.value
    })

  },

  getTwoCardNumber(e) {
    console.log(e)
    this.setData({
      twoBankNumber: e.detail.value
    })
  },

  //所属银行
  getCardBank: function (e) {
    this.setData({
      bankName: e.detail.value
    })
  },

  //提交绑定银行卡信息
  submitInfos: function () {
    var compare = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    var that = this;
    if (that.data.name.length == 0 || that.data.phoneNumber.length == 0) {
      wx.showToast({
        title: '用户名不能为空',
        icon: 'none',
        image: '',
        duration: 1000
      })
    } else if (that.data.phoneNumber.length != 11) {
      wx.showToast({
        title: '手机号长度有误',
        icon: 'none',
        image: '',
        duration: 1000
      })
      return false;
    } else if (!compare.test(this.data.phoneNumber)) {
      wx.showToast({
        title: '请输入正确的手机号！',
        icon: 'none',
        image: '',
        duration: 1000
      })
      return false;
    } else if (!that.data.bankNumber) {
      wx.showToast({
        title: '银行卡号不能为空',
        icon: 'none',
        image: '',
        duration: 1000
      })
    } else if (that.data.twoBankNumber != that.data.bankNumber) {
      wx.showToast({
        title: '两次输入的银行卡号不一致！',
        icon: 'none',
        image: '',
        duration: 1000
      })
    } else {
      wx.request({
        url: api.apiUrl.url + 'my_bank',
        data: {
          token: wx.getStorageSync('token'),
          bank: this.data.bankName,
          card: this.data.twoBankNumber,
          bank_name: this.data.name,
          phone: this.data.phoneNumber
        },
        method: 'POST',
        success: function (res) {
          console.log('绑定银行卡返回：', res.data.code)
          if (res.data.code == 1) {
            wx.showToast({
              title: '绑定成功！',
              icon: 'none',
              duration: 1500,
            })
            setTimeout(function () {
              wx.redirectTo({
                url: '/pages/thrid/my_card/my_card',
              })
            }, 1500)
          } else if (res.data.code == 2) {
            wx.showToast({
              title: '绑定失败！',
              icon: 'none',
              duration: 1500,
            })
          } else if (res.data.code == 3) {
            wx.showToast({
              title: '该卡已绑定！请勿重复提交！',
              icon: 'none',
              duration: 1500,
            })
          }
        }
      })
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  }
})