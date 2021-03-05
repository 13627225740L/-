// pages/second/Vousher/Vousher.js
const api = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Vosherlist: [],

    showDialog: false,

    price: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取账户详情
    this.getAccount()
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
    //获取账户详情
    this.getAccount()
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

  // 跳转至提现页面
  toapply(e) {
    console.log(e)
    wx.navigateTo({
      url: `/pages/thrid/deposit/deposit`,
    })
  },
  //获取账户详情
  getAccount() {
    // 声明变量
    var that = this
    // 开始请求
    wx.request({
      // 接口地址
      url: api.apiUrl.url + 'sel_mytx',
      // 上传数据
      data: {
        // 上传token，习惯为123456
        token: wx.getStorageSync('token')
      },
      // 获取方式为post
      method: 'POST',
      // 请求成功
      success: function (res) {
        // 数据输出
        console.log('我的账户：', res.data)
        // 视图及数据的更新
        that.setData({
          // 此处的账户余额和充值记录为分别保存，账户余额保存到balance充值记录保存到数组itemList中
          itemList: res.data.msg,
          balance: res.data.data
        })
      },
    })
  },

  //点击充值弹出
  toRecharge(e) {
    //底部弹出视图
    let that = this;
    switch (e.currentTarget.dataset.index) {
      case '0':
        that.setData({
          showDialog: !this.data.showDialog
        });
        break;
      case '1':
        that.setData({
          showCenterDialog: !this.data.showCenterDialog
        });
        break;
    }
  },

  //关闭弹出层
  onClickdiaView: function () {
    this.setData({
      showDialog: !this.data.showDialog
    });
  },

  //获取充值金额
  getPrice(e) {
    console.log('当前输入的充值金额为：', e.detail.value)
    this.setData({
      price: e.detail.value
    })
  },

  //确认充值
  onSubmit() {
    var that = this
    const price = that.data.price
    if (price == '') {
      wx.showToast({
        title: '请输入充值金额！',
        icon: 'none',
        duration: 1500,
      })
    } else {
      wx.request({
        url: api.apiUrl.url + 'paycz',
        data: {
          token: wx.getStorageSync('token'),
          money: price
        },
        method: 'POST',
        success: function (res) {
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
              that.setData({
                showDialog: !that.data.showDialog
              })
              wx.showToast({
                title: '充值成功！',
                duration: 1500,
              })

              that.getAccount()

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
    }
  },



})