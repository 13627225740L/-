// pages/second/comment/comment.js
const api = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    imagsList: [],
    imags: [],
    pics: [],


    flag: 0,
    noteMaxLen: 140, // 最多放多少字
    info: "",
    noteNowLen: 0, //备注当前字数
    
    one_2: 0, //点亮的星星数
    two_2: 5 //没有点亮的星星数
  },


  in_xin: function(e) {
    var in_xin = e.currentTarget.dataset.in;
    console.log(e.currentTarget.dataset.in);
    console.log(e.currentTarget);
    var one_2;
    if (in_xin == 'star') {
      one_2 = Number(e.currentTarget.id)
    } else {
      one_2 = Number(e.currentTarget.id) + this.data.one_2
    }
    if( one_2 >=5 ) {
      this.setData({
        one_2:5,
        two_2: 0,
      })
    } else {
      this.setData({
        one_2: one_2,
        two_2: 5 - one_2
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    wx.showLoading({
      title: '加载中...',
    })
    console.log('是否有ID，ID为:', options)
    var all_id = JSON.parse(options.all_id)
    console.log('商品ID为：', all_id[1])
    console.log('订单ID为：',all_id[0])
    const s_id = all_id[1]
    const id = all_id[0]
    that.setData({
      s_id,
      id
    });


    //获取订单详情
    wx.request({
      url: api.apiUrl.url + 'sel_shping',
      method: 'POST',
      data: {
        'id': s_id,
        'token': wx.getStorageSync('token')
      },
      success: res => {
        console.log('订单详情', res.data.msg)
        that.setData({
          commentList: res.data.msg
        })
      }
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 1000)
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

  // 监听字数
  bindTextAreaChange: function(e) {
    var that = this
    console.log('输入为：', e.detail.value)
    var value = e.detail.value,
      len = parseInt(value.length);
    if (len > that.data.noteMaxLen)
      return;
    that.setData({
      info: value,
      noteNowLen: len
    })

  },
  // 提交清空当前值
  bindSubmit: function() {
    var that = this;


    const id = that.data.id
    const s_id = that.data.s_id

    // console.log('43242', that.data.imagsList)
    if (that.data.imagsList != '') {
      var pics1 = that.data.imagsList
      that.uploadimg({
        url: api.apiUrl.url + 'upload_insert',
        path: that.data.imagsList
      })
    }
    setTimeout(function() {

      if (that.data.one_2 != '' || that.data.info != '' || that.data.pics != '') {
        wx.request({
          url: api.apiUrl.url + 'add_ping',
          data: {
            token: wx.getStorageSync('token'),
            id,
            s_id,
            sume: that.data.one_2,
            info: that.data.info,
            images: that.data.pics
          },
          method: 'POST',
          success: function(res) {
            console.log(res)
            if (res.data.code = 1) {
              wx.showToast({
                title: '发布成功',
                icon: 'success',
                duration: 1500,
              })
              setTimeout(function() {
                wx.switchTab({
                  url: '/pages/myself/myself',
                })
              }, 1500)
            }
          },
        })
      } else {
        wx.showToast({
          title: '请输入内容！',
          icon: 'none',
          duration: 1500
        })
      }
    }, 1000)
  },
  changeColor1: function() {
    var that = this;
    that.setData({
      flag: 1
    });
  },
  changeColor2: function() {
    var that = this;
    that.setData({
      flag: 2
    });
  },
  changeColor3: function() {
    var that = this;
    that.setData({
      flag: 3
    });
  },
  changeColor4: function() {
    var that = this;
    that.setData({
      flag: 4
    });
  },
  changeColor5: function() {
    var that = this;
    that.setData({
      flag: 5
    });
  },



  // 上传图片
  gotoShow() {
    var that = this
    wx.chooseImage({
      count: 6, 
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'], 
      success: (res) => {
        const tempFilePaths = res.tempFilePaths
        const imags = that.data.imags
        for (let i = 0; i < tempFilePaths.length; i++) {
          if (imags.length >= 6) {
            this.setData({
              imags: imags
            });
            return false;
          } else {
            imags.push(tempFilePaths[i]);
          }
        }
        console.log(imags)
        that.setData({
          imagsList: imags
        });
      },
    })
  },
  uploadimg: function(data) {
    var that = this,
      i = data.i ? data.i : 0, 
      success = data.success ? data.success : 0, 
      fail = data.fail ? data.fail : 0; 
    wx.uploadFile({
      url: data.url,
      filePath: data.path[i],
      name: 'file', 
      success(res) {
        console.log(res.data)
        success++; 
        var data = res.data;
        that.setData({
          pics: that.data.pics.concat(data)
        })
      },
      fail: (res) => {
        fail++; 
      },
      complete: () => {
        
        i++;
        if (i == data.path.length) {  
          wx.hideLoading()
          console.log('执行完毕');
          console.log('成功：' + success + " 失败：" + fail);
        } else { 
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.uploadimg(data);
        }
      }
    });
  },

  /**
   * 预览图片
   */
  previewImage: function(e) {
    const current = e.target.dataset.src;
    wx.previewImage({
      current: current,
      urls: this.data.imagsList
    })
  },

  //长按删图片
  delText: function(e) {
    const that = this;
    const imagsList = that.data.imagsList;
    const imags = that.data.imags;
    const index = e.currentTarget.dataset.index; //获取当前长按图片下标
    var pp = that.data.pics;
    wx.showModal({
      title: '提示',
      content: '确定要删除此图片吗？',
      success: function(res) {
        if (res.confirm) {
          console.log('点击确定了');
          imags.splice(index, 1);
          imagsList.splice(index, 1);
          pp.splice(index, 1)
        } else if (res.cancel) {
          console.log('点击取消了');
          return false;
        }
        that.setData({
          imagsList,
          pics: pp
        });
      }
    })
  },
})