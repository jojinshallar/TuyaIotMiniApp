import request from '../request'

// 获取定时列表 
export const getTimerList = (device_id) => {
  return request({
    name: 'ty-service',
    data: {
      action: 'timer.list',
      params: {
        device_id
      }
    }
  })
}
// 添加定时任务 
export const addTimer = (device_id,category,loops,time_zone,timezone_id,instruct) => {
  return request({
    name: 'ty-service',
    data: {
      action: 'timer.add',
      params: {
        device_id,
        category,
        loops,
        time_zone,
        timezone_id,
        instruct
      }
    }
  })
}
// 删除定时任务 
export const delTimer = (device_id) => {
  return request({
    name: 'ty-service',
    data: {
      action: 'timer.delete',
      params: {
        device_id
      }
    }
  })
}
