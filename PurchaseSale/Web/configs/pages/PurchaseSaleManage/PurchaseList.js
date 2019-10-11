const Purchase = require("../../entities/Purchase");
const { GetButton, AssignProporties, GetTextBox, GetSelect, GetDatePicker } = require("../../Common");
const LookPurchaseView = require("./LookPurchaseView");

//进销管理/采购单列表 2900-2999
const DataActionTypes = {
    //搜索查询
    SearchQuery: 2900,
    //删除实体数据
    DeleteEntityData: 2901,
    //更新采购状态
    UpdatePurchaseStatus2: 2902,
    //更新采购状态
    UpdatePurchaseStatus3: 2903
};

const Entity = { Name: Purchase.Name, PrimaryKey: Purchase.PrimaryKey, ViewName: "ViewPurchase", IsGroupByInfo: true }

module.exports = {
    Name: "PurchaseList",
    Type: "View",
    DialogViews: [LookPurchaseView],
    EventActions: GetEventActions(),
    Properties: AssignProporties({ Name: "PurchaseList" }, [GetSearchOperationView(), GetDataGridView()])
}

function GetSearchOperationView() {
    return {
        Name: "SearchOperationView1",
        Entity: Entity,
        Type: "RowsColsView",
        ClassName: "DivSerachView",
        Properties: AssignProporties({ Name: "PurchaseList" }, [

            { ...GetDatePicker2("StartDate", "日期", 1, 1, "大于或等于其值"), PropertyName: "PurchaseDate", OperateLogic: ">=" },
            { ...GetDatePicker2("EndDate", "至", 1, 2, "小于其值"), PropertyName: "PurchaseDate", OperateLogic: "<" },
            GetEditSelect2("PurchaseType", "类型", Purchase.PurchaseTypeDataSource, 1, 3),
            GetEditSelect2("AmountType", "付款状态", Purchase.AmountTypeDataSource, 1, 4),
            GetEditSelect2("PurchaseStatus", "状态", Purchase.PurchaseStatusDataSource, 2, 1),
            GetEditSelect("PurchaseUser", "采购员", Purchase.UserDataSource, 2, 2),
            {
                ...GetTextBox2("Keyword", "关键字", 2, 3, "", "采购单号/供应商名称/备注"), PropertyName: "PurchaseCode,SupplierName,Remark",
                OperateLogic: "like", PressEnterEventActionName: "SearchQuery"
            },
            { ...GetButton("Search", "搜索", "primary", 2, 4), IsFormItem: true, Icon: "search", EventActionName: "SearchQuery", PressEnterEventActionName: "SearchQuery" },
            { ...GetButton("ClearQuery", "清空", "default", 2, 5), IsFormItem: true, EventActionName: "ClearQuery" },
            { EventActionName: "ToEditPage", ...GetButton("ToEditPage", "新增", "primary", 3, 1), Style: { marginLeft: 16, marginBottom: 16 } }
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
        EventActionName: "SearchQuery",
        IsDiv: true,
        ClassName: "DivInfoView3",
        GroupByInfoHtml: GetGroupByInfoHtml(),
        Properties: AssignProporties(Purchase, [GetPurchaseCode(), "PurchaseDate", GetAmount("PurchaseAmount"),
        GetAmount("ShouldAmount2"), GetAmount("RealAmount2"), GetAmount("DueAmount"), "PurchaseUserName", "PurchaseStatusName",
        { Name: "CreateDate", OrderByType: "desc" }, { Name: "RowVersion", IsVisible: false }, { Name: "CreateUser", IsVisible: false }, { Name: "PurchaseStatus", IsVisible: false }, GetOperation()])
    }
}

function GetOperation() {
    return {
        Name: "Operation",
        Label: "操作",
        IsData: false,
        SelfPropertyName: "CreateUser",
        ActionList: AssignProporties(Purchase, [GetEditAction(0), GetDeleteAction(0), GetLookAction(), GetBillAction(), GetUpdatePurchaseStatus2(1), GetUpdatePurchaseStatus3(1)])
    }
}

function GetUpdatePurchaseStatus2(status) {
    return {
        Name: "UpdatePurchaseStatus2",
        ValueName: "PurchaseStatus",
        DataValue: status,
        Label: "存档",
        EventActionName: "UpdatePurchaseStatus",
        Type: "Popconfirm",
        IsSelfOperation: true,
        DataActionType: DataActionTypes.UpdatePurchaseStatus2,
        SuccessTip: "操作成功！",
        Title: "请确认是否存档当前采购单？"
    }
}


function GetUpdatePurchaseStatus3(status) {
    return {
        Name: "UpdatePurchaseStatus3",
        ValueName: "PurchaseStatus",
        DataValue: status,
        Label: "作废",
        IsSelfOperation: true,
        EventActionName: "UpdatePurchaseStatus",
        Type: "Popconfirm",
        DataActionType: DataActionTypes.UpdatePurchaseStatus3,
        SuccessTip: "操作成功！",
        Title: "请确认是否作废当前采购单？"
    }
}

function GetLookAction() {
    return {
        Name: "LookPurchase",
        Label: "查看",
        EventActionName: "LookPurchase",
        Type: "AButton"
    }
}

function GetBillAction() {
    return {
        Name: "ToBill",
        IsToPage: true,
        Text: "付支",
        PropertyNames: ["PurchaseCode", "PurchaseId"],
        PageUrl: "/PurchaseSaleManage/BillList?DataCode=#{PurchaseCode}&DataType=2&DataId=#{PurchaseId}"
    }
}


function GetEditAction(status) {
    return {
        Name: "EditPurchase",
        ValueName: "PurchaseStatus",
        DataValue: status,
        Label: "修改",
        EventActionName: "EditPurchase",
        IsSelfOperation: true,
        Type: "AButton"
    }
}


function GetDeleteAction(status) {
    return {
        Name: "DeletePurchase",
        ValueName: "PurchaseStatus",
        DataValue: status,
        Label: "删除",
        Type: "Popconfirm",
        EventActionName: "DeletePurchase",
        IsSelfOperation: true,
        DataActionType: DataActionTypes.DeleteEntityData,
        SuccessTip: "删除成功！",
        Title: "请确认是否删除当前采购单？"
    }
}

function GetPurchaseCode() {
    return {
        Name: "PurchaseCode",
        IsToPage: true,
        PageUrl: "/PurchaseSaleManage/PurchaseDetailList?PurchaseCode=#{PurchaseCode}"
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

    html.push("商品金额：<span style=\"color:{TotalPurchaseAmountColor};\">{TotalPurchaseAmount}</span>，");
    html.push("应付金额：<span style=\"color:{TotalShouldAmountColor};\">{TotalShouldAmount}</span>，");
    html.push("实付金额：<span style=\"color:{TotalRealAmountColor};\">{TotalRealAmount}</span>，");
    html.push("待付金额：<span style=\"color:{TotalDueAmountColor};\">{TotalDueAmount}</span>");

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
        Name: "EditPurchase",
        Type: "DataGridView/SelectRowToPage",
        DataGridView: "DataGridView1",
        AlertMessage: "AlertMessage",
        PageUrl: "/PurchaseSaleManage/PurchaseInput?PurchaseId=#{PurchaseId}"
    },
    {
        Name: "ToEditPage",
        Type: "Page/ToPage",
        PageUrl: "/PurchaseSaleManage/PurchaseInput"
    },
    {
        Name: "UpdatePurchaseStatus",
        Type: "DataGrid/BatchUpdateRowDataList",
        DataGridView: "DataGridView1"
    },
    {
        Name: "LookPurchase",
        Type: "Dialog/ShowDialogLookData",
        DialogView: "LookPurchaseView",
        LookView: "PurchaseEdit2"
    },
    {
        Name: "GetEntityData",
        Type: "EntityEdit/GetEntityData",
        EditView: "PurchaseEdit2"
    },
    {
        Name: "DeletePurchase",
        Type: "DataGrid/BatchUpdateRowDataList",
        DataGridView: "DataGridView1"
    }]
}
