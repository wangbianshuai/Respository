const SaleDetail = require("../../entities/SaleDetail");
const { GetButton, AssignProporties, GetTextBox, GetSelect, GetDatePicker } = require("../../Common");

//进销管理/销售单列表 2700-2799
const DataActionTypes = {
    //搜索查询
    SearchQuery: 2700,
};

const Entity = { Name: SaleDetail.Name, PrimaryKey: SaleDetail.PrimaryKey, ViewName: "ViewSaleDetail", IsGroupByInfo: true }

module.exports = {
    Name: "SaleDetailList",
    Type: "View",
    EventActions: GetEventActions(),
    Properties: AssignProporties({ Name: "SaleDetailList" }, [GetSearchOperationView(), GetDataGridView()])
}

function GetSearchOperationView() {
    return {
        Name: "SearchOperationView1",
        Entity: Entity,
        Type: "RowsColsView",
        ClassName: "DivSerachView",
        Properties: AssignProporties({ Name: "SaleDetailList" }, [

            { ...GetDatePicker2("StartDate", "日期", 1, 1, "大于或等于其值"), PropertyName: "SaleDate", OperateLogic: ">=" },
            { ...GetDatePicker2("EndDate", "至", 1, 2, "小于其值"), PropertyName: "SaleDate", OperateLogic: "<" },
            GetEditSelect("ProductTypeId", "类型", SaleDetail.ProductTypeDataSource, 1, 3),
            GetEditSelect("ProductBrandId", "品牌", SaleDetail.ProductBrandDataSource, 2, 1), 
            GetEditSelect2("SaleStatus", "状态", SaleDetail.SaleStatusDataSource, 2, 2),
            {
                ...GetTextBox2("Keyword", "关键字", 2, 3, "", "销售单号/商品名称/编号"), PropertyName: "SaleCode,ProductName",
                OperateLogic: "like", PressEnterEventActionName: "SearchQuery"
            },
            { ...GetButton("Search", "搜索", "primary", 2, 4), IsFormItem: true, Icon: "search", EventActionName: "SearchQuery", PressEnterEventActionName: "SearchQuery" },
            { ...GetButton("ClearQuery", "清空", "default", 2, 5), IsFormItem: true, EventActionName: "ClearQuery" },
            { EventActionName: "ToEditPage", ...GetButton("ToEditPage", "新增", "primary", 3, 1), Style: { marginLeft: 16, marginBottom: 16 } }
        ])
    }
}

function GetEditSelect2(Name, Label, DataSource, X, Y, DefaultValue) {
    return {
        ...GetSelect(Name, Label, DataSource, X, Y, DefaultValue),
        IsFormItem: true,
        ColSpan: 6,
        LabelCol: 8,
        WrapperCol: 15,
        OperateLogic: "=",
        IsNullable: true,
        AllowClear: true,
        IsCondition: true
    }
}

function GetDatePicker2(Name, Label, X, Y, PlaceHolder, DefaultValue) {
    return {
        ...GetDatePicker(Name, Label, X, Y, DefaultValue),
        IsFormItem: true, ColSpan: 6,
        IsNullable: true,
        PlaceHolder: PlaceHolder,
        MaxLength: 20,
        LabelCol: 8,
        WrapperCol: 15,
        DataType: "DateTime",
        IsCondition: true
    }
}

function GetEditSelect(Name, Label, DataSource, X, Y, DefaultValue) {
    return {
        ...GetSelect(Name, Label, null, X, Y, DefaultValue),
        IsFormItem: true,
        ColSpan: 6,
        LabelCol: 8,
        WrapperCol: 15,
        OperateLogic: "=",
        ServiceDataSource: DataSource,
        IsNullable: true,
        AllowClear: true,
        IsCondition: true
    }
}

function GetTextBox2(Name, Label, X, Y, ContorlType, PlaceHolder, MaxLength) {
    return {
        ...GetTextBox(Name, Label, ContorlType, X, Y, PlaceHolder, MaxLength || 50),
        IsFormItem: true,
        ColSpan: 6,
        LabelCol: 8,
        WrapperCol: 15,
        IsNullable: true,
        IsCondition: true
    }
}

function GetDataGridView() {
    return {
        Name: "DataGridView1",
        Entity: Entity,
        Type: "DataGridView",
        EntitySearchQuery: DataActionTypes.SearchQuery,
        EventActionName: "SearchQuery",
        IsDiv: true,
        ClassName: "DivInfoView3",
        GroupByInfoHtml: GetGroupByInfoHtml(),
        Properties: AssignProporties(SaleDetail, [GetSaleCode(), "SaleDate", "ProductName", "ProductTypeName", "ProductBrandName", "SillingPrice", "BidPrice", "Number", GetAmount("Amount2"), GetAmount("BidAmount2"), GetAmount("Profit"),
            "ProfitRate", GetAmount("Discount2"),"SaleStatusName"])
    }
}

function GetSaleCode() {
    return {
        Name: "SaleCode",
        IsToPage: true,
        PageUrl: "/PurchaseSaleManage/SaleList?SaleCode=#{SaleCode}"
    }
}

function GetAmount(Name) {
    return {
        Name,
        Scale: 2, IsCurrency: true, FontColor: "#1890ff"
    }
}

function GetGroupByInfoHtml() {
    var html = [];

    html.push("金额：<span style=\"color:{TotalAmount2Color};\">{TotalAmount2}</span>，");
    html.push("成本：<span style=\"color:{TotalBidAmount2Color};\">{TotalBidAmount2}</span>，");
    html.push("利润：<span style=\"color:{TotalProfitColor};\">{TotalProfit}</span>，");
    html.push("折扣：<span style=\"color:{TotalDiscount2Color};\">{TotalDiscount2}</span>");

    return html.join("");
}

function GetEventActions() {
    return [{
        Name: "SearchQuery",
        Type: "DataGridView/SearchQuery",
        SearchView: "SearchOperationView1",
        SearchButton: "Search",
        DataGridView: "DataGridView1"
    },
    {
        Name: "ClearQuery",
        Type: "DataGridView/SearchQuery",
        SearchView: "SearchOperationView1",
        SearchButton: "ClearQuery",
        DataGridView: "DataGridView1",
        IsClearQuery: true
    }]
}
