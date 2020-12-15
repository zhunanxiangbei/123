const app = getApp()

Page({
  data: {
    uid: 'e328813c1a11bdabcc619e9783cbf670', 
    topic_data: "SEN", 
    topic: "LED1", 
    device_status: "离线",
    bh: "", 
    led_status: ""
  },
 
  openclick: function () {   
    var that = this
    that.setData({
      powerstatus: "已打开"
    })

    wx.request({
      url: 'https://api.bemfa.com/api/device/v1/data/1/', 
      method: "POST",
      data: { 
        uid: that.data.uid,
        topic: that.data.topic_led,
        msg: "on"
      },
      header: {
        'content-type': "application/x-www-form-urlencoded"
      },
      success(res) {
        console.log(res.data)
        wx.showToast({
          title: '打开成功',
          icon: 'success',
          duration: 1000
        })
      }
    })
  },
  
  closeclick: function () {

    var that = this
    that.setData({
      powerstatus: "已关闭"
    })

    wx.request({
      url: 'https://api.bemfa.com/api/device/v1/data/1/', 
      method: "POST",
      data: {
        uid: that.data.uid,
        topic: that.data.topic_led,
        msg: "off"
      },
      header: {
        'content-type': "application/x-www-form-urlencoded"
      },
      success(res) {
        console.log(res.data)
        wx.showToast({
          title: '关闭成功',
          icon: 'success',
          duration: 1000
        })
      }
    })
  },
 
  onLoad: function () {
    var that = this

    wx.request({
      url: 'https://api.bemfa.com/api/device/v1/status/', 
      data: {
        uid: that.data.uid,
        topic: that.data.topic_led,
      },
      header: {
        'content-type': "application/x-www-form-urlencoded"
      },
      success(res) {
        console.log(res.data)
        if (res.data.status === "online") {
          that.setData({
            device_status: "在线"
          })
        } else {
          that.setData({
            device_status: "离线"
          })
        }
        console.log(that.data.device_status)
      }
    })

    wx.request({
      url: 'https://api.bemfa.com/api/device/v1/data/1/', 
      data: {
        uid: that.data.uid,
        topic: that.data.topic_data,
      },
      header: {
        'content-type': "application/x-www-form-urlencoded"
      },
      success(res) {
        console.log(res.data)
        if (res.data.msg.indexOf("#") != -1) { 
          var all_data_arr = res.data.msg.split("#"); 
          console.log(all_data_arr) 
          that.setData({ 
            bh: all_data_arr[1], 
            led_status: all_data_arr[2], 
            temperature:all_data_arr[3],
            humidity:all_data_arr[4],
          })
        }

      }
    })

    setInterval(function () {
      console.log("定时请求设备状态,默认五秒");
      wx.request({
        url: 'https://api.bemfa.com/api/device/v1/status/', 
        data: {
          uid: that.data.uid,
          topic: that.data.topic_led,
        },
        header: {
          'content-type': "application/x-www-form-urlencoded"
        },
        success(res) {
          console.log(res.data)
          if (res.data.status === "online") {
            that.setData({
              device_status: "在线"
            })
          } else {
            that.setData({
              device_status: "离线"
            })
          }
          console.log(that.data.device_status)
        }
      })
    }, 5000)

    setInterval(function () {
      console.log("请求获取各种传感器值,默认2秒");
      wx.request({
        url: 'https://api.bemfa.com/api/device/v1/data/1/', 
        data: {
          uid: that.data.uid,
          topic: that.data.topic_data,
        },
        header: {
          'content-type': "application/x-www-form-urlencoded"
        },
        success(res) {
          console.log(res.data)
          if (res.data.msg.indexOf("#") != -1) { 
            var all_data_arr = res.data.msg.split("#"); 
            console.log(all_data_arr) 
            that.setData({ 
              bh: all_data_arr[1], 
              led_status: all_data_arr[2], 
              temperature:all_data_arr[3],
              humidity:all_data_arr[4],
            })
          }
        }
      })
    }, 2000)


  }
})