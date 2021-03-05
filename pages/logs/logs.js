// pages/logs/logs.js
const api = getApp()
Page({
  /**
   * 页面的初始数据
   */

  data: {
    indx: 0,
    change: 0,
    page: 0,
    hiddenname: false,
    noticeList: [],
    itemList: [],
    textlist: [],
    orderList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    //判断是否认证送餐员
    that.judge()

    // 获取订单列表
    that.getRecept()
    // 获取公告
    that.gettextlist()

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

    var that = this;
    //判断是否认证送餐员
    that.judge()
    //公告滚动
    that.gettextlist()
    //刷新抢单列表
    that.Renovate()
    // 获取订单列表
    that.getRecept()
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
    // 开始下拉刷新
    this.onLoad()
    // 停止下拉动作
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    // 显示加载图标
    wx.showLoading({
      title: '加载中...',
    })
    // 页数+1
    that.setData({
      page: that.data.page + 1
    })
    const page = that.data.page
    wx.request({
      url: api.apiUrl.url + 'receipt?page=' + page,
      data: {
        token: wx.getStorageSync('token')
      },
      method: "POST",
      success: function (res) {
        // 回调函数
        var order_list = that.data.orderList;
        console.log(res)
        for (var i = 0; i < res.data.msg.length; i++) {
          order_list.push(res.data.msg[i]);
        }
        // 设置数据
        that.setData({
          orderList: that.data.orderList
        })
        // 隐藏加载框
        wx.hideLoading();
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // 点击气泡
  tohidden: function (e) {
    console.log(e.currentTarget.dataset.value)
    const idx = e.currentTarget.dataset.value
    this.setData({
      value: idx,
      // 打赏金额
      price: this.data.itemList[idx].d_price,
      // 性别
      gender: this.data.itemList[idx].sex,
      // site是地址，但因前面的详细地址使用了info
      site: this.data.itemList[idx].address,
      // 下方的公告栏
      centerList: this.data.itemList[idx]
    })
  },
  
  //点击刷新按钮
  toRenovate(e) {
    var that = this
    // 制作提示
    wx.showLoading({
      title: '加载中...',
    })
    // 设置页数+1
    that.setData({
      change: that.data.change + 1
    })
    // 获取
    const change = that.data.change
    // 请求（接口制作拼接）
    wx.request({
      url: api.apiUrl.url + 'new_receiver?page=' + change,
      data: {
        token: wx.getStorageSync('token')
      },
      method: "POST",
      success: function (res) {
        // 判断
        if (res.data.msg != '') {
          // 回调函数
          const itemList = res.data.msg
          console.log(res)
          // 设置数据
          that.setData({
            itemList
          })
        } else {
          wx.showLoading({
            title: '暂无更多数据',
          })
        }
        // 隐藏加载框
        wx.hideLoading();
      }
    })
  },
  //获取订单列表
  getRecept() {
    var that = this
    wx.request({
      url: api.apiUrl.url + 'receipt',
      data: {
        'token': wx.getStorageSync('token'),
      },
      method: 'POST',
      success: function (res) {
        console.log("请求的订单列表", res)
        that.setData({
          orderList: res.data.msg,
        })
      },
    })
  },
  // 获取公告
  gettextlist(e) {
    var that = this
    wx.request({
      url: api.apiUrl.url + 'notices',
      method: 'POST',
      success: function (res) {
        console.log('获取的公告', res)
        that.setData({
          noticeList: res.data.msg
        })
      },
    })
  },
  // 抢单
  Renovate(e) {
    var that = this
    wx.request({
      url: api.apiUrl.url + 'new_receiver',
      data:{
        token:wx.getStorageSync('token')
      },
      method: 'POST',
      success: function (res) {
        console.log('抢单列表', res)
        that.setData({
          itemList: res.data.msg,
        })
      },
    })
  },
  //点击抢单
  getOrder(e) {
    var that = this
    const id = e.currentTarget.dataset.id
    console.log(id)
    wx.showModal({
      title: '提示',
      content: '是否选择配送本单？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.request({
            url: api.apiUrl.url + 'update_receiver',
            data: {
              'token': wx.getStorageSync('token'),
              id,
            },
            method: 'POST',
            success: function (res) {
              console.log('点击抢单返回', res)
              if (res.data.code == 1) {
                wx.showToast({
                  title: '抢单成功！',
                  duration: 1000,
                })
                //刷新抢单列表
                that.Renovate()
                // 获取订单列表
                that.getRecept()
              } else {
                wx.showToast({
                  title: '抢单失败！',
                  icon:'none',
                  duration: 1000,
                }) 
              }
            },
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //跳转至订单详情
  toDetail(e) {
    console.log(e)
    const id = e.currentTarget.dataset.id
    var that = this
    wx.navigateTo({
      url: '/pages/thrid/Purchasing-details/Purchasing-details?id=' + id + "&stctic=" + 0,
    })
  },

  //判断是否是送餐员
  judge() {
    var that = this
    wx.request({
      url: api.apiUrl.url + 'my',
      data: {
        token: wx.getStorageSync('token')
      },
      method: 'POST',
      success: function (res) {
        console.log('是否为送餐员？0：不是，1：是：', res.data.msg.type)
        const type = res.data.msg.type
        if (type == 0) {
          wx.showModal({
            title: '提示',
            content: '送餐功能仅认证送餐员后可使用，您当前未认证送餐员或还在审核中，是否现在去认证？',
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
                wx.navigateTo({
                  url: '/pages/second/atterstion/atterstion',
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
                wx.switchTab({
                  url: '/pages/myself/myself',
                });
              }
            }
          })
        }
      },
    })
  },
})