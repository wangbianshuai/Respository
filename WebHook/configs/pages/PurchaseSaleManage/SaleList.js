const Sale = require("../../entities/Sale");
const { GetButton, AssignProporties, GetTextBox, GetSelect, GetDatePicker } = require("../../Common");
const LookSaleView = require("./LookSaleView");

//进销管理/销售单列表 2600-2699
const DataActionTypes = {
    //搜索查询
    SearchQuery: 2600,
    //删除实体数据
    DeleteEntityData: 2601,
    //Excel导出
    ExcelExport: 2602,
    //更新销售状态
    UpdateSaleStatus2: 2603,
    //更新销售状态
    UpdateSaleStatus3: 2604
};

const Entity = { Name: Sale.Name, PrimaryKey: Sale.PrimaryKey, ViewName: "ViewSale", IsGroupByInfo: true }

module.exports = {
    Name: "SaleList",
    Type: "View",
    DialogViews: [LookSaleView],
    EventActions: GetEventActions(),
    Properties: AssignProporties({ Name: "SaleList" }, [GetSearchOperationView(), GetDataGridView()])
}

function GetSearchOperationView() {
    return {
        Name: "SearchOperationView1",
        Entity: Entity,
        Type: "RowsColsView",
        ClassName: "DivSerachView",
        Properties: AssignProporties({ Name: "SaleList" }, [

            { ...GetDatePicker2("StartDate", "日期", 1, 1, "大于或等于其值"), PropertyName: "SaleDate", OperateLogic: ">=" },
            { ...GetDatePicker2("EndDate", "至", 1, 2, "小于其值"), PropertyName: "SaleDate", OperateLogic: "<" },
            GetEditSelect2("SaleType", "类型", Sale.SaleTypeDataSource, 1, 3),
            GetEditSelect2("AmountType", "收款状态", Sale.AmountTypeDataSource, 1, 4),
            GetEditSelect2("SaleStatus", "状态", Sale.SaleStatusDataSource, 2, 1),
            GetEditSelect("SaleUser", "销售员", Sale.UserDataSource, 2, 2),
            {
                ...GetTextBox2("Keyword", "关键字", 2, 3, "", "销售单号/顾客姓名/手机/备注"), PropertyName: "SaleCode,CustomerName,CustomerPhone,Remark",
                OperateLogic: "like", PressEnterEventActionName: "SearchQuery"
            },
            { ...GetButton("Search", "搜索", "primary", 2, 4), IsFormItem: true, Icon: "search", EventActionName: "SearchQuery", PressEnterEventActionName: "SearchQuery" },
            { ...GetButton("ClearQuery", "清空", "default", 2, 5), IsFormItem: true, EventActionName: "ClearQuery" },
            { EventActionName: "ToEditPage", ...GetButton("ToEditPage", "新增", "primary", 3, 1), Style: { marginLeft: 16, marginBottom: 16 } },
            { EventActionName: "ExcelExport", ...GetButton("ExcelExport", "Excel导出", "default", 3, 2), Icon: "download", ColStyle: { paddingLeft: 0 } }
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
        EntityExcelExport: DataActionTypes.ExcelExport,
        EventActionName: "SearchQuery",
        IsDiv: true,
        ClassName: "DivInfoView3",
        GroupByInfoHtml: GetGroupByInfoHtml(),
        Properties: AssignProporties(Sale, [GetSaleCode(), "SaleDate", GetAmount("SaleAmount"), GetAmount("BidAmount"), GetAmount("Profit"),
        GetAmount("ShouldAmount2"), GetAmount("RealAmount2"), GetAmount("DueAmount"), "SaleUserName", "SaleStatusName",
        { Name: "CreateDate", OrderByType: "desc" }, { Name: "RowVersion", IsVisible: false }, { Name: "CreateUser", IsVisible: false }, { Name: "SaleStatus", IsVisible: false }, GetOperation()])
    }
}

function GetOperation() {
    return {
        Name: "Operation",
        Label: "操作",
        IsData: false,
        SelfPropertyName: "CreateUser",
        ActionList: AssignProporties(Sale, [GetEditAction(0), GetDeleteAction(0), GetLookAction(), GetBillAction(), GetUpdateSaleStatus2(1), GetUpdateSaleStatus3(1)])
    }
}

function GetUpdateSaleStatus2(status) {
    return {
        Name: "UpdateSaleStatus2",
        ValueName: "SaleStatus",
        DataValue: status,
        Label: "存档",
        EventActionName: "UpdateSaleStatus",
        Type: "Popconfirm",
        IsSelfOperation: true,
        DataActionType: DataActionTypes.UpdateSaleStatus2,
        SuccessTip: "操作成功！",
        Title: "请确认是否存档当前销售单？"
    }
}


function GetUpdateSaleStatus3(status) {
    return {
        Name: "UpdateSaleStatus3",
        ValueName: "SaleStatus",
        DataValue: status,
        Label: "作废",
        IsSelfOperation: true,
        EventActionName: "UpdateSaleStatus",
        Type: "Popconfirm",
        DataActionType: DataActionTypes.UpdateSaleStatus3,
        SuccessTip: "操作成功！",
        Title: "请确认是否作废当前销售单？"
    }
}

function GetLookAction() {
    return {
        Name: "LookSale",
        Label: "查看",
        EventActionName: "LookSale",
        Type: "AButton"
    }
}

function GetBillAction() {
    return {
        Name: "ToBill",
        IsToPage: true,
        Text: "收支",
        PropertyNames: ["SaleCode", "SaleId"],
        PageUrl: "/PurchaseSaleManage/BillList?DataCode=#{SaleCode}&DataType=2&DataId=#{SaleId}"
    }
}


function GetEditAction(status) {
    return {
        Name: "EditSale",
        ValueName: "SaleStatus",
        DataValue: status,
        Label: "修改",
        EventActionName: "EditSale",
        IsSelfOperation: true,
        Type: "AButton"
    }
}


function GetDeleteAction(status) {
    return {
        Name: "DeleteSale",
        ValueName: "SaleStatus",
        DataValue: status,
        Label: "删除",
        Type: "Popconfirm",
        EventActionName: "DeleteSale",
        IsSelfOperation: true,
        DataActionType: DataActionTypes.DeleteEntityData,
        SuccessTip: "删除成功！",
        Title: "请确认是否删除当前销售单？"
    }
}

function GetSaleCode() {
    return {
        Name: "SaleCode",
        IsToPage: true,
        PageUrl: "/PurchaseSaleManage/SaleDetailList?SaleCode=#{SaleCode}"
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

    html.push("商品金额：<span style=\"color:{TotalSaleAmountColor};\">{TotalSaleAmount}</span>，");
    html.push("商品成本：<span style=\"color:{TotalBidAmountColor};\">{TotalBidAmount}</span>，");
    html.push("商品利润：<span style=\"color:{TotalProfitColor};\">{TotalProfit}</span>，");
    html.push("应收金额：<span style=\"color:{TotalShouldAmountColor};\">{TotalShouldAmount}</span>，");
    html.push("实收金额：<span style=\"color:{TotalRealAmountColor};\">{TotalRealAmount}</span>，");
    html.push("待收金额：<span style=\"color:{TotalDueAmountColor};\">{TotalDueAmount}</span>");

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
    },
    {
        Name: "ExcelExport",
        Type: "DataGridView/ExcelExport",
        DataGridView: "DataGridView1"
    },
    {
        Name: "EditSale",
        Type: "DataGridView/SelectRowToPage",
        DataGridView: "DataGridView1",
        AlertMessage: "AlertMessage",
        PageUrl: "/PurchaseSaleManage/SaleInput?SaleId=#{SaleId}"
    },
    {
        Name: "ToEditPage",
        Type: "Page/ToPage",
        PageUrl: "/PurchaseSaleManage/SaleInput"
    },
    {
        Name: "UpdateSaleStatus",
        Type: "DataGrid/BatchUpdateRowDataList",
        DataGridView: "DataGridView1"
    },
    {
        Name: "LookSale",
        Type: "Dialog/ShowDialogLookData",
        DialogView: "LookSaleView",
        LookView: "SaleEdit2"
    },
    {
        Name: "GetEntityData",
        Type: "EntityEdit/GetEntityData",
        EditView: "SaleEdit2"
    },
    {
        Name: "DeleteSale",
        Type: "DataGrid/BatchUpdateRowDataList",
        DataGridView: "DataGridView1"
    }]
}
