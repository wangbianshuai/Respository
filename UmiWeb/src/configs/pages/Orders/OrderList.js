import Order from "../../entities/Order";
import { GetButton, AssignProporties, CreateGuid, GetRadio, GetTextBox, GetSelect } from "../Common";

const DataActionTypes = {
    //搜索查询
    SearchQuery: 100,
    //派单
    DispatchOrder: 101,
    //抢单
    GrabOrder: 102
};

export default {
    Name: "OrderList",
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
        Properties: AssignProporties(Order, [{ EventActionName: "DispatchOrder", ...GetButton("Dispatch", "派单", "primary", 1, 1) },
        {
            EventActionName: "GrabOrder", DataActionType: DataActionTypes.GrabOrder,
            IsNoRowsSelected: true,
            SuccessTip: "抢单成功，请前往我的工单-待处理查看！",
            ...GetButton("GrabOrder", "抢单", "default", 1, 2)
        },
        GetOrderStatus(),
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

function GetOrderStatus() {
    const p = GetRadio("OrderStatus", "", GetStatusDataSource(), 2, 1, "0");
    p.Justify = "end";
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

function GetStatusDataSource() {
    return [{ Value: "0", Text: "待初审" }, { Value: "1", Text: "待实地" }, { Value: "2", Text: "待终审" }]
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
        Name: "DispatchOrder",
        Type: "Dialog/SelectViewDataToList",
        DialogView: "SelectDataToListView",
        DataComponent: "UserList",
        DataGridView: "DataGridView1",
        AlertMessage: "AlertMessage"
    },
    {
        Name: "GrabOrder",
        Type: "DataGrid/BatchUpdateRowDataList",
        DataGridView: "DataGridView1",
        AlertMessage: "AlertMessage"
    }]
}

function GetDialogViews() {
    return [{
        Id: CreateGuid(),
        DialogId: CreateGuid(),
        Name: "SelectDataToListView",
        Entity: Order,
        Type: "Card",
        Title: "派单操作",
        Label: "请选择初审用户",
        Bordered: true,
        Size: "small",
        SuccessTip: "派单成功！",
        SetSelectValuesOkActionType: DataActionTypes.DispatchOrder,//对应具体业务 数据行为类型 101:派单
        DialogStyle: { maxHeight: 500, overflow: "auto" },
        BodyStyle: { padding: 0, margin: 0, paddingLeft: 16 },
        Properties: [{
            Id: CreateGuid(),
            Name: "UserList",
            Type: "CheckBoxGroup",
            ServiceDataSource: GetUserListDataSource(),
            IsFlexColumn: true,
            IsSingleSelection: true
        }]
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