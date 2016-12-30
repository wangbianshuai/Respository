//抽奖设置
var util = require('../../utils/util.js')
var action = require('../../utils/action.js')

Page({
    data: {
        TypeName: "",
        LogoUrl: "",
        ProductName: "",
        ProductImage: "",
        LotteryUserCount: 0,
        LotteryUsesCount2: 0,
        AvatarUrl: "",
        NickName: "",
        IsLotteryDraw: false,
        IsDraw: false,
        IsShowTime: false,
        SecondNum: 0,
        IsShowImage: true,
        IsStartDarw: false
    },
    props: {
        UserInfoList: [],
        LotteryTypeId: "",
        ProductId: "",
        SelectIndex: 0,
        DrawUserList: [],
        SelectUserIndex: 0,
        IntervalId: 0,
        IntervalId2: 0,
        TimeoutId: 0,
        SelectUserInfo: {}
    },
    onLoad: function (options) {
        this.props.LotteryTypeId = options.LotteryTypeId
        this.props.ProductId = options.ProductId

        var list = action.GetLotteryRecordList(this.props.LotteryTypeId, this.props.ProductId)
        var iCount = 0, iCount2 = 0
        list.forEach(function (item) {
            iCount2 += item.LotteryStatus === 1 ? 1 : 0
        })

        iCount = parseInt(options.LotteryUserCount, 10)

        this.setData({
            LotteryUserCount2: iCount2,
            TypeName: options.TypeName,
            LogoUrl: options.LogoUrl,
            ProductName: options.ProductName,
            ProductImage: options.ProductImage,
            LotteryUserCount: iCount,
            IsLotteryDraw: iCount > iCount2,
            IsDraw: iCount > iCount2
        })

        if (!this.data.IsLotteryDraw) {
            return
        }

        this.SetDrawUserList()
    },
    SetDrawUserList: function () {
        this.props.DrawUserList = []
        this.props.UserInfoList = action.GetUserList(this.props.LotteryTypeId).map(function (item) {
            item.Index2 = Math.random()
            return item
        })

        this.props.UserInfoList = this.props.UserInfoList.sort(function (a, b) {
            return a.Index2 > b.Index2 ? 1 : -1
        })

        if (this.props.UserInfoList.length > 0) {
            this.SetLetteryDraw()
        }
    },
    onUnload: function () {
        this.StopInterval()
        this.StopInterval2()
        this.StopTimeout()
    },
    SetLetteryDraw: function () {
        var that = this
        this.StopInterval()
        this.props.IntervalId = setInterval(function () {
            that.ShowUserInfo()
            that.props.SelectIndex += 1
        }, 100)
    },
    StopInterval: function () {
        this.props.SelectIndex = 0
        this.props.IntervalId > 0 && clearInterval(this.props.IntervalId)
    },
    StopInterval2: function () {
        this.props.IntervalId2 > 0 && clearInterval(this.props.IntervalId2)
    },
    StopTimeout: function () {
        this.props.TimeoutId > 0 && clearTimeout(this.props.TimeoutId)
    },
    ShowUserInfo: function () {
        if (this.props.SelectIndex >= this.props.UserInfoList.length) {
            this.props.SelectIndex = 0
        }

        this.props.SelectUserInfo = this.props.UserInfoList[this.props.SelectIndex]

        this.setData({
            AvatarUrl: this.props.SelectUserInfo.AvatarUrl,
            NickName: this.props.SelectUserInfo.NickName,
            IsShowImage: !util.StringIsNullOrEmpty(this.props.SelectUserInfo.AvatarUrl)
        })
    },
    bindTapEnd: function () {
        if (this.props.IsEnd) {
            return
        }
        if (this.props.UserInfoList.length == 0) {
            util.alert("未有员工参与抽奖！")
            return;
        }

        if (this.data.IsStartDraw) {
            this.props.IsEnd = false
            this.setData({
                IsStartDraw: false
            })

            this.SetDrawUserList()
        }
        else {
            this.props.IsEnd = true
            this.setData({
                IsDraw: false,
                IsShowTime: true,
                SecondNum: 5
            })

            this.ShowSecondNum()
        }
    },
    ShowSecondNum: function () {
        var that = this
        this.StopInterval2()
        this.props.IntervalId2 = setInterval(function () {
            that.SetSencondNum()
        }, 1000)
    },
    SetSencondNum: function () {
        this.data.SecondNum -= 1
        var that = this

        var data = {}

        if (this.data.SecondNum === 0) {
            this.StopInterval()
            this.StopInterval2()

            this.SetDrawUser()

            data.IsShowTime = false
            data.AvatarUrl = this.props.SelectUserInfo.AvatarUrl
            data.NickName = this.props.SelectUserInfo.NickName
            data.IsShowImage = !util.StringIsNullOrEmpty(this.props.SelectUserInfo.AvatarUrl)
            data.LotteryUserCount2 = this.data.LotteryUserCount2 + 1

            if (this.data.LotteryUserCount === data.LotteryUserCount2) {
                this.StopTimeout()
                this.props.TimeoutId = setTimeout(function () {
                    that.RedirectToRecord()
                }, 3000)
            }
            else {
                data.IsDraw = true
                data.IsStartDraw = true
                this.props.IsEnd = false
            }
        }

        data.SecondNum = this.data.SecondNum

        this.setData(data)
    },
    RedirectToRecord: function () {
        var url = "../LotteryRecord/LotteryRecord?LotteryTypeId={0}&ProductId={1}&TypeName={2}&ProductName={3}&LotteryUserCount={4}"

        var p = {
            LotteryTypeId: this.props.LotteryTypeId,
            ProductId: this.props.ProductId,
            TypeName: this.data.TypeName,
            ProductName: this.data.ProductName,
            LotteryUserCount: this.data.LotteryUserCount
        }
        url = util.StringFormat(url, [p.LotteryTypeId, p.ProductId, p.TypeName, p.ProductName, p.LotteryUserCount])

        wx.redirectTo({ url: url })
    },
    SetDrawUser: function () {
        var data = util.Clone(this.props.SelectUserInfo)

        data.LotteryTypeId = this.props.LotteryTypeId
        data.ProductId = this.props.ProductId
        data.TypeName = this.data.TypeName
        data.ProductName = this.data.ProductName
        data.LotteryStatus = 1

        this.props.DrawUserList.push(data)

        action.SaveLotteryRecordList(this.props.DrawUserList, function () { })
    }
})