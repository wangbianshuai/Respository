//首页
var action = require('../../utils/action.js')
var app = getApp()

Page({
  data: {
    motto: '欢迎您，祝您好运！',
    userInfo: {},
    isAdmin: false,
    isHideAuth:true
  },
  onShow: function () {
    this.IsNavigateTo = false
  },
  bindGetUserInfo: function () {
    this.onLoad();
  },
  //事件处理函数
  bindTapLottery: function () {
    if (this.IsNavigateTo) { return }
    this.IsNavigateTo = true

    wx.navigateTo({ url: '../LotterySet/LotterySet' })
  },
  onLoad: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      var users = app.globalData.adminUsers.filter(function (item) { return item === userInfo.nickName })
      var isAdmin = users.length > 0
      //更新数据
      that.setData({
        userInfo: userInfo,
        isAdmin: isAdmin,
        isHideAuth: true
      })

      action.SaveUser(userInfo, function (d) {
        var motto = "签到成功，祝您好运！"
        if (!d.Success) {
          motto = "签到失败，请稍后重新扫码签到"
        }
        that.setData({
          motto: motto,
        })
      })
    })
  }
})
