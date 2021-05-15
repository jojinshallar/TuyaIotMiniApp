import request from '../request'

// 获取设备列表 
export const allType = (device_id) => {
  return request({
    name: 'ty-service',
    data: {
      action: 'statistics.allType',
      params: {
        device_id
      }
    }
  })
}


// 获取历史累计值
export const total = (device_id, code) => {
  return request({
    name: 'ty-service',
    data: {
      action: 'statistics.total',
      params: {
        device_id,
        code
      }
    }
  })
}

//按小时统计获取电量统计，只能是当天
export const statisticByHour = (device_id, code, start_hour, end_hour) => {
  return request({
    name: 'ty-service',
    data: {
      action: 'statistics.hours',
      params: {
        device_id,
        code,
        start_hour,
        end_hour
      }
    }
  })
}

export const statisticByDay = (device_id, code, start_day, end_day) => {
  return request({
    name: 'ty-service',
    data: {
      action: 'statistics.days',
      params: {
        device_id,
        code,
        start_day,
        end_day
      }
    }
  })
}

export const statisticByWeek = (device_id, code, start_week, end_week) => {
  return request({
    name: 'ty-service',
    data: {
      action: 'statistics.weeks',
      params: {
        device_id,
        code,
        start_week,
        end_week
      }
    }
  })
}

//按月份统计用电量，不支持跨年
export const statisticByMonth = (device_id, code, start_month, end_month) => {
  return request({
    name: 'ty-service',
    data: {
      action: 'statistics.months',
      params: {
        device_id,
        code,
        start_month,
        end_month
      }
    }
  })
}

export const statisticTheDay = (device_id, code) => {
  return request({
    name: 'ty-service',
    data: {
      action: 'statistics.all',
      params: {
        device_id,
        code
      }
    }
  })
}