//产品列表
var util = require('../../utils/util.js')
var action = require('../../utils/action.js')
var app = getApp()

Page({
    data: {
        ProductList: []
    },
    props: {
        TimeoutId: 0
    },
    onLoad: function () {
        var list = action.GetProductList()
        list.forEach(function (item) {
            item.Selected = false
            item.Id = util.CreateGuid()
        })

        this.setData({
            ProductList: list
        })
    },
    onUnload: function () {
        this.StopTimeout()
    },
    onShow: function () {
        this.IsNavigateTo = false

        if (app.IsRefresh) {
            app.IsRefresh = false
            this.onLoad()
        }
    },
    StopTimeout: function () {
        if (this.props.TimeoutId > 0) {
            clearTimeout(this.props.TimeoutId)
            this.props.TimeoutId = 0
        }
    },
    catchtapEdit: function (e) {
        this.StopTimeout()
        if (this.IsLongTap) {
            this.IsLongTap = false
            return
        }

        if (this.IsNavigateTo) { return }
        this.IsNavigateTo = true

        var url = "../ProductEdit/ProductEdit?ProductId={0}"
        url = util.StringFormat(url, [e.currentTarget.id])
        wx.navigateTo({ url: url })
    },
    bindTapAdd: function (e) {
        if (this.IsNavigateTo) { return }
        this.IsNavigateTo = true

        var url = "../ProductEdit/ProductEdit"
        wx.navigateTo({ url: url })
    },
    catchlongtapMenu: function (e) {
        var that = this
        this.IsLongTap = true
        var id = e.currentTarget.id

        util.showActionSheet(["删除"], function () {
            action.DeleteProduct(id, function () {
                that.onLoad()
            })
        })

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

        this.data.ProductList.forEach(function (item, index) {
            item.Selected = index === that.SelectedIndex && that.IsSelectRow
        })

        this.setData({
            ProductList: this.data.ProductList
        })
    }
})