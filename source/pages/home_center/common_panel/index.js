// miniprogram/pages/home_center/common_panel/index.js.js
import {
  getDevFunctions,
  getDeviceDetails,
  deviceControl,
  getDeviceStatus
} from '../../../utils/api/device-api'
import wxMqtt from '../../../utils/mqtt/wxMqtt'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    device_name: '',
    titleItem: {
      name: '',
      value: '',
    },
    roDpList: {}, //只上报功能点
    rwDpList: {}, //可上报可下发功能点
    isRoDpListShow: false,
    isRwDpListShow: false,
    forest: '../../../image/homelogo.jpg'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {
      device_id
    } = options
    this.setData({
      device_id
    })

    // mqtt消息监听
    wxMqtt.on('message', (topic, newVal) => {
      const {
        status
      } = newVal
      console.info('新状态回调：',newVal)
      this.updateStatus(status)
    })

    const newStatus= getDeviceStatus(device_id)
    console.info('主动新状态：',newStatus)


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: async function () {
    const {
      device_id
    } = this.data
    const [{      name,      status,      icon    },
       {
      functions = []
    }] = await Promise.all([
      getDeviceDetails(device_id),
      getDevFunctions(device_id),
    ]);

    const {
      roDpList,
      rwDpList
    } = this.reducerDpList(status, functions)

    // 获取头部展示功能点信息
    let titleItem = {
      name: '',
      value: '',
    };
   
    //查找roDpList里面是否有包含switch的属性
    let roSwitchIndex=Object.keys(roDpList).findIndex(p=>p.indexOf('switch')>-1)
    //查找rdDpList里面是否有包含switch的属性
    let rdSwitchIndex=Object.keys(rwDpList).findIndex(p=>p.indexOf('switch')>-1)


    if (roSwitchIndex > -1) {
      let keys = Object.keys(rwDpList)[roSwitchIndex];
      console.info("当前2key：",keys)
      titleItem = roDpList[keys];
    } else {
      let keys = Object.keys(rwDpList)[rdSwitchIndex];
      console.info("当前2key：",keys)
      titleItem = rwDpList[keys];
    }
console.info('临时',titleItem)

    const roDpListLength = Object.keys(roDpList).length
    const isRoDpListShow = Object.keys(roDpList).length > 0
    const isRwDpListShow = Object.keys(rwDpList).length > 0

    this.setData({
      titleItem,
      roDpList,
      rwDpList,
      device_name: name,
      isRoDpListShow,
      isRwDpListShow,
      roDpListLength,
      icon
    })
  },

  // 分离只上报功能点，可上报可下发功能点
  reducerDpList: function (status, functions) {
    // 处理功能点和状态的数据
    let roDpList = {};
    let rwDpList = {};
    if (status && status.length) {
      status.map((item) => {
        const {
          code,
          value
        } = item;
        let isExit = functions.find(element => element.code == code);
        if (isExit) {
          let rightvalue = value
          // 兼容初始拿到的布尔类型的值为字符串类型
          if (isExit.type === 'Boolean') {
            rightvalue = (value == 'true'||value)
          }

          rwDpList[code] = {
            code,
            value: rightvalue,
            type: isExit.type,
            values: isExit.values,
            name: isExit.name,
          };
        } else {
          roDpList[code] = {
            code,
            value,
            name: code,
          };
        }
      });
    }
    return {
      roDpList,
      rwDpList
    }
  },

  sendDp: async function (e) {
    const {
      dpCode,
      value
    } = e.detail
    const {
      device_id
    } = this.data

    const {
      success
    } = await deviceControl(device_id, dpCode, value)
  },

  updateStatus: function (newStatus) {
    let {
      roDpList,
      rwDpList,
      titleItem
    } = this.data

    newStatus.forEach(item => {
      const {
        code,
        value
      } = item

      if (typeof roDpList[code] !== 'undefined') {
        roDpList[code]['value'] = value;
      } else if (rwDpList[code]) {
        rwDpList[code]['value'] = value;
      }
    })

    // 更新titleItem
    if (Object.keys(roDpList).length > 0) {
      let keys = Object.keys(roDpList)[0];
      titleItem = roDpList[keys];
    } else {
      let keys = Object.keys(rwDpList)[0];
      titleItem = rwDpList[keys];
    }

    this.setData({
      titleItem,
      roDpList: {
        ...roDpList
      },
      rwDpList: {
        ...rwDpList
      }
    })
  },

  jumpTodeviceEditPage: function () {
    console.log('jumpTodeviceEditPage')
    const {
      icon,
      device_id,
      device_name
    } = this.data
    wx.navigateTo({
      url: `/pages/home_center/device_manage/index?device_id=${device_id}&device_name=${device_name}&device_icon=${icon}`,
    })
  },

  jumpToElectricityStatisticsPage: function () {
    console.log('jumptoelectricityStatisticsPage')
    const {
      icon,
      device_id,
      device_name
    } = this.data
    wx.navigateTo({
      url: `/pages/home_center/ectricity_statistics/index?device_id=${device_id}&device_name=${device_name}&device_icon=${icon}`,
    })
  },
  jumpToTimerPage: function () {
    console.log('jumpToTimerPage')
    const {
      icon,
      device_id,
      device_name
    } = this.data
    wx.navigateTo({
      url: `/pages/home_center/timer/index?device_id=${device_id}&device_name=${device_name}&device_icon=${icon}`,
    })
  },


})