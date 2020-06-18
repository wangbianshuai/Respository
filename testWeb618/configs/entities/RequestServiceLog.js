module.exports = {
    Name: "RequestServiceLog",
    PrimaryKey: "LogId",
    Properties: GetProperties(),
    ServiceInterfaceDataSource: GetServiceInterfaceDataSource(),
    IsReSendDataSource: GetIsReSendDataSource()
}

function GetProperties() {
    return [
        GetProperty("LogId", "LogId"),
        GetProperty("LogTypeName", "类型"),
        GetProperty("ServiceInterfaceName", "服务接口名"),
        GetProperty("ReSendCount", "重发次数"),
        GetProperty("IsReSendName", "是否重发记录"),
        GetProperty("StartTime", "开始时间"),
        GetProperty("EndTime", "结束时间"),
        GetProperty("ElapsedMilliseconds", "耗时(毫秒)"),
        GetProperty("CreateDate", "操作时间")
    ]
}

function GetProperty(Name, Label) { return { Name, Label } }

function GetServiceInterfaceDataSource() {
    return {
        ValueName: "ServiceInterfaceId",
        TextName: "Name",
        StateName: "ServiceInterfaces",
        ServiceName: "RequestServiceLogService",
        ActionName: "GetServiceInterfaces",
        IsRefresh: true,
        Payload: {}
    }
}

function GetIsReSendDataSource() {
    return [{ Value: 1, Text: "是" }, { Value: 0, Text: "否" }]
}
