// pages/home_center/timer/index.js
import {
  getTimerList,
  addTimer,
  delTimer
} from '../../../utils/api/time-api'
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
    const {
      device_icon,
      device_name,
      device_id,
      timer_list
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

getTaskList:async function(){
  var resp = await getTimerList(this.data.device_id)

  this.setData({
    timer_list: resp
  });
},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function () {
      await this.getTaskList()
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
  addTimer: async function () {
    var instruct = [{
      "functions": [{
        "code": "switch",
        "value": true
      }],
      "date": "20210515",
      "time": "17:41"
    }]
    const resp = await addTimer(this.data.device_id, 'testTimeTask', '0000000', "+8:00", "Asia/Shanghai", instruct)
      if (typeof resp.group_id=="undefined" || resp.group_id==null || resp.group_id=="") {
      wx.showToast({
        title: '添加失败',
      })
    } else {
      wx.showToast({
        title: '添加成功',
      })
      await this.getTaskList()
    }
  },
  delTimer: async function () {
    const resp = await delTimer(this.data.device_id)
    if (resp.success) {
      wx.showToast({
        title: '删除成功', 
      })
      await this.getTaskList()
    } else {
      wx.showToast({
        title: '删除失败',
      })
    }
  },
})