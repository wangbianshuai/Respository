import Order from "../../entities/Order";
import { GetButton, AssignProporties, CreateGuid, GetTextBox, GetSelect, GetSelect2 } from "../Common";

const DataActionTypes = {
    //搜索查询
    SearchQuery: 600,
    //作废
    CancelOrder: 601,
    //转单
    ChangeUser: 602
};

export default {
    Name: "QueryOrderList",
    EventActions: GetEventActions(),
    DialogViews: GetDialogViews(),
    Properties: AssignProporties(Order, [GetSearchOperationView(), GetAlert(), GetDataGridView()])
}

function GetSearchOperationView() {
    return {
        Id: CreateGuid(),
        Name: "SearchOperationView1",
        Entity: Order,
        Type: "RowsColsView",
        ClassName: "DivLeftRightView",
        Properties: AssignProporties(Order, [{ EventActionName: "LookStatusRecord", ...GetButton("LookStatusRecord", "查看流转日志", "primary", 1, 1) },
        { EventActionName: "EditOrder", ...GetButton("EditOrder", "修改", "default", 1, 2) },
        { EventActionName: "ChangeUser", ...GetButton("ChangeUser", "转单", "default", 1, 3) },
        {
            EventActionName: "CancelOrder",
            DataActionType: DataActionTypes.CancelOrder,
            SuccessTip: "作废成功！",
            ConfirmTip: "请确认当前工单是否要被作废？",
            ...GetButton("CancelOrder", "作废", "default", 1, 4)
        },
        { EventActionName: "LookApproveInfo", ...GetButton("LookApproveInfo", "查看审核信息", "default", 1, 5) },
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
    return p;
}

function GetQueryName() {
    const p = GetSelect("QueryName", "", GetQueryNameDataSource(), 2, 2, "OrderCode");
    p.ColStyle = { paddingRight: 0, paddingLeft: 8 };
    p.Width = 100;
    p.IsCondition = true;
    return p;
}

function GetAlert() {
    return {
        Name: "AlertMessage",
        Type: "Alert"
    }
}

function GetDataGridView() {
    return {
        Id: CreateGuid(),
        Name: "DataGridView1",
        Entity: Order,
        Type: "DataGridView",
        EntitySearchQuery: DataActionTypes.SearchQuery,
        EventActionName: "SearchQuery",
        Title: "工单列表",
        IsRowSelection: true,
        IsSingleSelection: true,
        Properties: AssignProporties(Order, ["OrderCode", "Borrowers", "BorrowerUser", "ProductType", "LoanUser", "BorrowerDate", "UpdateDate", "OrderStatus"])
    }
}

function GetQueryNameDataSource() {
    return [{ Value: "OrderCode", Text: "工单编号" }, { Value: "Borrowers", Text: "借款主体" }, { Value: "MainLoanUser", Text: "主借人" }]
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
        PageUrl: "/Orders/StatusNodeLogs?OrderCode=#{OrderCode}"
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
        PageUrl: "/CreditManage/OrderDetail?OrderCode=#{OrderCode}"
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
        PageUrl: "/Auditing/AntiFraudAuditing?OrderCode=#{OrderCode}"
    }]
}

function GetDialogViews() {
    return [{
        Id: CreateGuid(),
        DialogId: CreateGuid(),
        Name: "UpdateEntityEdit1",
        Entity: Order,
        Type: "RowsColsView",
        Title: "转单",
        SuccessTip: "转单成功！",
        UdpateEntityOkActionType: DataActionTypes.ChangeUser,
        Properties: AssignProporties(Order, [
            { ...GetTextBox("CurrentApproveUser", "当前审核用户", "", 1, 1), IsReadOnly: true, ColSpan: 24, IsFormItem: true },
            { ...GetSelect2("ChangeApproveUser", "转派审核用户", GetUserListDataSource(), 2, 1), IsEdit: true, IsNullable: false, PlaceHolder: "可输入关键字检索", AllowClear: true, IsSearch: true, ColSpan: 24, IsFormItem: true }
        ])
    }]
}

function GetUserListDataSource() {
    return {
        ValueName: "UserId",
        TextName: "UserName",
        StateName: "UserList",
        ServiceName: "ApiService",
        ActionName: "GetUserList",
        Payload: {}
    }
}