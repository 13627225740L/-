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
  saveAddress: function(e) {
    if (e.detail.value.shr == '') {
      wx.showToast({
        title: '请填写收货人',
        icon: 'none',
      })
      return false;
    }
    if (e.detail.value.phone == '') {
      wx.showToast({
        title: '请填手机号',
        icon: 'none',
      })
      return false;
    }
    const myreg = /^(((13[0-9]{1})|(16[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
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
        icon: 'none',
      })
      return false;
    }
    console.log('form发生了submit事件，携带数据为：', e.detail.value);

    console.log('地址：', e.detail.value.sf + ',' + e.detail.value.cs + ',' + e.detail.value.qx)
    
    const address = e.detail.value.sf + ',' + e.detail.value.cs + ',' + e.detail.value.qx
    console.log(address)

    wx.request({
      url: app.apiUrl.url + 'address',
      method: 'post',
      data: {
        names: e.detail.value.shr,
        phone: e.detail.value.phone,
        address: address,
        info: e.detail.value.xxdz,
        'token': wx.getStorageSync('token')
      },
      success: res => {
        console.log('获取的数据',res)
        if (res.data.code == 1) {
          wx.showToast({
            title: '添加成功',
            icon: 'none',
            duration: 1500,
            success: function() {
              setTimeout(function() {
                wx.navigateBack({})
              }, 1500)
            },
          })
        } else {
          wx.showToast({
            title: '添加失败',
            icon: 'none',
            duration: 1000,
          })
        }
      }
    });
  },




  /**

   * 生命周期函数--监听页面加载

   */

  onLoad: function(options) {
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

  onShow: function() {

    var that = this;

    area.getAreaInfo(function(arr) {

      areaInfo = arr;

      //获取省份数据

      that.getProvinceData();

    });

  },

  // 获取省份数据

  getProvinceData: function() {

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

  getCityArr: function(count = 0) {

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

    console.log('cityNames:' + cityNames);

    that.getCountyInfo(count, 0);

  },



  // 获取区县数据

  getCountyInfo: function(column0 = 0, column1 = 0) {

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

    console.log('countyNames:' + countyNames);

    var that = this;

    // value = [column0, column1, 0];



    that.setData({

      countys: countys,

      countyNames: countyNames,

      // value: value,

    })

  },



  bindTransportDayChange: function(e) {

    console.log('picker country 发生选择改变，携带值为', e.detail.value);

    this.setData({

      transportIndex: e.detail.value

    })

  },



  bindProvinceNameChange: function(e) {

    var that = this;

    console.log('picker province 发生选择改变，携带值为', e.detail.value);

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



  bindCityNameChange: function(e) {

    var that = this;

    console.log('picker city 发生选择改变，携带值为', e.detail.value);



    var val = e.detail.value

    that.getCountyInfo(value[0], val); //获取区县数据

    value = [value[0], val, 0];

    this.setData({

      cityIndex: e.detail.value,

      countyIndex: 0,

      value: value

    })

  },



  bindCountyNameChange: function(e) {

    var that = this;

    console.log('picker county 发生选择改变，携带值为', e.detail.value);

    this.setData({

      countyIndex: e.detail.value

    })

  },



  saveAddressaa: function(e) {

    var consignee = e.detail.value.consignee;

    var mobile = e.detail.value.mobile;

    var transportDay = e.detail.value.transportDay;

    var provinceName = e.detail.value.provinceName;

    var cityName = e.detail.value.cityName;

    var countyName = e.detail.value.countyName;

    var address = e.detail.value.address;



    console.log(transportDay + "," + provinceName + "," + cityName + "," + countyName + "," + address); //输出该文本 



    var arr = wx.getStorageSync('addressList') || [];

    console.log("arr,{}", arr);

    // addressList = {

    //   consignee: consignee,

    //   mobile: mobile,

    //   address: provinceName + cityName + countyName + address,

    //   transportDay: transportDay

    // }
    arr.push(addressList);
    wx.setStorageSync('addressList', arr);
    wx.navigateBack({
    })
  }

})