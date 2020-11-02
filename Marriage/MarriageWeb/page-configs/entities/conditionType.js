module.exports = {
    name: "ConditionType",
    viewName: 'ViewConditionType',
    primaryKey: "ConditionTypeId",
    properties: getProperties(),
    sexDataSource: getSexDataSource(),
    dataTypeDataSource: getDataTypeDataSource(),
    dataSourceDataSource:getDataSourceDataSource()
}

function getProperties() {
    return [
        getProperty("ConditionTypeId", "ConditionTypeId"),
        getProperty("Name", "名称"),
        getProperty("Remark", "备注"),
        getProperty("CreateDate", "创建时间")
    ]
}

function getProperty(name, label) { return { name, label } }

function getSexDataSource() {
    return [{ value: 0, text: "通用" }, { value: 1, text: "男生" }, { value: 2, text: "女生" }]
}

function getDataTypeDataSource() {
    return [{ value: 'string', text: "字符串" }, { value: "number", text: "数值" }, { value: "bool", text: "布尔值" }]
}

function getDataSourceDataSource() {
    return {
        valueName: "DataSourceId",
        textName: "Name",
        stateName: "getDataSources",
        serviceName: "DataSourceService",
        actionName: "getDataSources",
        isRefresh: true,
        payload: {}
    }
}