import { GetProperty } from "./Common";

export default {
    Name: "OrderStatusLog",
    PrimaryKey: "LogId",
    Properties: GetProperties()
}

function GetProperties() {
    return [
        GetProperty("LogId", "LogId", "LogId"),
        GetProperty("StepNo", "StepNo", "序号"),
        GetProperty("NodeName", "NodeName", "当前节点"),
        GetProperty("LastNodeName", "LastNodeName", "上次节点"),
        GetProperty("StartDate", "StartDate", "开始时间"),
        GetProperty("CompleteDate", "CompleteDate", "完成时间"),
        GetProperty("OperationUser", "OperationUser", "操作人员"),
        GetProperty("Result", "Result", "结果")
    ]
}

