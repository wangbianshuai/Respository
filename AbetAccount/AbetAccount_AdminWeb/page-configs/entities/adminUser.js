module.exports = {
    name: "AdminUser",
    viewName: 'ViewAdminUser',
    primaryKey: "UserId",
    properties: getProperties(),
    dataRightDataSource: getDataRightDataSource(),
    operationRightDataSource: getOperationRightDataSource()
}

function getProperties() {
    return [
        getProperty("UserId", "UserId"),
        getProperty("UserName", "用户名"),
        getProperty("LoginName", "登录名"),
        getProperty("IsAdminName", "是否管理员"),
        getProperty("DataRightName", "数据权限"),
        getProperty("OperationRightName", "操作权限"),
        getProperty("LastLoginDate", "最近登录时间"),
        getProperty("CreateDate", "创建时间")
    ]
}

function getProperty(name, label) {
    return { name, label }
}

function getDataRightDataSource() {
    return [{ value: 0, text: "个人" }, { value: 1, text: "全部" }]
}
function getOperationRightDataSource() {
    return [{ value: 0, text: "只读" }, { value: 1, text: "读写" }]
}
