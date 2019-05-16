import { GetProperty } from "./Common";

export default {
    Name: "OrderStatusLog",
    PrimaryKey: "LogId",
    Properties: GetProperties()
}

function GetProperties() {
    return [
        GetProperty("LogId", "LogId", "LogId", "long"),
        GetProperty("StepNo", "StepNo", "序号", "int", false),
        GetProperty("NodeName", "NodeName", "当前节点", "string", false, 100),
        GetProperty("LastNodeName", "LastNodeName", "上次节点", "string", false, 100),
        GetProperty("StartDate", "StartDate", "开始时间", "date", false),
        GetProperty("CompleteDate", "CompleteDate", "完成时间", "date", false),
        GetProperty("OperationUser", "OperationUser", "操作人员", "string", false),
        GetProperty("Result", "Result", "结果", "string", false)
    ]
}

