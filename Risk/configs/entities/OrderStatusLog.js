const { GetProperty } =require( "./Common");

module.exports= {
    Name: "OrderStatusLog",
    PrimaryKey: "seq",
    Properties: GetProperties()
}

function GetProperties() {
    return [
        GetProperty("StepNo", "seq", "序号"),
        GetProperty("NodeName", "curNode", "当前节点"),
        GetProperty("NextNodeName", "nextNode", "下一节点"),
        GetProperty("StartDate", "startTime", "开始时间"),
        GetProperty("CompleteDate", "endTime", "完成时间"),
        GetProperty("OperationUser", "operateBy", "操作人员"),
        GetProperty("Result", "operateResult", "结果")
    ]
}

