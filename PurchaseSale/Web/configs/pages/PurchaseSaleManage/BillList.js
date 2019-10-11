const Bill = require("../../entities/Bill");
const { GetButton, AssignProporties, GetTextBox, GetSelect, GetDatePicker } = require("../../Common");

//进销管理/收支明细 2300-2399
const DataActionTypes = {
    //搜索查询
    SearchQuery: 2300,
    //删除实体数据
    DeleteEntityData: 2301
};

const Entity = { Name: Bill.Name, PrimaryKey: Bill.PrimaryKey, ViewName: "ViewBill", IsGroupByInfo: true }

module.exports = {
    Name: "BillList",
    Type: "View",
    EventActions: GetEventActions(),
    Properties: AssignProporties({ Name: "BillList" }, [GetSearchOperationView(), GetDataGridView()])
}

function GetSearchOperationView() {
    return {
        Name: "SearchOperationView1",
        Entity: Entity,
        Type: "RowsColsView",
        ClassName: "DivSerachView",
        Properties: AssignProporties({ Name: "BillList" }, [
            GetEditSelect("BillTypeId", "类型", Bill.PersonTypeDataSource, 1, 1),
            { ...GetDatePicker2("StartDate", "日期", 1, 2, "大于或等于其值"), PropertyName: "BillDate", OperateLogic: ">=" },
            { ...GetDatePicker2("EndDate", "至", 1, 3, "小于其值"), PropertyName: "BillDate", OperateLogic: "<" },
            GetEditSelect2("IncomePayment", "收支", Bill.IncomePaymentDataSource, 2, 1),
            GetEditSelect("CreateUser", "经手人", Bill.UserDataSource, 2, 2),
            {
                ...GetTextBox2("Keyword", "关键字", 2, 3, "", "进销单号/备注"), PropertyName: "DataCode,Remark",
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
        Properties: AssignProporties(Bill, ["BillDate", GetDataCode(), "BillTypeName", "IncomePaymentName", GetAmount("Amount2"), "CreateUserName", "Remark",
            { Name: "CreateDate", OrderByType: "desc" }, { Name: "RowVersion", IsVisible: false }, { Name: "DataPageUrl", IsVisible: false }, { Name: "CreateUser", IsVisible: false }, GetOperation()])
    }
}

function GetOperation() {
    return {
        Name: "Operation",
        Label: "操作",
        IsData: false,
        SelfPropertyName: "CreateUser",
        ActionList: AssignProporties(Bill, [GetEditAction(), GetDeleteAction()])
    }
}

function GetEditAction() {
    return {
        Name: "EditBill",
        Label: "修改",
        EventActionName: "EditBill",
        IsSelfOperation: true,
        Type: "AButton"
    }
}

function GetDeleteAction() {
    return {
        Name: "DeleteBill",
        Label: "删除",
        Type: "Popconfirm",
        EventActionName: "DeleteBill",
        IsSelfOperation: true,
        DataActionType: DataActionTypes.DeleteEntityData,
        SuccessTip: "删除成功！",
        Title: "请确认是否删除当前收支明细？"
    }
}

function GetDataCode() {
    return {
        Name: "DataCode",
        IsToPage: true,
        IsUrl: false,
        PageUrl: "/PurchaseSaleManage/#{DataPageUrl}"
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

    html.push("收入：<span style=\"color:#1890ff;\">{TotalIncome}</span>，");
    html.push("支出：<span style=\"color:red;\">{TotalPayment}</span>，");
    html.push("结余：<span style=\"color:{TotalBalanceColor};\">{TotalBalance}</span>");

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
        Name: "EditBill",
        Type: "DataGridView/SelectRowToPage",
        DataGridView: "DataGridView1",
        AlertMessage: "AlertMessage",
        PageUrl: "/PurchaseSaleManage/BillEdit?Id=#{Id}&MenuName=" + escape("修改"),
        ExpandSetPageUrl: "ExpandSetPageUrl"
    },
    {
        Name: "ToEditPage",
        Type: "Page/ToPage",
        PageUrl: "/PurchaseSaleManage/BillEdit",
        ExpandSetPageUrl: "ExpandSetPageUrl"
    },
    {
        Name: "DeleteBill",
        Type: "DataGrid/BatchUpdateRowDataList",
        DataGridView: "DataGridView1"
    }]
}
