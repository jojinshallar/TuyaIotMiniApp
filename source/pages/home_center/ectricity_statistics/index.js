// pages/home_center/ectricity_statistics/index.js
import {
  allType,
  total
} from '../../../utils/api/statistics-api'
import wxMqtt from '../../../utils/mqtt/wxMqtt'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { device_icon, device_name, device_id } = options
    this.setData({ device_icon: `https://images.tuyacn.com/${device_icon}`, device_name, device_id })

console.log(options)
// this.setData(()=>{
//   this.device_id=options['device_id']  
//   this.device_name=options['device_name']
//   this.device_icon=options['device_icon']
// })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

/**
   * 生命周期函数--监听页面显示
   */
  onShow: async function () {

    // const allTypes = await allType(this.data.device_id)
    
    // console.info(allTypes)
    // this.setData({ allTypes })

    const resp2 = await total(this.data.device_id,'electricity')
    console.info(resp2)
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

  }
})