const Order =require( "../../entities/Order");
const { GetButton, AssignProporties, GetTextBox, GetSelect } =require( "../../Common");

const DataActionTypes = {
    //搜索查询
    SearchQuery: 400
};

module.exports= {
    Name: "HandledOrderList",
    Type: "View",
    EventActions: GetEventActions(),
    Properties: AssignProporties(Order, [GetSearchOperationView(), GetAlert(), GetDataGridView()])
}

function GetSearchOperationView() {
    return {
        Name: "SearchOperationView1",
        Entity: Order,
        Type: "RowsColsView",
        ClassName: "DivLeftRightView",
        Properties: AssignProporties(Order, [{ EventActionName: "LookStatusRecord", ...GetButton("LookStatusRecord", "查看流转日志", "primary", 1, 1) },
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
        AlertMessage: "AlertMessage"
    },
    {
        Name: "LookStatusRecord",
        Type: "DataGridView/SelectRowToPage",
        DataGridView: "DataGridView1",
        AlertMessage: "AlertMessage",
        PageUrl: "/Orders/MyStatusNodeLogs?LogOrderCode=#{loanApplyId}"
    }]
}