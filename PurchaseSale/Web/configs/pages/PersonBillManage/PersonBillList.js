const PersonBill = require("../../entities/PersonBill");
const { GetButton, AssignProporties, GetTextBox, GetSelect, GetDatePicker } = require("../../Common");

//个人记账/个人收支 1700-1799
const DataActionTypes = {
    //搜索查询
    SearchQuery: 1700,
    //删除实体数据
    DeleteEntityData: 1701
};

const Entity = { Name: PersonBill.Name, PrimaryKey: PersonBill.PrimaryKey, ViewName: "ViewPersonBill", IsGroupByInfo: true }

module.exports = {
    Name: "PersonBillList",
    Type: "View",
    EventActions: GetEventActions(),
    Properties: AssignProporties({ Name: "PersonBillList" }, [GetSearchOperationView(), GetDataGridView()])
}

function GetSearchOperationView() {
    return {
        Name: "SearchOperationView1",
        Entity: Entity,
        Type: "RowsColsView",
        ClassName: "DivSerachView",
        Properties: AssignProporties({ Name: "PersonBillList" }, [
            GetEditSelect("BillTypeId", "类型", PersonBill.PersonTypeDataSource, 1, 1),
            { ...GetDatePicker2("StartDate", "盘点日期", 1, 2, "大于或等于其值"), PropertyName: "CheckDate", OperateLogic: ">=" },
            { ...GetDatePicker2("EndDate", "至", 1, 3, "小于其值"), PropertyName: "CheckDate", OperateLogic: "<" },
            GetEditSelect("IncomePayment", "收支", PersonBill.IncomePaymentDataSource, 2, 1),
            {
                ...GetTextBox2("Remark", "备注", 2, 3, "", ""),
                OperateLogic: "like", PressEnterEventActionName: "SearchQuery"
            },
            { ...GetButton("Search", "搜索", "primary", 2, 4), IsFormItem: true, Icon: "search", EventActionName: "SearchQuery", PressEnterEventActionName: "SearchQuery" },
            { ...GetButton("ClearQuery", "清空", "default", 2, 5), IsFormItem: true, EventActionName: "ClearQuery" },
            { EventActionName: "ToEditPage", ...GetButton("ToEditPage", "新增", "primary", 3, 1), Style: { marginLeft: 16, marginBottom: 16 } },
            {
                EventActionName: "DeletePersonBill",
                ColStyle: { paddingLeft: 0 },
                DataActionType: DataActionTypes.DeleteEntityData,
                SuccessTip: "删除成功！",
                ConfirmTip: "请确认是否删除当前个人收支？",
                ...GetButton("DeletePersonBill", "删除", "default", 3, 4)
            }
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
        IsRowSelection: true,
        IsSingleSelection: true,
        GroupByInfoHtml: GetGroupByInfoHtml(),
        Properties: AssignProporties(PersonBill, ["BillDate", "PersonBillTypeName", "IncomePaymentName", GetAmount("Amount"), { Name: "CreateDate", OrderByType: "desc" }, { Name: "RowVersion", IsVisible: false }])
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
        Name: "ToEditPage",
        Type: "Page/ToPage",
        PageUrl: "/ProductManage/PersonBillEdit"
    },
    {
        Name: "DeletePersonBill",
        Type: "DataGrid/BatchUpdateRowDataList",
        DataGridView: "DataGridView1"
    }]
}
