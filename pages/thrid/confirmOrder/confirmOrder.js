// pages/thrid/confirmOrder/confirmOrder.js
const api = getApp()
 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    payType:1,
    activeC:'',
    content:'',
    combolist:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    const d_id = options.id
    that.setData({
      d_id
    });
    
    //获取默认地址
    wx.request({
      url: api.apiUrl.url + 'sel_address',
      data: {
        token: wx.getStorageSync('token'),
      },
      method: 'POST',
      success: function (res) {
        console.log('获取地址',res.data.msg)
        if (res.data.msg == null) {
          wx.showToast({
            title: '请先填写地址',
            icon: 'none',
            duration: 1500
          })
          setTimeout(function () {
            wx.redirectTo({
              url: '/pages/thrid/add_address/add_address',
            })
          }, 2000)
        } else {
          //赋值给地址栏
          var mobile = res.data.msg.phone
          var phone = mobile.replace(/(.{3}).*(.{4})/, '$1****$2');
          that.setData({
            dd_address: res.data.msg,
            phone
          })
          console.log('地址', res.data.msg)
        }
      },
    })

    that.getOrder()
    that.getBalance()
    //计算总价
    that.totalPrices()
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


    //修改收货地址
    console.log('点击的收货地址ID为：', wx.getStorageSync('add_id'))
    var that = this;

    //计算总价
    that.totalPrices()

    //更换收货地址点击选择地址后返回选择的地址渲染当前页面
    if (wx.getStorageSync('add_id') != '') {
      wx.request({
        url: api.apiUrl.url + 'sel_address',
        method: 'POST',
        data: {
          id: wx.getStorageSync('add_id'),
          'token': wx.getStorageSync('token')
        },
        success: res => {
          wx.setStorageSync('add_id', '')
          var mobile = res.data.msg.phone
          var phone = mobile.replace(/(.{3}).*(.{4})/, '$1****$2');
          that.setData({
            dd_address: res.data.msg,
            phone
          });
        }
      })
    }

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
  //点击打赏金额
  toChange(e) {
    var that = this
    console.log(e)
    // 获取商品的id
    const id = e.currentTarget.dataset.id
    // 下标
    const activeC = e.currentTarget.dataset.index
    // 选择的打赏的字符串
    const ds_price = that.data.combolist[activeC].title
    console.log('获取的打赏', ds_price)
    // 获取打赏金额的数字
    const d_price = parseInt(ds_price.substring(1).substring(1))
    console.log('获取的打赏金额数据',d_price)
    that.setData({
      id,
      activeC,
      // 这里保存后下面可以调用
      d_price,
      // 计算总价
      zPrice: Number(this.data.price) + Number(d_price)  
    })
  },

  // 修改收货地址
  xgdz: function (e) {
    wx.navigateTo({
      url: '/pages/thrid/address/address?id=1',
    })
  },
  //选择支付方式
  goPay(e) {
    //底部弹出视图
    let that = this
    // console.log('打赏===', that.data.d_price)
    const d_price = that.data.d_price
    if (d_price < 1 ) {
      wx.showToast({
        title: '最低打赏默认为1元！',
        icon: 'none',
        duration: 800,
      })
    } else {
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
    }
  },
  onClickdiaView: function () {
    this.setData({
      showDialog: !this.data.showDialog
    });
  },
  radioChange(e) {
    console.log(e)
    console.log('当前选择的值为：', e.detail.value)
    this.setData({
      payType: e.detail.value
    })
  },
  //获取订单详情
  getOrder() {
    var that = this
    const d_id = that.data.d_id
    wx.request({
      url: api.apiUrl.url + 'sel_order',
      data: {
        'token': wx.getStorageSync('token'),
        'id': d_id
      },
      method: 'POST',
      success: function(res){
        console.log('当前获取的订单列表', res.data.msg)

        const ds_price = res.data.msg[0].list[0].title
        console.log('获取的打赏', ds_price)
        const d_price = parseInt(ds_price.substring(1).substring(1))
        console.log('获取的打赏金额', d_price)

        that.setData({
          items: res.data.msg,
          price: res.data.data.price,
          combolist: res.data.msg[0].list,

          d_price
        })
      that.totalPrices()
      }
    })
  },

  // //获取余额
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
  },

  // //获取买家留言
  getContent(e) {
    var that = this
    console.log(e)
    that.setData({
      content: e.detail.value
    })
  },

   //确认购买
  goBuy(e) {
    var that = this
    console.log('点击购买弹出',e)
    const address_id = that.data.dd_address.id
    const totalPrice = that.data.zPrice
    const balance = that.data.balance
    const content = that.data.content
    const payType = that.data.payType
    const d_id = that.data.d_id

    const d_price = that.data.d_price

    if (payType == 1) {
      console.log('余额：', balance)
      console.log('订单总金额：', totalPrice)
      if (balance < totalPrice) {
        wx.showToast({
          title: "您的余额不足",
          icon: "none",
          duration: 2000
        });
      } else {
        wx.request({
          url: api.apiUrl.url + 'go_yu',
          data: {
            token: wx.getStorageSync('token'),
            id: d_id,
            address_id,
            info: content,
            d_price
          },
          method: 'POST',
          success: function (res) {
            console.log('余额支付返回：', res.data)
            if (res.data.code == 1) {
              wx.showToast({
                title: '支付成功！即将跳转至我的订单。',
                icon: 'none',
                duration: 2000,
                success: function (res) {
                  setTimeout(function () {
                    wx.redirectTo({
                      url: '/pages/second/assess/assess',
                    })
                  }, 2000)
                },
              })
            } else if (res.data.code == 2) {
              wx.showToast({
                title: '支付失败！',
                icon: 'none',
                duration: 2000,
              })
            } else if (res.data.code == 3) {
              wx.showToast({
                title: '余额不足！',
                icon: 'none',
                duration: 2000,
              })
            }
          },
        })
      }
    } else if (payType == 2) {
      wx.request({
        url: api.apiUrl.url + 'pay',
        data: {
          token: wx.getStorageSync('token'),
          id: d_id,
          address_id,
          info: content,
          d_price,
        },
        method: 'POST',
        success: function (res) {
          console.log('发起微信支付：', res.data)
          const data = res.data;
          const timeStamp = res.data.timeStamp;
          const nonceStr = res.data.nonceStr;
          const wxpackage = res.data.package;
          const signType = res.data.signType;
          const paySign = res.data.paySign;
          wx.requestPayment({
            timeStamp: timeStamp,
            nonceStr: nonceStr,
            package: wxpackage,
            signType: signType,
            paySign: paySign,
            success: function (res) {
              wx.showToast({
                title: '支付成功!即将跳转至我的订单~',
                icon: 'none',
                duration: 3000,
                success: function () {
                  that.setData({
                    showDialog: !that.data.showDialog
                  });
                  setTimeout(function () {
                    wx.switchTab({
                      url: '/pages/second/assess/assess',
                    })
                  }, 2000)
                },
              })
            },
            fail: function (res) {
              console.log("支付失败")
              wx.showToast({
                title: '支付失败',
                icon: 'none',
              });
              that.setData({
                showDialog: !that.data.showDialog
              });
            },
          })
        },
      })
    }
  },

  //计算总价
  totalPrices(){
    var that = this
    const zPrice = Number(that.data.price) + Number(that.data.d_price)
    that.setData({
      zPrice
    })
  },
})