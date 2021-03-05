// pages/second/attestation/attestation.js
const app = getApp()
var WxParse = require('../../../utils/wxParse/wxParse.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    image1: '',
    image2: '',
    pics: [],

    showDialog: false,


    status: 0,
    idCard: '',
    name: '',

    classify: '男',
    select: '1',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log(that.data)
    //获取个人信息
    this.getMyInfo()

    //获取页面高度
    wx.getSystemInfo({
      success(res) {
        that.setData({
          pageHeight: res.windowHeight * 2
        })
      }
    })

    //获取顶部海报
    wx.request({
      url: app.apiUrl.url + 'sel_renzheng',
      method: 'POST',
      success: function (res) {
        console.log(res)
        const article = res.data.data1
        WxParse.wxParse('article', 'html', article, that, 5);
        that.setData({
          image: res.data.data,
          articleName: res.data.data2
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

  //获取个人信息
  getMyInfo() {
    var that = this
    wx.request({
      url: app.apiUrl.url + 'my',
      data: {
        token: wx.getStorageSync('token')
      },
      method: 'POST',
      success: function (res) {
        console.log('获取到的个人信息为：', res.data)
        that.setData({
          mose: res.data.mose,
        })
      },
    })
  },

  //点击弹出
  getOwnerInfo(e) {
    //底部弹出视图
    let that = this;
    switch (e.currentTarget.dataset.index) {
      case '0':
        that.setData({
          showDialog: !this.data.showDialog
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

  /**
   * 上传图片/视频
   */
  // 正面
  gotoShow1() {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        console.log(res)
        const image1 = res.tempFilePaths
        that.setData({
          image1
        })
      }
    })
  },

  /**
   * 预览图片
   */
  previewImage1: function (e) {
    const current = e.target.dataset.src;
    wx.previewImage({
      current: current,
      urls: this.data.image1
    })
  },

  //删除图片
  delImage1: function (e) {
    const that = this;
    const image1 = that.data.image1;
    wx.showModal({
      title: '提示',
      content: '确定要删除此图片吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('点击确定了');
          that.setData({
            image1: '',
          })
        } else if (res.cancel) {
          console.log('点击取消了');
          return false;
        }
      }
    })
  },

  //反面
  gotoShow2() {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        console.log(res)
        const image2 = res.tempFilePaths
        that.setData({
          image2
        })
      }
    })
  },

  /**
   * 预览图片
   */
  previewImage2: function (e) {
    const current = e.target.dataset.src;
    wx.previewImage({
      current: current,
      urls: this.data.image2
    })
  },

  //删除图片
  delImage2: function (e) {
    const that = this;
    const image2 = that.data.image2;
    wx.showModal({
      title: '提示',
      content: '确定要删除此图片吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('点击确定了');
          that.setData({
            image2: '',
          })
        } else if (res.cancel) {
          console.log('点击取消了');
          return false;
        }
      }
    })
  },


  //点击选中
  checkedChange(e) {
    const status = this.data.status
    if (status == 0) {
      this.setData({
        status: 1,
      })
    } else {
      this.setData({
        status: 0,
      })
    }
  },

  //获取名字
  getName(e) {
    var that = this
    const name = e.detail.value
    that.setData({
      name
    })
  },

  //获取性别
  getClassify(e) {
    console.log(e)
    const classify = e.detail.value
    // const select = e.currentTarget.dataset.select
    this.setData({
      classify,
      // select
    })
    console.log('男女？', this.data.classify)
  },

  //获取身份证号
  getIdCard(e) {
    var that = this
    const idCard = e.detail.value
    that.setData({
      idCard
    })
  },

  //获取手机号码
  getMobile(e) {
    var that = this
    const mobile = e.detail.value
    that.setData({
      mobile
    })
  },

  //提交
  toAttestation(e) {
    var that = this
    var isID = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!isID.test(that.data.idCard)) {
      wx.showToast({
        title: '身份证号码有误',
        duration: 2000,
        icon: 'none'
      });
      return false;
    } else if (!myreg.test(that.data.mobile)) {
      wx.showToast({
        title: '手机号码有误',
        duration: 2000,
        icon: 'none'
      });
      return false;
    } else if (that.data.name == '') {
      wx.showToast({
        title: '请输入姓名！',
        icon: 'none',
        duration: 1000,
      });
      return false;
    } else if (that.data.idCard == '') {
      wx.showToast({
        title: '请输入身份证号！',
        icon: 'none',
        duration: 1000,
      });
      return false;
    } else if (that.data.status == 0) {
      wx.showToast({
        title: '请阅读协议并点击确认按钮！',
        icon: 'none',
        duration: 1000,
      });
      return false;
    } else {
      var imageList = []
      imageList.push(that.data.image1[0])
      imageList.push(that.data.image2[0])
      console.log(imageList)

      that.uploadimg({
        url: app.apiUrl.url + 'upload_insert',
        path: imageList
      })
    }
  },

  //多图执行上传
  uploadimg: function (data) {
    var that = this,
      i = data.i ? data.i : 0, //当前上传的哪张图片
      success = data.success ? data.success : 0, //上传成功的个数
      fail = data.fail ? data.fail : 0; //上传失败的个数
    wx.uploadFile({
      url: data.url,
      filePath: data.path[i],
      name: 'file', //这里根据自己的实际情况改
      success(res) {
        console.log(res.data)
        success++; //图片上传成功，图片上传成功的变量+1
        //这里可能有BUG，失败也会执行这里,所以这里应该是后台返回过来的状态码为成功时，这里的success才+1
        var data = res.data;
        that.setData({
          pics: that.data.pics.concat(data)
        })

      },
      fail: (res) => {
        fail++; //图片上传失败，图片上传失败的变量+1
        //  console.log('fail:'+i+"fail:"+fail);
      },
      complete: () => {
        //  console.log(i);
        i++; //这个图片执行完上传后，开始上传下一张
        if (i == data.path.length) { //当图片传完时，停止调用 
          wx.hideLoading()
          console.log('执行完毕');
          console.log('成功：' + success + " 失败：" + fail);
          //上传完毕后执行提交
          that.onSubmit()

        } else { //若图片还没有传完，则继续调用函数
          //  console.log(i);
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.uploadimg(data);
        }
      }
    });
  },

  onSubmit() {
    var that = this
    const names = that.data.name
    const idcard = that.data.idCard
    const phone = that.data.mobile
    const sex = that.data.classify
    const images = that.data.pics
    wx.request({
      url: app.apiUrl.url + 'add_renzheng',
      data: {
        token: wx.getStorageSync('token'),
        idcard,
        phone,
        sex,
        names,
        images
      },
      method: 'POST',
      success: function (res) {
        console.log('提交', res)
        if (res.data.code == 1) {
          wx.showToast({
            title: '提交成功！',
            icon: 'none',
            duration: 1000,
          })
          setTimeout(function(){
            wx.switchTab({
              url: '/pages/myself/myself',
            })
          },1000)
        } else {
          wx.showToast({
            title: '提交失败！',
            icon: 'none',
            duration: 1000,
          })
        }
      },
    })
  },

})