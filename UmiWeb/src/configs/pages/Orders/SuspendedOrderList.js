import Order from "../../entities/Order";
import { GetButton, AssignProporties, CreateGuid, GetTextBox, GetSelect } from "../Common";

const DataActionTypes = {
    //搜索查询
    SearchQuery: 500,
    //解挂
    UnHandUpOrder: 501
};

export default {
    Name: "SuspendedOrderList",
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
        Properties: AssignProporties(Order, [
            {
                EventActionName: "UnHandUpOrder", DataActionType: DataActionTypes.UnHandUpOrder,
                SuccessTip: "挂起完成，请前往我的工单-待处理查看！",
                ConfirmTip: "请确认当前工单是否解挂？",
                ...GetButton("UnHandUpOrder", "解挂", "primary", 1, 1)
            },
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
        EventActionName: "SearchQuery",
        EntitySearchQuery: DataActionTypes.SearchQuery,//对应具体业务 数据行为类型 500:搜索查询
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
        Name: "UnHandUpOrder",
        Type: "DataGrid/BatchUpdateRowDataList",
        DataGridView: "DataGridView1",
        AlertMessage: "AlertMessage"
    }]
}