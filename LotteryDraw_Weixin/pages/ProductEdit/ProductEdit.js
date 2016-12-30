//产品编辑
var util = require('../../utils/util.js')
var action = require('../../utils/action.js')
var app = getApp()

Page({
    data: {
        LotteryTypeNameList: [],
        LotteryTypeIndex: -1,
        ProductName: "",
        ProductImage: "",
        LotteryUserCount: 0
    },
    props: {
        IsUpdate: false,
        EntityData: null,
        LotteryTypeList: [],
        SelectLotteryTypeId: ""
    },
    onLoad: function (options) {
        this.props.IsUpdate = !util.StringIsNullOrEmpty(options.ProductId)
        this.props.LotteryTypeList = action.GetLotteryTypeList()

        this.setData({
            LotteryTypeNameList: this.props.LotteryTypeList.map(function (item) { return item.TypeName })
        })

        if (this.props.IsUpdate) {
            this.props.EntityData = action.GetProduct(options.ProductId)
            this.LoadData()
        }
    },
    LoadData: function () {
        if (this.props.EntityData) {
            var data = {}
            for (var key in this.data) {
                if (this.props.EntityData[key] !== undefined) {
                    data[key] = this.props.EntityData[key]
                }
            }

            this.props.SelectLotteryTypeId = this.props.EntityData.LotteryTypeId
            for (var i = 0; i < this.props.LotteryTypeList.length; i++) {
                if (this.props.LotteryTypeList[i].LotteryTypeId === this.props.SelectLotteryTypeId) {
                    data.LotteryTypeIndex = i
                    break
                }
            }

            this.setData(data)
        }
    },
    bindchange: function (e) {
        if (e.target.dataset.name) {
            this.data[e.target.dataset.name] = e.detail.value
        }
    },
    bindLetterTypeChange: function (e) {
        var that = this
        this.props.SelectLotteryTypeId = this.props.LotteryTypeList[e.detail.value].LotteryTypeId

        this.setData({
            LotteryTypeIndex: e.detail.value
        })
    },
    bindTapSave: function () {
        if (!this.JudgeNullValue()) { return }

        this.props.EntityData = this.props.EntityData || {}
        for (var key in this.data) {
            this.props.EntityData[key] = this.data[key]
        }

        this.props.EntityData.LotteryTypeId = this.props.SelectLotteryTypeId

        action.SaveProduct(this.props.EntityData, function () {
            util.alert("保存成功！", function () {
                app.IsRefresh = true
                wx.navigateBack()
            })
        })
    },
    JudgeNullValue: function () {
        var blSuccess = true, message = ""

        if (util.StringIsNullOrEmpty(this.data.ProductName)) {
            blSuccess = false
            message = "奖品名称不能为空！"
        }

        if (blSuccess && util.StringIsNullOrEmpty(this.props.SelectLotteryTypeId)) {
            blSuccess = false
            message = "请选择奖项！"
        }

        var count = parseInt(this.data.LotteryUserCount, 10)

        if (blSuccess && !(count > 0 && count.toString() === this.data.LotteryUserCount.toString())) {
            blSuccess = false
            message = "中奖人奖应大于零自然数"
        }

        if (!blSuccess) {
            util.alert(message)
        }

        return blSuccess
    }
})