// pages/thrid/Distributiondetails/Distributiondetails.js
const api = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentIndex:0,
    currentTabID: 0,
    index: 0,
    tabList: [
      {
        id: 0,
        name: '全部订单'
      }, {
        id: 1,
        name: '待购取'
      }, {
        id: 2,
        name: '待配送'
      }, {
        id: 3,
        name: '已完成'
      },
    ],
    orderList:[],
    goodslist:[],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断订单的详情
    const currentIndex = options.id
    if (currentIndex) {
      console.log('订单状态ID', options.id)
      this.setData({
        currentIndex
      })
    }
    var that = this
    // 获取商品的详情
    that.getallOrder()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (){

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    // 获取商品的详情
    this.getallOrder()
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
    this.onLoad()
    wx.hideLoading();
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

  //跳转至详情界面
  toDetils(e) {
    console.log(e)
    const id = e.currentTarget.dataset.pay_id
    var that = this
    wx.navigateTo({
      // 点击事件处的data-id已有,后面的1是状态
      url: '/pages/thrid/order_detail/order_detail?id=' + id + "&stctic=" + 1,
    })
  },
  
  // 顶部导航栏的切换
  onChange(e) {
    var that = this
    console.log(e)
    const index = e.currentTarget.dataset.index
    const currentTabID = e.currentTarget.dataset.id
    that.setData({
      currentIndex: index,
      currentTabID
    });
    // 当为0时,执行that.allOrder
    if (currentTabID == 0){
        that.setData({
          orderList:that.data.allOrderList
        })
    } //不然当为1时
    else if (currentTabID == 1){
      if(that.data.payOrder == ''){
        wx.showToast({
          // 提示
          title: '暂无',
          // 图标
          icon:'none',
          // 展示时间
          duration:1500,
        })
        // 制作定时器
        setTimeout( function(){
          that.setData({
           currentIndex: 0,
            orderList: that.data.allOrderList,
         })
        //  定时器的时间
        }, 1500)
      }else{
        that.setData({
          orderList:that.data.payOrder
        })
      }
    } else if (currentTabID == 2){
      if (that.data.shipmentsOrder== ''){
          wx.showToast({
            title: '暂无',
            icon: 'none',
            duration: 1500,
          })
          setTimeout(function(){
            that.setData({
            currentIndex:0,
              orderList: that.data.allOrderList
            })
          }, 1500)
      }else{
        orderList: that.data.shipmentsOrder
      }
    } else if (currentTabID == 3){
      if (that.data.receivingOrder == ''){
        wx.showToast({
          title: '暂无',
          icon: 'none',
          duration:1500,
        })
          setTimeout(function(){
            that.setData({
            currentIndex:0,
              orderList:that.data.allOrderList
            })
          },1500)
      }else{
        orderList: that.data.receivingOrder
      }
    }
  },
  // 获取配送单
  getallOrder(e){
    var that = this
    wx.request({
      url: api.apiUrl.url + 'my_receiver',
      data: {
        token: wx.getStorageSync('token'),
        // id,
      },
      method: 'POST',
      success: function (res) {
        console.log('获取我的配送单', res)
        that.setData({
          // 循环数组
          orderList: res.data.msg,
          // 全部订单
          allOrderList:res.data.msg,
          // 代购取
          payOrder: res.data.data2,
          // 待配送
          shipmentsOrder: res.data.data3,
          // 已完成
          receivingOrder: res.data.data4,
        })
      },
    })
  },
})