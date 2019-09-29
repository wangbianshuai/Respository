const Order =require( "../../entities/Order");
const { GetButton, AssignProporties, GetTextBox, GetSelect } =require( "../../Common");

const DataActionTypes = {
    //搜索查询
    SearchQuery: 4100
};

module.exports= {
    Name: "OrderDetaiList",
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
        Properties: AssignProporties(Order, [{ EventActionName: "LookOrderDetail", ...GetButton("LookOrderDetail", "进件操作", "primary", 1, 1) },
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
    const p = GetSelect("QueryName", "", Order.QueryNameDataSource2, 2, 2, "loanApplyId");
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
        Title: "进件列表",
        IsRowSelection: true,
        IsSingleSelection: true,
        Properties: AssignProporties(Order, ["OrderCode", "EnterpriseName", "BorrowerUser", "ProductType", "LoanUser", "BorrowerDate", "UpdateDate", "StatusName"])
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
        Name: "LookOrderDetail",
        Type: "DataGridView/SelectRowToPage",
        DataGridView: "DataGridView1",
        AlertMessage: "AlertMessage",
        SetPageUrl: "SetLookOrderDetailUrl",
        PageUrl: "/CreditManage/OrderDetail?OrderCode=#{loanApplyId}"
    }]
}