// pages/second/my_card/my_card.js
const api = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bankList: [],
    type_id:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    if (options.type_id) {
      console.log('type_id = ', options.type_id)
      this.setData({
        type_id: options.type_id
      })
    }


    //判断是否绑定银行卡
    this.getCard()
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
    this.getCard()
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

  //是否有银行卡
  getCard() {
    var that = this
    wx.request({
      url: api.apiUrl.url + 'sel_tx',
      data: {
        token: wx.getStorageSync('token')
      },
      method: 'POST',
      success: function(res) {
        console.log(res)
        if( res.data.code == 2 ) {
          wx.showModal({
            title: '提示！',
            content: '您暂未绑定银行卡，现在去绑定？',
            success: function (res) {
              if (res.confirm) {
                console.log('点击确定了');
                wx.redirectTo({
                  url: '/pages/thrid/binding-card/binding-card',
                })
              } else if (res.cancel) {
                console.log('点击取消了');
                wx.navigateBack({})
              }
            }
          })
        } else {
          that.setData({
            bankList: res.data.msg
          })

        const bankList = res.data.msg
          // 银行卡*号
          for (let i = 0; i < bankList.length; i++ ){
            console.log(bankList[i].card)
            var bank_name = bankList[i].bank_name
            var name = bank_name.replace(/(.{1}).*(.{1})/, '$1****$2')

            var cardNumber = bankList[i].card
            var cardNum = cardNumber.replace(/(.{4}).*(.{4})/, '$1*** ***** ***$2');

            var mobile = bankList[i].phone
            var phone = mobile.replace(/(.{3}).*(.{4})/, '$1****$2');
            that.setData({
              cardNum,
              phone,
              name
            })
          }
        }
      },
    })
  },


  //设置默认银行卡
  tomore(e) {
    var that = this
    console.log(e)
    const id = e.currentTarget.dataset.id
    const stctic = e.currentTarget.dataset.stctic
    if( stctic == 0) {
      wx.showToast({
        title: '当前银行卡为默认银行卡！',
        icon:'none',
        duration:1500,
      })
    } else {
      wx.showModal({
        title: '提示！',
        content: '将当前银行卡设为默认银行卡？',
        success: function (res) {
          if (res.confirm) {
            console.log('点击确定了');
            wx.request({
              url: api.apiUrl.url + 'set_bank',
              data: {
                token: wx.getStorageSync('token'),
                id
              },
              method: 'POST',
              success: function (res) {
                console.log('设置默认银行卡返回：', res)
                if (res.data.code == 2) {

                }
                that.getCard()
              },
            })
          } else if (res.cancel) {
            console.log('点击取消了');
            return false;
          }
        }
      })
    }
  },
  //设置默认银行卡
  tomore(e) {
    var that = this
    console.log(e)
    const id = e.currentTarget.dataset.id
    const stctic = e.currentTarget.dataset.stctic
    if (stctic == 0) {
      wx.showToast({
        title: '当前银行卡为默认银行卡！',
        icon: 'none',
        duration: 1500,
      })
    } else {
      wx.showModal({
        title: '提示！',
        content: '将当前银行卡设为默认银行卡？',
        success: function (res) {
          if (res.confirm) {
            console.log('点击确定了');
            wx.request({
              url: app.baseUrl.url + 'set_bank',
              data: {
                token: wx.getStorageSync('token'),
                id
              },
              method: 'POST',
              success: function (res) {
                console.log('设置默认银行卡返回：', res)
                if (res.data.code == 2) {

                }
                that.getCard()
              },
            })
          } else if (res.cancel) {
            console.log('点击取消了');
            return false;
          }
        }
      })
    }
  },
  //添加银行卡
  towhite() {
    wx.navigateTo({
      url: '/pages/thrid/binding-card/binding-card',
    })
  },

  //返回银行卡给提现
  toReturn(e) {
    console.log(e.currentTarget.dataset.id)
    const cardId = e.currentTarget.dataset.id
    var that = this;
    if (cardId > 0) {
      wx.setStorageSync("card_id", cardId)
      wx.navigateBack({})
    }
  },
})