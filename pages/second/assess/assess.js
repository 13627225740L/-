// pages/second/assess/assess.js

const api = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 0,
    currentTabID: 0,
    index: 0,
    
    tabList: [{
      id: 0,
      name: '全部订单'
    },
    {
      id: 1,
      name: '待付款'
    },
    {
      id: 2,
      name: '待接单'
    },
    {
      id: 3,
      name: '待收货'
    },
    {
      id: 4,
      name: '待评论'
    }
    ],
    


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const currentIndex = options.id
    if (currentIndex) {
      console.log('订单状态ID', options.id)
      this.setData({
        currentIndex
      })
    }
    //获取订单
    this.allOrder()
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

  // 点击更换订单类型
  onChange(e) {
    var that = this
    console.log(e)
    const index = e.currentTarget.dataset.index
    const currentTabID = e.currentTarget.dataset.id
    that.setData({
      currentIndex: index,
      currentTabID
    });
    if (currentTabID == 0) {
      that.allOrder()
    } else if (currentTabID == 1) {
      if (that.data.payOrder == '') {
        wx.showToast({
          title:'暂无！',
          icon: 'none',
          duration: 1500,
        })
        setTimeout(function () {
          that.setData({
            currentIndex: 0,
            orderList: that.data.allOrderList
          })
        }, 1500)
      } else {
        that.setData({
          orderList: that.data.payOrder
        })
      }
    } else if (currentTabID == 2) {
      if (that.data.shipmentsOrder == '') {
        wx.showToast({
          title: '暂无！',
          icon: 'none',
          duration: 1500,
        })
        setTimeout(function () {
          that.setData({
            currentIndex: 0,
            orderList: that.data.allOrderList
          })
        }, 1500)
      } else {
        that.setData({
          orderList: that.data.shipmentsOrder
        })
      }
    } else if (currentTabID == 3) {
      if (that.data.receivingOrder == '') {
        wx.showToast({
          title: '暂无！',
          icon: 'none',
          duration: 1500,
        })
        setTimeout(function () {
          that.setData({
            currentIndex: 0,
            orderList: that.data.allOrderList
          })
        }, 1500)
      } else {
        that.setData({
          orderList: that.data.receivingOrder
        })
      }
    } else if (currentTabID == 4) {
      if (that.data.commentOrder == '') {
        wx.showToast({
          title: '暂无！',
          icon: 'none',
          duration: 1500,
        })
        setTimeout(function () {
          that.setData({
            currentIndex: 0,
            orderList: that.data.allOrderList
          })
        }, 1500)
      } else {
        that.setData({
          orderList: that.data.commentOrder
        })
      }
    } else {
      return false;
    }
  },
  allOrder() {
    var that = this
    wx.request({
      url: api.apiUrl.url + 'all_order',
      data: {
        token: wx.getStorageSync('token')
      },
      method: 'POST',
      success: function(res) {
        console.log('获取到的订单：', res)
        that.setData({
          orderList: res.data.msg,
          allOrderList: res.data.msg,
          payOrder: res.data.data1,
          shipmentsOrder: res.data.data2,
          receivingOrder: res.data.data3,
          commentOrder: res.data.data4
        })
        that.getOrderList()
      },
    })
  },
  getOrderList() {
    var that = this
    const currentIndex = that.data.currentIndex
    if (currentIndex == '') {
      // that.allOrder()
    } else if (currentIndex == 1) {
      if (that.data.payOrder == '') {
        wx.showToast({
          title: '暂无！',
          icon: 'none',
          duration: 1500,
        })
        setTimeout(function() {
          that.setData({
            currentIndex: 0,
            orderList: that.data.allOrderList
          })
        }, 1500)
      } else {
        that.setData({
          orderList: that.data.payOrder
        })
      }
    } else if (currentIndex == 2) {
      if (that.data.shipmentsOrder == '') {
        wx.showToast({
          title: '暂无！',
          icon: 'none',
          duration: 1500,
        })
        setTimeout(function () {
          that.setData({
            currentIndex: 0,
            orderList: that.data.allOrderList

          })
        }, 1500)
      } else {
        that.setData({
          orderList: that.data.shipmentsOrder
        })
      }
    } else if (currentIndex == 3) {
      if (that.data.receivingOrder == '') {
        wx.showToast({
          title: '暂无！',
          icon: 'none',
          duration: 1500,
        })
        setTimeout(function () {
          that.setData({
            currentIndex: 0,
            orderList: that.data.allOrderList
          })
        }, 1500)
      } else {
        that.setData({
          orderList: that.data.receivingOrder
        })
      }
    } else if (currentIndex == 4) {
      if (that.data.commentOrder == '') {
        wx.showToast({
          title: '暂无！',
          icon: 'none',
          duration: 1500,
        })
        setTimeout(function () {
          that.setData({
            currentIndex: 0,
            orderList: that.data.allOrderList

          })
        }, 1500)
      } else {
        that.setData({
          orderList: that.data.commentOrder
        })
      }
    } else {
      return false;
    }
  },
  // 跳转到商品详情页面
  toDetails(e) {
    console.log('点击跳转详情,携带的当前商品ID为：', e)
    const id = e.currentTarget.dataset.id
    console.log('点击商品获取到的商品id',e)
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`,
    })
  },

  quxdd(e) {
    console.log('点击了取消订单，携带id为', e.currentTarget.dataset.id)
    var that = this
    const id = e.currentTarget.dataset.id
    wx.showModal({
      content: '是否取消订单？',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: api.apiUrl.url + 'del_order',
            method: 'POST',
            data: {
              'id': id,
              token: wx.getStorageSync('token')
            },
            success: res => {
              console.log('点击取消订单返回：', res.data.code)
              if (res.data.code == 1) {
                that.allOrder()
                wx.showToast({
                  title: '取消订单成功',
                  icon: 'none',
                  duration: 1500
                })
              }
            }
          })
        } else if (res.cancel) {
          return false;
        }
      }
    })
  },
  goPay(e) {
    console.log('点击了付款，携带ordernum为', e.currentTarget.dataset.ordernum)
    const id = e.currentTarget.dataset.ordernum
    wx.navigateTo({
      url: `/pages/thrid/confirmOrder/confirmOrder?id=${id}`,
    })
  },
  remind(e) {
    console.log('点击了提醒发货，携带id为', e.currentTarget.dataset.id)
  },
  recive(e) {
    var that = this
    console.log('点击了确认发货，携带id为', e.currentTarget.dataset.id)
    const id = e.currentTarget.dataset.id
    wx.showModal({
      content: '是否确认收货？',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: api.apiUrl.url + 'up_order',
            method: 'POST',
            data: {
              'id': id,
              token: wx.getStorageSync('token')
            },
            success: res => {
              console.log('确认收货返回', res.data.code)
              if (res.data.code == 1) {
                that.allOrder()
                wx.showToast({
                  title: '确认收货成功',
                  icon: 'none',
                  duration: 1500
                })
              }
            }
          })
        } else if (res.cancel) {
          return false;
        }
      }
    })
  },
  goComment(e) {
    console.log('点击了取消订单，携带的订单id为：', e)
    var all_id = []
    all_id.push(e.currentTarget.dataset.id)
    all_id.push(e.currentTarget.dataset.s_id)
    const id = JSON.stringify(all_id)
    console.log(id)

    wx.navigateTo({
      url: `/pages/thrid/comment/comment?all_id=${id}`,
    })
  },
  _goToSomePage(url) {
    wx.navigateTo({
      url: url,
    })
  },

})