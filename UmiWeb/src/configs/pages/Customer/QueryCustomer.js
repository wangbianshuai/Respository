import Order from "../../entities/Order";
import { GetButton, AssignProporties, CreateGuid, GetTextBox, GetSelect } from "../Common";

//客户管理/客户查询 2500-2599
const DataActionTypes = {
    //获取实体数据
    SearchQuery: 2500
}

export default {
    Name: "QueryCustomer",
    Type: "View",
    EventActions: GetEventActions(),
    Properties: AssignProporties(Order, [GetSearchOperationView(), GetAlert(), GetDataGridView()])
}

function GetSearchOperationView() {
    return {
        Id: CreateGuid(),
        Name: "SearchOperationView1",
        Entity: Order,
        Type: "RowsColsView",
        ClassName: "DivLeftRightView",
        Properties: AssignProporties(Order, [{ EventActionName: "LookApproveInfo", ...GetButton("LookApproveInfo", "查看审核信息", "primary", 1, 1) },
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
    const p = GetSelect("QueryName", "", GetQueryNameDataSource(), 2, 2, "Borrowers");
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
        Title: "客户进件记录",
        IsRowSelection: true,
        IsSingleSelection: true,
        Properties: AssignProporties(Order, ["OrderCode", "Borrowers", "BorrowerUser", "ProductType", "LoanUser", "BorrowerDate", "UpdateDate", "OrderStatus"])
    }
}

function GetQueryNameDataSource() {
    return [{ Value: "Borrowers", Text: "借款主体" }, { Value: "MainLoanUser", Text: "主借人" }]
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
        Name: "LookApproveInfo",
        Type: "DataGridView/SelectRowToPage",
        DataGridView: "DataGridView1",
        AlertMessage: "AlertMessage",
        IsOpenUrl: true,
        PageUrl: "/Auditing/AntiFraudAuditing?OrderCode=#{OrderCode}"
    }]
}