//抽奖设置
var util = require('../../utils/util.js')
var action = require('../../utils/action.js')
var app = getApp()

Page({
    data: {
        LotteryTypeNameList: [],
        LotteryTypeIndex: -1,
        ProductNameList: [],
        ProductIndex: -1,
        LotteryUserCount: 0
    },
    props: {
        LotteryTypeList: [],
        ProductList: [],
        SelectLotteryTypeId: "",
        SelectProductId: ""
    },
    onShow: function () {
        this.IsNavigateTo = false
    },
    onLoad: function () {
        this.props.LotteryTypeList = action.GetLotteryTypeList()
        this.props.ProductList = action.GetProductList()

        this.setData({
            LotteryTypeNameList: this.props.LotteryTypeList.map(function (item) { return item.TypeName })
        })
    },
    bindLotteryTypeChange: function (e) {
        var that = this
        this.props.SelectLotteryTypeId = this.props.LotteryTypeList[e.detail.value].LotteryTypeId

        this.props.SelectProductList = this.props.ProductList.filter(function (item) {
            return that.props.SelectLotteryTypeId === item.LotteryTypeId
        })

        var blOne = this.props.SelectProductList.length === 1

        this.props.SelectProductId = blOne ? this.props.SelectProductList[0].ProductId : ""
        var count = blOne ? this.props.SelectProductList[0].LotteryUserCount : 0

        this.setData({
            LotteryTypeIndex: e.detail.value,
            ProductNameList: this.props.SelectProductList.map(function (item) { return item.ProductName }),
            ProductIndex: blOne ? 0 : -1,
            LotteryUserCount: count
        })
    },
    bindLotteryProductChange: function (e) {
        var p = this.props.SelectProductList[e.detail.value]
        this.props.SelectProductId = p.ProductId

        this.setData({
            ProductIndex: e.detail.value,
            LotteryUserCount: p.LotteryUserCount
        })
    },
    bindTapType: function () {
        if (this.IsNavigateTo) { return }
        this.IsNavigateTo = true

        wx.navigateTo({ url: '../LotteryTypeList/LotteryTypeList' })
    },
    bindTapProduct: function () {
        if (this.IsNavigateTo) { return }
        this.IsNavigateTo = true
        wx.navigateTo({ url: '../ProductList/ProductList' })
    },
    bindTapStart: function () {
        if (!this.JudgeTypeProduct()) {
            return
        }

        if (this.IsNavigateTo) { return }
        this.IsNavigateTo = true

        var url = "../LotteryDraw/LotteryDraw?LotteryTypeId={0}&ProductId={1}&TypeName={2}&ProductName={3}&LotteryUserCount={4}"
        url += "&LogoUrl={5}&ProductImage={6}"
        var list = this.props.ProductList.filter(function (item) { return item.ProductId === this.props.SelectProductId }, this)
        if (list.length > 0) {
            var p = list[0]

            list = this.props.LotteryTypeList.filter(function (item) { return item.LotteryTypeId == p.LotteryTypeId })
            var t = {}
            if (list.length > 0) {
                t = list[0]
            }

            url = util.StringFormat(url, [p.LotteryTypeId, p.ProductId, p.TypeName, p.ProductName, p.LotteryUserCount, t.LogoUrl, p.ProductImage])
        }


        wx.navigateTo({ url: url })
    },
    bindTapRecrod: function () {
        if (!this.JudgeTypeProduct()) {
            return
        }

        if (this.IsNavigateTo) { return }
        this.IsNavigateTo = true

        var url = "../LotteryRecord/LotteryRecord?LotteryTypeId={0}&ProductId={1}&TypeName={2}&ProductName={3}&LotteryUserCount={4}"
        var list = this.props.ProductList.filter(function (item) { return item.ProductId === this.props.SelectProductId }, this)
        if (list.length > 0) {
            var p = list[0]
            url = util.StringFormat(url, [p.LotteryTypeId, p.ProductId, p.TypeName, p.ProductName, p.LotteryUserCount])
        }

        wx.navigateTo({ url: url })
    },
    JudgeTypeProduct: function () {
        var blSuccess = true, message = ""

        if (util.StringIsNullOrEmpty(this.props.SelectLotteryTypeId)) {
            blSuccess = false
            message = "请选择奖项！"
        }

        if (blSuccess && util.StringIsNullOrEmpty(this.props.SelectProductId)) {
            blSuccess = false
            message = "请选择奖品！"
        }

        if (!blSuccess) {
            util.alert(message)
        }

        return blSuccess
    }
})
