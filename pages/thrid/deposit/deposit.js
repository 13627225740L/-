// pages/thrid/deposit/deposit.js
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
    var that = this
    console.log('id：', options)

    //判断是否绑定银行卡
    wx.request({
      url: api.apiUrl.url + 'sel_tx',
      data: {
        token: wx.getStorageSync('token')
      },
      method: 'POST',
      success: function (res) {
        console.log('请求提现',res)
        if (res.data.code == 2) {
          wx.showModal({
            title: '提示！',
            content: '您暂未绑定银行卡，现在去绑定？',
            success: function (res) {
              // if (res.confirm) {
              //   console.log('点击确定了');
              //   wx.redirectTo({
              //     url: '/pages/thrid/binding-card/binding-card',
              //   })
              // } else if (res.cancel) {
              //   console.log('点击取消了');
              //   wx.navigateBack({})
              // }
            }
          })
        } else {
          var cardNum = res.data.msg[0].card
          var card = cardNum.replace(/(.{4}).*(.{4})/, '$1*** ***** ***$2');
          that.setData({
            bank: res.data.msg[0].bank,
            card,
            id: res.data.msg[0].id
          })
        }
      }
    })

    that.getBalance()
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
    //修改银行卡
    console.log('修改后的银行卡ID为：', wx.getStorageSync('card_id'))
    var that = this;
    //更换银行卡点击选择银行卡后返回选择的银行卡渲染当前页面
    if (wx.getStorageSync('card_id') != '') {
      wx.request({
        url: api.apiUrl.url + 'up_mybank',
        method: 'POST',
        data: {
          id: wx.getStorageSync('card_id'),
          'token': wx.getStorageSync('token')
        },
        success: res => {
          console.log(res.data.msg)
          wx.setStorageSync('card_id', '')
          var cardNum = res.data.msg.card
          var card = cardNum.replace(/(.{4}).*(.{4})/, '$1*** ***** ***$2');
          that.setData({
            bank: res.data.msg.bank,
            card
          });
        }
      })
    }

    that.setData({
      id: wx.getStorageSync('card_id')
    })
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

  //修改银行卡
  toMy_card(e) {
    wx.navigateTo({
      url: `/pages/thrid/my_card/my_card?type_id=1`,
    })
  },

  //获取提现金额
  getPrice(e) {
    console.log('当前输入的提现金额为：', e.detail.value)
    this.setData({
      price: e.detail.value
    })
  },


  //点击提现
  onSubmit(e) {
    var that = this
    console.log('点击提现')

    const price = that.data.price
    const id = that.data.id
    console.log('提现金额：', price)
    console.log('余额：', that.data.balance)

    if (price > that.data.balance) {
      wx.showToast({
        title: '余额不足！',
        icon: 'none',
        duration: 1000,
      })
    } else if( price < 100 ){
      wx.showToast({
        title: '最低提现100元！',
        icon: 'none',
        duration: 1000,
      })
    } else {
      wx.request({
        url: api.apiUrl.url + 'add_tx',
        data: {
          token: wx.getStorageSync('token'),
          bank_id: id,
          price,
        },
        method: 'POST',
        success: function (res) {
          console.log('申请提现返回：', res)
          if (res.data.code == 1) {
            wx.showToast({
              title: '申请提现成功！',
              duration: 1500,
            })
            setTimeout(function () {
              wx.navigateBack({

              })
            }, 1500)
          }
        },
      })
    }
  },

  //获取余额
  getBalance() {
    var that = this
    wx.request({
      url: api.apiUrl.url + 'my_yu',
      data: {
        token: wx.getStorageSync('token')
      },
      method: 'POST',
      success: function (res) {
        console.log('当前余额', res)
        that.setData({
          balance: res.data.msg
        })
      },

    })
  }
})