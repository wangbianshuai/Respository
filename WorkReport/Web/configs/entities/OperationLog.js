module.exports = {
    Name: "OperationLog",
    PrimaryKey: "LogId",
    Properties: GetProperties()
}

function GetProperties() {
    return [
        GetProperty("LogId", "LogId"),
        GetProperty("LogType", "类型"),
        GetProperty("RequestType", "请求类型"),
        GetProperty("EntityName", "实体名"),
        GetProperty("MethodName", "方法名"),
        GetProperty("CreateDate", "操作时间"),
        GetProperty("UserName", "操作人"),
        GetProperty("StartTime", "开始时间"),
        GetProperty("EndTime", "结束时间"),
        GetProperty("ElapsedMilliseconds", "耗时(毫秒)"),
        GetProperty("LookDetail", "详细"),
        GetProperty("IPAddress", "IP地址")
    ]
}

function GetProperty(Name, Label) { return { Name, Label } }