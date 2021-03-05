var area = require('../../../utils/area.js');


var areaInfo = []; //所有省市区县数据

var provinces = []; //省

var provinceNames = []; //省名称

var citys = []; //城市

var cityNames = []; //城市名称

var countys = []; //区县

var countyNames = []; //区县名称

var value = [0, 0, 0]; //数据位置下标

var addressList = null;

const app = getApp()

Page({



  /**

   * 页面的初始数据

   */

  data: {

    transportValues: ["收货时间不限", "周六日/节假日收货", "周一至周五收货"],

    transportIndex: 0,

    provinceIndex: 0, //省份

    cityIndex: 0, //城市

    countyIndex: 0, //区县

  },
  saveAddress: function (e) {
    if (e.detail.value.shr == '') {
      wx.showToast({
        title: '请填写收货人',
        success: 'none'
      })
      return false;
    }
    if (e.detail.value.phone == '') {
      wx.showToast({
        title: '请填手机号',
        success: 'none'
      })
      return false;
    }
    const myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!myreg.test(e.detail.value.phone)) {
      wx.showToast({
        title: '手机号码有误',
        icon: 'none',
      })
      return false;
    }
    if (e.detail.value.xxdz == '') {
      wx.showToast({
        title: '请填写详细地址',
        success: 'none'
      })
      return false;
    }
    console.log('地址：', e.detail.value.sf + ',' + e.detail.value.cs + ',' + e.detail.value.qx)
    const address = e.detail.value.sf + ',' + e.detail.value.cs + ',' + e.detail.value.qx
    wx.request({
      url: app.apiUrl.url + 'update_address',
      method: 'post',
      data: {
        id:this.data.siteInfo.id,
        names: e.detail.value.shr,
        phone: e.detail.value.phone,
        address: address,
        info: e.detail.value.xxdz,
        'token': wx.getStorageSync('token')
      },
      success: res => {
        console.log(res)
        if (res.data.code == 1) {
          wx.showToast({
            title: '修改成功',
            icon: 'none',
            duration: 1500,
            success: function () {
              setTimeout(function () {
                wx.navigateBack({
                })
              }, 1500)
            },
          })
        }
        wx.redirectTo({
          url: '/pages/thrid/address/address',
        })
        if (res.data == 0) {
          wx.showToast({
            title: '修改失败',
            success: 'none'
          })        
        }
      }
    });
  },




  /**

   * 生命周期函数--监听页面加载

   */

  onLoad: function (options) {
    //  取出缓存的收货地址信息
    wx.getStorageSync('siteInfo')
    const siteInfo = wx.getStorageSync('siteInfo')
    this.setData({
      siteInfo
    })
    console.log('获取的site缓存为：', siteInfo)

  },



  /**

   * 生命周期函数--监听页面显示

   */

  onShow: function () {

    var that = this;

    area.getAreaInfo(function (arr) {

      areaInfo = arr;

      //获取省份数据

      that.getProvinceData();

    });

  },

  // 获取省份数据

  getProvinceData: function () {

    var that = this;

    var s;

    provinces = [];

    provinceNames = [];

    var num = 0;

    for (var i = 0; i < areaInfo.length; i++) {

      s = areaInfo[i];

      if (s.di == "00" && s.xian == "00") {

        provinces[num] = s;

        provinceNames[num] = s.name;

        num++;

      }

    }

    that.setData({

      provinceNames: provinceNames

    })



    that.getCityArr();

    that.getCountyInfo();

  },



  // 获取城市数据

  getCityArr: function (count = 0) {

    var c;

    citys = [];

    cityNames = [];

    var num = 0;

    for (var i = 0; i < areaInfo.length; i++) {

      c = areaInfo[i];

      if (c.xian == "00" && c.sheng == provinces[count].sheng && c.di != "00") {

        citys[num] = c;

        cityNames[num] = c.name;

        num++;

      }

    }

    if (citys.length == 0) {

      citys[0] = {

        name: ''

      };

      cityNames[0] = {

        name: ''

      };

    }

    var that = this;

    that.setData({

      citys: citys,

      cityNames: cityNames

    })


    that.getCountyInfo(count, 0);

  },



  // 获取区县数据

  getCountyInfo: function (column0 = 0, column1 = 0) {

    var c;

    countys = [];

    countyNames = [];

    var num = 0;

    for (var i = 0; i < areaInfo.length; i++) {

      c = areaInfo[i];

      if (c.xian != "00" && c.sheng == provinces[column0].sheng && c.di == citys[column1].di) {

        countys[num] = c;

        countyNames[num] = c.name;

        num++;

      }

    }

    if (countys.length == 0) {

      countys[0] = {

        name: ''

      };

      countyNames[0] = {

        name: ''

      };

    }


    var that = this;




    that.setData({

      countys: countys,

      countyNames: countyNames,

      // value: value,

    })

  },



  bindTransportDayChange: function (e) {


    this.setData({

      transportIndex: e.detail.value

    })

  },



  bindProvinceNameChange: function (e) {

    var that = this;


    var val = e.detail.value

    that.getCityArr(val); //获取地级市数据

    that.getCountyInfo(val, 0); //获取区县数据



    value = [val, 0, 0];

    this.setData({

      provinceIndex: e.detail.value,

      cityIndex: 0,

      countyIndex: 0,

      value: value

    })



  },



  bindCityNameChange: function (e) {

    var that = this;




    var val = e.detail.value

    that.getCountyInfo(value[0], val); //获取区县数据

    value = [value[0], val, 0];

    this.setData({

      cityIndex: e.detail.value,

      countyIndex: 0,

      value: value

    })

  },



  bindCountyNameChange: function (e) {

    var that = this;


    this.setData({

      countyIndex: e.detail.value

    })

  },



  saveAddressaa: function (e) {

    var consignee = e.detail.value.consignee;

    var mobile = e.detail.value.mobile;

    var transportDay = e.detail.value.transportDay;

    var provinceName = e.detail.value.provinceName;

    var cityName = e.detail.value.cityName;

    var countyName = e.detail.value.countyName;

    var address = e.detail.value.address;






    var arr = wx.getStorageSync('addressList') || [];



    arr.push(addressList);
    wx.setStorageSync('addressList', arr);
    wx.navigateBack({

    })

  }

})