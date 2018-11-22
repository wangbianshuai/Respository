//中奖记录
var util = require('../../utils/util.js')
var action = require('../../utils/action.js')
var app = getApp()

Page({
    data: {
        LotteryRecordList: [],
        TypeName: "",
        ProductName: "",
        LotteryUserCount: 0,
        LotteryUserCount2: 0
    },
    props: {
        LotteryTypeId: "",
        ProductId: "",
        TimeoutId: 0
    },
    onLoad: function (options) {
        this.props.options = options
        this.props.LotteryTypeId = options.LotteryTypeId
        this.props.ProductId = options.ProductId

        var list = action.GetLotteryRecordList(this.props.LotteryTypeId, this.props.ProductId)

        var iCount = 0
        list.forEach(function (item) {
            item.Selected = false
            item.Selected2 = false
            iCount += item.LotteryStatus === 1 ? 1 : 0
            item.Id = util.CreateGuid()
        })

        this.setData({
            LotteryRecordList: list,
            LotteryUserCount2: iCount,
            TypeName: options.TypeName,
            ProductName: options.ProductName,
            LotteryUserCount: options.LotteryUserCount
        })
    },
    onUnload: function () {
        this.StopTimeout()
    },
    StopTimeout: function () {
        if (this.props.TimeoutId > 0) {
            clearTimeout(this.props.TimeoutId)
            this.props.TimeoutId = 0
        }
    },
    catchtapAllCancel: function (e) {
        var that = this
        var idList = []
        this.data.LotteryRecordList.forEach(function (item) {
            if (item.LotteryStatus === 1) {
                idList.push(item.RecordId)
            }
        })

        if (idList.length == 0) {
            util.alert("未有有效记录！")
            return
        }

        util.confirm("确认全部作废吗？", function () {
            action.BatchSetLotteryStatusInValid(idList, function () {
                that.onLoad(that.props.options)
            })
        })
    },
    catchlongtapMenu: function (e) {
        var that = this
        this.IsLongTap = true
        var id = e.currentTarget.id

        if (parseInt(e.currentTarget.dataset.lotterystatus, 10) === 0) { return }

        util.showActionSheet(["作废", "导出"], function (tapIndex) {
            if (tapIndex === 0) {
                action.SetLotteryStatusInValid(id, function () {
                    that.onLoad(that.props.options)
                })
            }
            else if (tapIndex === 1) {
                var url = "../ExportRecord/ExportRecord?LotteryTypeId={0}&ProductId={1}&TypeName={2}&ProductName={3}"

                var p = {
                    LotteryTypeId: this.props.LotteryTypeId,
                    ProductId: this.props.ProductId,
                    TypeName: this.data.TypeName,
                    ProductName: this.data.ProductName,
                }
                url = util.StringFormat(url, [p.LotteryTypeId, p.ProductId, p.TypeName, p.ProductName, p.LotteryUserCount])

                wx.redirectTo({ url: url })
            }
        }, this)

    },
    touchstart: function (e) {
        var that = this
        this.StopTimeout()
        this.props.TimeoutId = setTimeout(function () {
            that.IsSelectRow = true
            that.SelectedIndex = parseInt(e.currentTarget.dataset.index, 10)
            that.SetRowSelected()
        }, 100)
    },
    touchend: function (e) {
        this.StopTimeout()
        if (this.IsSelectRow) {
            this.IsSelectRow = false
            this.SetRowSelected()
        }
    },
    SetRowSelected: function (e, selected) {
        var that = this

        this.data.LotteryRecordList.forEach(function (item, index) {
            item.Selected = index === that.SelectedIndex && that.IsSelectRow
        })

        this.setData({
            LotteryRecordList: this.data.LotteryRecordList
        })
    }
})