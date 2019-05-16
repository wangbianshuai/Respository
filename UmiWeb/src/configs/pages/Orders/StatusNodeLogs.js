import OrderStatusLog from "../../entities/OrderStatusLog";
import { AssignProporties, CreateGuid } from "../Common";

const DataActionTypes = {
    //搜索查询
    SearchQuery: 700
};

export default {
    Name: "StatusNodeLogs",
    EventActions: GetEventActions(),
    Properties: AssignProporties(OrderStatusLog, [GetDataGridView()])
}

function GetDataGridView() {
    return {
        Id: CreateGuid(),
        Name: "DataGridView1",
        Entity: OrderStatusLog,
        Type: "DataGridView",
        EntitySearchQuery: DataActionTypes.SearchQuery,
        EventActionName: "SearchQuery",
        Title: "工单编号：#{OrderCode}",
        Style: { marginTop: 8 },
        Properties: AssignProporties(OrderStatusLog, ["StepNo", "NodeName", "LastNodeName", "StartDate", "CompleteDate", "OperationUser", "Result"])
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