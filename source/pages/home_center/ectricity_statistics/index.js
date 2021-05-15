// pages/home_center/ectricity_statistics/index.js
import {
  allType,
  total,
  statisticByHour,
  statisticByDay,
  statisticByWeek,
  statisticByMonth,
  statisticTheDay
} from '../../../utils/api/statistics-api'
import wxMqtt from '../../../utils/mqtt/wxMqtt'
import wxCharts from '../../../components/wx-charts/wxcharts'

var lineChart = null;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedIndex:1
  },

   getFormatDate:function(date) {
    var  seperator1 =  "" ;
    var  month = date.getMonth() + 1;
    var  strDate = date.getDate();
    if  (month >= 1 && month <= 9) {
        month =  "0"  + month;
    }
    if  (strDate >= 0 && strDate <= 9) {
        strDate =  "0"  + strDate;
    }
    var  currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
    return  currentdate;
},
getFormatYearMonth:function(date) {
  var  seperator1 =  "" ;
  var  month = date.getMonth() + 1;
  var  strDate = date.getDate();
  if  (month >= 1 && month <= 9) {
      month =  "0"  + month;
  }

  var  currentdate = date.getFullYear() + seperator1 + month;
  return  currentdate;
},




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const {
      device_icon,
      device_name,
      device_id
    } = options
    this.setData({
      device_icon_full: `https://images.tuyacn.com/${device_icon}`,
      device_name,
      device_id
    })

    console.log(options)
    this.setData({
      device_id: options['device_id'],
      device_name: options['device_name'],
      device_icon: options['device_icon']
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
 

  drawChart:async function(value){
    var windowWidth = 320;
    var windowHeight=300;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
      windowHeight=150
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    if(value==1){
      var simulationData = await this.createSimulationData();
      lineChart =this.createChart('currentLineCanvas',simulationData,'日期',windowWidth,windowHeight)
    }
    else if(value==2){
      var monthData = await this.getMonthData();
      lineChart =this.createChart('currentLineCanvas',monthData,'月用电量',windowWidth,windowHeight)
    }
  },
  selectedTypeChanged:async function(e){
    this.setData({
      selectedIndex:e.detail.value
    })
    await this.drawChart(e.detail.value);
   
  },

  touchHandler:function (e) {
    console.log(lineChart.getCurrentDataIndex(e));
    lineChart.showToolTip(e, {
      // background: '#7cb5ec',
      format: function (item, category) {
        return category + ' ' + item.name + ':' + item.data
      }
    });
  },
  createSimulationData: async function () {
    const code = 'add_ele'
    var today=new Date()
    var year=today.getFullYear()
    var month=today.getMonth()+1
    var lastDay=new Date(year,month,0).getDate()//获得是标准时间,需要getDate()获得天数
    var dayStr=this.getFormatYearMonth(today)
    //按天查询
    const resp33 = await statisticByDay(this.data.device_id, code, dayStr+ '01',dayStr+ lastDay.toString())

    var categories = Object.keys(resp33.days);
    var data = Object.values(resp33.days);
  
    return {
      categories: categories,
      data: data
    }
  },
  getTodayData: async function () {
    const code = 'add_ele'
    //按小时查询
    var today=new Date()
    var dayStr=this.getFormatDate(today)
    console.info(dayStr)
    const resp33 = await statisticByHour(this.data.device_id, code, dayStr+ '00', dayStr+ '23')

    var categories = Object.keys(resp33.hours);
    var data = Object.values(resp33.hours);
    return {
      categories: categories,
      data: data
    }
  },
  getWeekData: async function () {
    const code = 'add_ele'
   //按星期查询
   const resp = await statisticByWeek(this.data.device_id, code, '2021001', '202150')
   //console.info('按星期查询', resp)

    var categories = Object.keys(resp.weeks);
    var data = Object.values(resp.weeks);
    return {
      categories: categories,
      data: data
    }
  },
  getMonthData: async function () {
    const code = 'add_ele'
    var today=new Date()
     //按月查询
     const resp = await statisticByMonth(this.data.device_id, code, today.getFullYear().toString()+ '01', today.getFullYear().toString()+ '12')
     //console.info('按月查询', resp)

    var categories = Object.keys(resp.months);
    var data = Object.values(resp.months);
    return {
      categories: categories,
      data: data
    }
  },



  updateData: async function () {
    await this.drawChart(this.data.selectedIndex);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function () {

    const code = 'add_ele'

    var windowWidth = 320;
    var windowHeight=300;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
      windowHeight=150
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    await this.drawChart(1);
  },

createChart:function(canvasId,simulationData,horStr,windowWidth,windowHeight){
  return new wxCharts({
    canvasId: canvasId,
    type: 'line',
    categories: simulationData.categories,
    animation: true,
    // background: '#f5f5f5',
    series: [{
      name: horStr,
      data: simulationData.data,
    }],
    xAxis: {
      disableGrid: true
    },
    yAxis: {
      title: '用电量 (kwh)',
      format: function (val) {
        return val.toFixed(2);
      },
      min: 0
    },
    width: windowWidth,
    height: windowHeight,
    dataLabel: false,
    dataPointShape: true,
    extra: {
      lineStyle: 'curve'
    }
  });
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



})