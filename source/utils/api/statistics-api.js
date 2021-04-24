import request from '../request'

// 获取设备列表 
export const allType = (device_id) => {
  return request({
    name: 'ty-service',
    data: {
      action: 'statistics.allType',
      params: {device_id}
    }
  })
}


// 获取历史累计值
export const total = (device_id,code) => {
  return request({
    name: 'ty-service',
    data: {
      action: 'statistics.total',
      params: {device_id,code}
    }
  })
}
