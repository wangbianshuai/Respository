const Order = require("../../entities/Order");
const { GetButton, AssignProporties, CreateGuid, GetRadio, GetTextBox, GetSelect } = require("../../Common");

const DataActionTypes = {
    //搜索查询
    SearchQuery: 100,
    //派单
    DispatchOrder: 101,
    //抢单
    GrabOrder: 102
};

module.exports = {
    Name: "OrderList",
    Type: "View",
    EventActions: GetEventActions(),
    DialogViews: GetDialogViews(),
    Properties: AssignProporties({ Name: "OrderList" }, [GetSearchOperationView(), GetAlert(), GetDataGridView()])
}

function GetSearchOperationView() {
    return {
        Name: "SearchOperationView1",
        Entity: Order,
        Type: "RowsColsView",
        ClassName: "DivLeftRightView",
        Properties: AssignProporties({ Name: "OrderList" }, [{ EventActionName: "DispatchOrder", ...GetButton("Dispatch", "派单", "primary", 1, 1) },
        {
            EventActionName: "GrabOrder", DataActionType: DataActionTypes.GrabOrder,
            IsNoRowsSelected: true,
            ColStyle: { paddingLeft: 0 },
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

function GetOrderStatus() {
    const p = GetRadio("OrderStatus", "", Order.StatusDataSource, 2, 1, "03");
    p.Justify = "end";
    p.ValueChangeEventActionName = "SearchQuery";
    p.IsCondition = true;
    p.IsLoadValue = true;
    p.IsVisible = false;
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
        Name: "DataGridView1",
        Entity: Order,
        Type: "DataGridView",
        EntitySearchQuery: DataActionTypes.SearchQuery,
        EventActionName: "SearchQuery",
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
        AlertMessage: "AlertMessage",
        ExpandSearchQueryLoad: "ExpandSearchQueryLoad"
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
        AlertMessage: "AlertMessage",
        EntityProperties: ["OrderStatus"]
    }]
}

function GetDialogViews() {
    return [{
        Id: CreateGuid(),
        DialogId: CreateGuid(),
        Name: "SelectDataToListView",
        Entity: Order,
        Type: "Card",
        DialogTitle: "派单操作",
        Title: "请选择初审用户",
        Bordered: true,
        Size: "small",
        SuccessTip: "派单成功！",
        SetSelectValuesOkActionType: DataActionTypes.DispatchOrder,//对应具体业务 数据行为类型 101:派单
        DialogStyle: { maxHeight: 500, overflow: "auto" },
        Properties: [{
            Id: CreateGuid(),
            Name: "UserList",
            Type: "CheckBoxGroup",
            IsFlexColumn: true,
            IsSingleSelection: true,
            ValueName: "UserId",
            TextName: "UserName"
        }]
    }]
}