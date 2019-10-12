const PurchaseSale = require("../../entities/PurchaseSale");
const { GetButton, AssignProporties, GetDatePicker } = require("../../Common");

//进销管理/销售单列表 3100-3199
const DataActionTypes = {
    //搜索查询
    SearchQuery: 3100
};

const Entity = { Name: PurchaseSale.Name, PrimaryKey: PurchaseSale.PrimaryKey }

module.exports = {
    Name: "PurchaseSaleCount",
    Type: "View",
    EventActions: GetEventActions(),
    Properties: AssignProporties({ Name: "PurchaseSaleCount" }, [GetSearchOperationView(), GetDataGridView()])
}

function GetSearchOperationView() {
    return {
        Name: "SearchOperationView1",
        Entity: Entity,
        Type: "RowsColsView",
        ClassName: "DivSerachView",
        Properties: AssignProporties({ Name: "PurchaseSaleCount" }, [

            { ...GetDatePicker2("StartDate", "日期", 1, 1, "大于或等于其值"), PropertyName: "SaleDate", OperateLogic: ">=" },
            { ...GetDatePicker2("EndDate", "至", 1, 2, "小于其值"), PropertyName: "SaleDate", OperateLogic: "<" },
            { ...GetButton("Search", "搜索", "primary", 1, 3), IsFormItem: true, Icon: "search", EventActionName: "SearchQuery", PressEnterEventActionName: "SearchQuery" },
            { ...GetButton("ClearQuery", "清空", "default", 1, 4), IsFormItem: true, EventActionName: "ClearQuery" },
            { EventActionName: "ExportExcel", ...GetButton("ExportExcel", "Excel导出", "primary", 3, 1), Style: { marginLeft: 16, marginBottom: 16 } }
        ])
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

function GetDataGridView() {
    return {
        Name: "DataGridView1",
        Entity: Entity,
        Type: "DataGridView",
        EntitySearchQuery: DataActionTypes.SearchQuery,
        EventActionName: "SearchQuery",
        IsDiv: true,
        ClassName: "DivInfoView3",
        SetColumnsEventActionName: "SetShowColumns",
        IsPartPaging: true,
        Properties: AssignProporties(PurchaseSale, [{ Name: "SaleDate", OrderByType: "desc", IsVisible: false }, "SaleYear", "SaleMonth", "SaleDay", GetAmount("PurchaseAmount"), GetAmount("PurchaseShouldAmount"), GetAmount("PurchaseRealAmount"),
        GetAmount("PurchaseDueAmount"), GetAmount("SaleAmount"), GetAmount("SaleBidAmount"), GetAmount("SaleProfit"), GetAmount("SaleShouldAmount"), GetAmount("SaleRealAmount"), GetAmount("SaleDueAmount")])
    }
}

function GetAmount(Name) {
    return {
        Name,
        GroupByExpression: `sum(${Name})`,
        Scale: 2, IsCurrency: true, FontColor: "#1890ff"
    }
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
    },
    {
        Name: "SetShowColumns",
        Type: "DataGrid/SetDataGridShowColumns",
        DataGridView: "DataGridView1"
    }]
}
