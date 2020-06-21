module.exports = {
    name: "RequestServiceLog",
    viewName: 'ViewRequestServiceLog',
    primaryKey: "LogId",
    properties: getProperties(),
    serviceInterfaceDataSource: getServiceInterfaceDataSource(),
    isReSendDataSource: getisReSendDataSource()
}

function getProperties() {
    return [
        getProperty("LogId", "LogId"),
        getProperty("LogTypeName", "类型"),
        getProperty("ServiceInterfaceName", "服务接口名"),
        getProperty("ReSendCount", "重发次数"),
        getProperty("isReSendName", "是否重发记录"),
        getProperty("StartTime", "开始时间"),
        getProperty("EndTime", "结束时间"),
        getProperty("ElapsedMilliseconds", "耗时(毫秒)"),
        getProperty("CreateDate", "操作时间")
    ]
}

function getProperty(name, label) { return { name, label } }

function getServiceInterfaceDataSource() {
    return {
        valueName: "ServiceInterfaceId",
        textName: "Name",
        StateName: "ServiceInterfaces",
        ServiceName: "RequestServiceLogService",
        ActionName: "getServiceInterfaces",
        isRefresh: true,
        payload: {}
    }
}

function getisReSendDataSource() {
    return [{ value: 1, text: "是" }, { value: 0, text: "否" }]
}
