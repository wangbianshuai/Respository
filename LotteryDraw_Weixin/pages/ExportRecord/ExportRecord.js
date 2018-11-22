//中奖记录
var util = require('../../utils/util.js')
var action = require('../../utils/action.js')
var app = getApp()

Page({
    data: {
        RecordText: "",
    },
    props: {
        LotteryTypeId: "",
        ProductId: ""
    },
    onLoad: function (options) {
        this.props.LotteryTypeId = options.LotteryTypeId
        this.props.ProductId = options.ProductId

        var list = action.GetLotteryRecordList(this.props.LotteryTypeId, this.props.ProductId)
        list = list.filter(function (item) { return item.LotteryStatus === 1 })

        var texts = []
        texts.push(util.StringFormat("{0}/{1}，中奖者如下：", [options.TypeName, options.ProductName]))

        list.forEach(function (item) {
            texts.push(item.NickName)
        })

        this.setData({
            RecordText: texts.join(" \n")
        })
    }
})