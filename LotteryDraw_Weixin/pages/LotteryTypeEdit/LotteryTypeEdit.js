//抽奖类型编辑
var util = require('../../utils/util.js')
var action = require('../../utils/action.js')
var app = getApp()

Page({
    data: {
        TypeName: "",
        LogoUrl: "",
        IsMutex: 1
    },
    props: {
        IsUpdate: false,
        EntityData: null
    },
    onLoad: function (options) {
        this.props.IsUpdate = !util.StringIsNullOrEmpty(options.LotteryTypeId)

        if (this.props.IsUpdate) {
            this.props.EntityData = action.GetLotteryType(options.LotteryTypeId)
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

            this.setData(data)
        }
    },
    bindchange: function (e) {
        if (e.target.dataset.name) {
            this.data[e.target.dataset.name] = e.detail.value
        }
    },
    checkboxChange: function (e) {
        if (e.target.dataset.name) {
            this.data[e.target.dataset.name] = e.detail.value.length > 0 ? 1 : 0
        }
    },
    bindTapSave: function () {
        if (!this.JudgeNullValue()) { return }

        this.props.EntityData = this.props.EntityData || {}
        for (var key in this.data) {
            this.props.EntityData[key] = this.data[key]
        }


        action.SaveLotteryType(this.props.EntityData, function () {
            util.alert("保存成功！", function () {
                app.IsRefresh = true
                wx.navigateBack()
            })
        })
    },
    JudgeNullValue: function () {
        var blSuccess = true, message = ""

        if (util.StringIsNullOrEmpty(this.data.TypeName)) {
            blSuccess = false
            message = "类型名称不能为空！"
        }

        if (!blSuccess) {
            util.alert(message)
        }

        return blSuccess
    }
})