const Order =require( "../../entities/Order");
const { GetButton, AssignProporties, GetRadio, GetTextBox, GetSelect } =require( "../../Common");

const DataActionTypes = {
    //搜索查询
    SearchQuery: 4300,
    //发标
    Bidding: 4301
};

module.exports= {
    Name: "QueryBidOrderList",
    Type: "View",
    EventActions: GetEventActions(),
    Properties: AssignProporties({Name:"QueryBidOrderList"}, [GetSearchOperationView(), GetAlert(), GetDataGridView()])
}

function GetSearchOperationView() {
    return {
        Name: "SearchOperationView1",
        Entity: Order,
        Type: "RowsColsView",
        ClassName: "DivLeftRightView",
        Properties: AssignProporties({Name:"QueryBidOrderList"}, [{
            EventActionName: "Bidding",
            SuccessTip: "发标完成！",
            ConfirmTip: "请确认当前工单是否发标？",
            DataActionType: DataActionTypes.Bidding,
            ...GetButton("Bidding", "发标", "primary", 1, 1)
        },
        {
            EventActionName: "LookFailReason",
            ColStyle: { paddingLeft: 0 },
            ...GetButton("LookFailReason", "查看失败原因", "default", 1, 2)
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
    const p = GetSelect("QueryName", "", Order.BidQueryNameDataSource, 2, 2, "loanApplyId");
    p.ColStyle = { paddingRight: 0, paddingLeft: 8 };
    p.Width = 120;
    p.IsCondition = true;
    return p;
}

function GetOrderStatus() {
    const p = GetRadio("OrderStatus", "", Order.BidStatusDataSource, 2, 1, "00");
    p.Justify = "end";
    p.ValueChangeEventActionName = "SearchQuery";
    p.IsCondition = true;
    p.IsLoadValue = true;
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
        Title: "发标列表",
        IsRowSelection: true,
        IsSingleSelection: true,
        Properties: AssignProporties(Order, [GetOrderCode(), "Borrowers", "BorrowerUser", "ProductType", "LoanUser", "BorrowerDate", "BidDate", "BidStatus"])
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
        Name: "LookFailReason",
        Type: "DataGridView/AlertByRowData",
        DataGridView: "DataGridView1",
        AlertMessage: "AlertMessage",
        TipMessage: "#{bidIssueDesc}",
        StatusName: "bidIssueResult",
        StatusValue: "02",
        NullTipMessage: "非失败发标！",
        Title: "失败原因"
    },
    {
        Name: "Bidding",
        Type: "DataGrid/BatchUpdateRowDataList",
        DataGridView: "DataGridView1",
        AlertMessage: "AlertMessage"
    }]
}