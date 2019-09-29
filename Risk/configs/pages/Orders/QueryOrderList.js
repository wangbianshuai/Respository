const Order =require( "../../entities/Order");
const { GetButton, AssignProporties, CreateGuid, GetTextBox, GetSelect, GetSelect2 } =require( "../../Common");

const DataActionTypes = {
    //搜索查询
    SearchQuery: 600,
    //作废
    CancelOrder: 601,
    //转单
    ChangeUser: 602
};

module.exports= {
    Name: "QueryOrderList",
    Type: "View",
    EventActions: GetEventActions(),
    DialogViews: GetDialogViews(),
    Properties: AssignProporties(Order, [GetSearchOperationView(), GetAlert(), GetDataGridView()])
}

function GetSearchOperationView() {
    return {
        Name: "SearchOperationView1",
        Entity: Order,
        Type: "RowsColsView",
        ClassName: "DivLeftRightView",
        Properties: AssignProporties(Order, [{ EventActionName: "LookStatusRecord", ...GetButton("LookStatusRecord", "查看流转日志", "primary", 1, 1) },
        { EventActionName: "EditOrder", ColStyle: { paddingLeft: 0 }, ...GetButton("EditOrder", "修改", "default", 1, 2) },
        { EventActionName: "ChangeUser", ColStyle: { paddingLeft: 0 }, ...GetButton("ChangeUser", "转单", "default", 1, 3) },
        {
            EventActionName: "CancelOrder",
            DataActionType: DataActionTypes.CancelOrder,
            SuccessTip: "作废成功！",
            ColStyle: { paddingLeft: 0 },
            ConfirmTip: "请确认当前工单是否要被作废？",
            ...GetButton("CancelOrder", "作废", "default", 1, 4)
        },
        { EventActionName: "LookApproveInfo", ColStyle: { paddingLeft: 0 }, ...GetButton("LookApproveInfo", "查看审核信息", "default", 1, 5) },
        GetQueryName(),
        GetKeyword()
        ])
    }
}

function GetKeyword() {
    const p = GetTextBox("Keyword", "", "Search", 2, 3, "请输入")
    p.ColStyle = { paddingRight: 8, paddingLeft: 2 };
    p.IsCondition = true;
    p.EventActionName = "SearchQuery";
    p.PressEnterEventActionName = "SearchQuery";
    p.ColStyle = { width: 240 }
    return p;
}

function GetQueryName() {
    const p = GetSelect("QueryName", "", Order.QueryNameDataSource, 2, 2, "loanApplyId");
    p.ColStyle = { paddingRight: 0, paddingLeft: 8 };
    p.Width = 120;
    p.IsCondition = true;
    return p;
}

function GetAlert() {
    return {
        Name: "AlertMessage",
        Type: "Alert",
        DefaultValue: "请选择查询条件执行获取数据！"
    }
}

function GetDataGridView() {
    return {
        Name: "DataGridView1",
        Entity: Order,
        Type: "DataGridView",
        EntitySearchQuery: DataActionTypes.SearchQuery,
        EventActionName: "SearchQuery",
        IsSearchQuery: false,
        Title: "工单列表",
        IsRowSelection: true,
        IsSingleSelection: true,
        Properties: AssignProporties(Order, [GetOrderCode(), "Borrowers", "BorrowerUser", "ProductType", "LoanUser", "BorrowerDate", "UpdateDate", "OrderStatus"])
    }
}

function GetOrderCode() {
    return {
        Name: "OrderCode",
        IsOpenPage: true,
        PageUrl: "/risk/CreditManage/OrderDetail.html?OrderCode=#{loanApplyId}&LookCode=ee1645b3-f024-37c8-b08a-c734b4657aaa"
    }
}

function GetEventActions() {
    return [{
        Name: "SearchQuery",
        Type: "DataGridView/SearchQuery",
        SearchView: "SearchOperationView1",
        SearchButton: "Keyword",
        DataGridView: "DataGridView1",
        AlertMessage: "AlertMessage"
    },
    {
        Name: "LookStatusRecord",
        Type: "DataGridView/SelectRowToPage",
        DataGridView: "DataGridView1",
        AlertMessage: "AlertMessage",
        PageUrl: "/Orders/StatusNodeLogs?LogOrderCode=#{loanApplyId}"
    },
    {
        Name: "ChangeUser",
        Type: "EntityEdit/SelectRowUpdate",
        DialogView: "UpdateEntityEdit1",
        DataGridView: "DataGridView1",
        AlertMessage: "AlertMessage"
    },
    {
        Name: "EditOrder",
        Type: "DataGridView/SelectRowToPage",
        DataGridView: "DataGridView1",
        AlertMessage: "AlertMessage",
        SetPageUrl: "SetEditOrderPageUrl",
        PageUrl: "/CreditManage/OrderDetail?OrderCode=#{loanApplyId}"
    },
    {
        Name: "CancelOrder",
        Type: "DataGrid/BatchUpdateRowDataList",
        DataGridView: "DataGridView1",
        AlertMessage: "AlertMessage"
    },
    {
        Name: "LookApproveInfo",
        Type: "DataGridView/SelectRowToPage",
        DataGridView: "DataGridView1",
        AlertMessage: "AlertMessage",
        IsOpenUrl: true,
        PageUrl: "/risk/Auditing/AntiFraudAuditing?OrderCode=#{loanApplyId}"
    }]
}

function GetDialogViews() {
    return [{
        Id: CreateGuid(),
        DialogId: CreateGuid(),
        Name: "UpdateEntityEdit1",
        Entity: Order,
        Type: "RowsColsView",
        DialogTitle: "转单",
        SuccessTip: "转单成功！",
        ExpandDataLoad: "SetChangeUserDataLoad",
        UdpateEntityOkActionType: DataActionTypes.ChangeUser,
        Properties: AssignProporties(Order, [
            { ...GetTextBox("CurrentApproveUser", "当前审核用户", "", 1, 1), PropertyName: "loanSellerName", IsReadOnly: true, ColSpan: 24, IsFormItem: true },
            { ...GetSelect2("ChangeApproveUser", "转派审核用户", null, 2, 1), ValueName: "UserId", TextName: "UserName", IsEdit: true, IsNullable: false, PlaceHolder: "可输入关键字检索", AllowClear: true, IsSearch: true, ColSpan: 24, IsFormItem: true }
        ])
    }]
}