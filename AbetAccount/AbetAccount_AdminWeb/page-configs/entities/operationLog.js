module.exports = {
    name: "OperationLog",
    viewName: 'ViewOperationLog',
    primaryKey: "LogId",
    properties: getProperties()
}

function getProperties() {
    return [
        getProperty("LogId", "LogId"),
        getProperty("LogType", "类型"),
        getProperty("RequestType", "请求类型"),
        getProperty("EntityName", "实体名"),
        getProperty("MethodName", "方法名"),
        getProperty("CreateDate", "操作时间"),
        getProperty("UserName", "操作人"),
        getProperty("StartTime", "开始时间"),
        getProperty("EndTime", "结束时间"),
        getProperty("ElapsedMilliseconds", "耗时(毫秒)"),
        getProperty("LookDetail", "详细"),
        getProperty("IPAddress", "IP地址")
    ]
}

function getProperty(name, label) { return { name, label } }