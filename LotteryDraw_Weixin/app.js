//app.js

App({
  onLaunch: function () {
  },
  getUserInfo: function (cb) {
    this.getSystemInfo()
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  getSystemInfo: function () {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.globalData.SystemInfo = res
      }
    })
  },
  globalData: {
    userInfo: null,
    adminUsers: ["汪边寨", "郑曲","jacksh","唐良梁"]
  }
})