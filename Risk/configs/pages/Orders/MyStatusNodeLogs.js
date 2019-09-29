const OrderStatusLog =require( "../../entities/OrderStatusLog");
const { AssignProporties } =require( "../../Common");

const DataActionTypes = {
    //搜索查询
    SearchQuery: 4400
};

module.exports= {
    Name: "MyStatusNodeLogs",
    Type: "View",
    EventActions: GetEventActions(),
    Properties: AssignProporties(OrderStatusLog, [GetDataGridView()])
}

function GetDataGridView() {
    return {
        Name: "DataGridView1",
        Entity: OrderStatusLog,
        Type: "DataGridView",
        EntitySearchQuery: DataActionTypes.SearchQuery,
        EventActionName: "SearchQuery",
        Title: "工单编号：#{LogOrderCode}",
        Style: { marginTop: 8 },
        Properties: AssignProporties(OrderStatusLog, ["StepNo", "NodeName", "NextNodeName", "StartDate", "CompleteDate", "OperationUser", "Result"])
    }
}

function GetEventActions() {
    return [{
        Name: "SearchQuery",
        Type: "DataGridView/SearchQuery",
        DataGridView: "DataGridView1",
        AlertMessage: "AlertMessage"
    }]
}