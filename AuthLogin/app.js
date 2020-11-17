//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        this.getOpenId(res.code)
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    openid: '',
    scene: null
  },
  apiUrl: 'https://www.lianliyuan.site/',
  onShow: function (res) {
    if (res.query && res.query.scene) this.globalData.scene = res.query.scene
    else this.globalData.scene = res.scene;
  },
  getOpenId: function (code) {
    const $this = this;
    wx.request({
      url: this.apiUrl + 'api/wxuser/getopenidbycode',
      method: 'POST',
      data: {
        code
      },
      success: function (res) {
        const data = res.data;
        if (data.Ack) {
          if (data.Ack.IsSuccess) {
            if (data.openid) $this.globalData.openid = data.openid;
            else wx.showModal({
              showCancel: false,
              content: '获取openid失败，请刷新重试！',
              title: '提示信息'
            })
          }
          else wx.showModal({
            showCancel: false,
            content: data.Ack.Message,
            title: '提示信息'
          })
        }
      }
    })
  }
})