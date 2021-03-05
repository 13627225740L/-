/// pages/third/goodsDetails/goodsDetails.js
const api = getApp()
// 引用富文本
const WxParse = require('../../utils/wxParse/wxParse.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentTabID: 1,
    num: 1,
    sizeList: [],
    one_1: '',//点亮的星星数
    two_1: '',//没有点亮的星星数
    // 商品评价
    reviewsList: [],
    
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取轮播图
    var that = this
    // 输出id
    console.log('点击商品的id：', options.id)
    // 获取点击商品的id
    const id = options.id
    that.setData({
      s_id: id
    })
    wx.request({
      url: api.apiUrl.url + 'sel_shping',
      // 需要传值
      data: {
        id,
      },
      method: 'POST',
      success: function (res) {
        console.log('获取到得商品', res)
        // 这里解析富文本
        var article = res.data.msg.datile;
        WxParse.wxParse('article', 'html', article, that, 5);

        that.setData({
          goodsList: res.data.msg,
          gui_price: res.data.msg.price,
          reviewsList: res.data.msg.list,
          imageList: res.data.msg.shping_image,
          sizeList: res.data.msg.goods_option
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
  // 返回首页
  goindex(e) {
    console.log('返回首页', e)
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  // 
  tomore(e) {
    console.log('跳转至商品的评论部分', e)
    const id = this.data.s_id
    wx.navigateTo({
      url: `/pages/thrid/more_comment/more_comment?id=${id}`,
    })
  },
  
  //关闭弹出层
  closeShow: function () {
    this.setData({
      showTo: 1
    })
  },

  // 弹出层的规格点击事件
  choosenorms(e) {
    var that = this
    console.log('选择规格', e)
    console.log('data', that.data)
    //点击改变样式
    that.setData({
      gui_price: e.currentTarget.dataset.price,
      gg_xz: e.currentTarget.dataset.xz,
      gui: e.currentTarget.dataset.id
    })
  },


  onSwitchTab(e) {
    const currentTabID = e.currentTarget.dataset.id
    this.setData({
      currentTabID
    })
    // console.log(this.data)
  },
  /* 点击减号 */
  bindMinus: function () {
    var num = this.data.num;
    // 如果大于1时，才可以减
    if (num > 1) {
      num--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    // 将数值与状态写回
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },

  /* 点击加号 */
  bindPlus: function () {
    var num = this.data.num;
    // 不作过多考虑自增1
    num++;
    // 只有大于一件的时候，才能normal状态，否则disable状态
    var minusStatus = num < 1 ? 'disabled' : 'normal';
    // 将数值与状态写回
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },
  /* 输入框事件 */
  bindManual: function (e) {
    if (!(/^[0-9]*$/.test(e.detail.value))) {
      wx.showToast({
        title: '只能输入数字',
        duration: 2000,
        icon: 'none'
      });
      // 将数值与状态写回
      this.setData({
        num: '1'
      });
      return false;
    }
  },

  // 立即购买
  goBuy: function () {
    this.setData({
      showTo: 0
    })
  },

  // 提交订单
  submitOrder() {
    var that = this
    // console.log('点击了立即购买',this.data)
    console.log('商品ID为：', that.data.s_id)
    console.log('规格ID为：', that.data.gui)
    console.log('商品数量为：', that.data.num)
    // 商品ID
    const s_id = that.data.s_id
    // 规格ID
    const gui = that.data.gui
    // 商品数量
    const sum = that.data.num
    if (that.data.sizeList != '' && !gui) {
      wx.showToast({
        title: '请选择商品规格！',
        icon: 'none',
        duration: 1000,
      })
    } else {
      //判断是否有收货地址
      wx.request({
        url: api.apiUrl.url + 'sel_address',
        method: 'POST',
        data: {
          'token': wx.getStorageSync('token')
        },
        success: res => {
          console.log(res)
          if (res.data.msg != '') {
            wx.request({
              url: api.apiUrl.url + 'strat_shping',
              data: {
                token: wx.getStorageSync('token'),
                s_id,
                sum,
                gui,
              },
              method: 'POST',
              success: function (res) {
                console.log('提交返回', res)

                const id = res.data.msg
                // wx.setStorageSync('buyList', res.data)
                wx.navigateTo({
                  url: `/pages/thrid/confirmOrder/confirmOrder?id=${id}`
                })
              },
            })
          } else {
            wx.showModal({
              title: '当前无默认收货地址',
              content: '是否从现在添加收货地址？',
              success: function (res) {
                if (res.confirm) {
                  console.log('点击确定了');
                  wx.navigateTo({
                    url: "/pages/thrid/add_address/add_address",
                  })
                } else if (res.cancel) {
                  console.log('点击取消了');
                  return false;
                }
              }
            })
          }
        }
      })
      that.setData({
        showTo: 1
      })
    }
  }
})