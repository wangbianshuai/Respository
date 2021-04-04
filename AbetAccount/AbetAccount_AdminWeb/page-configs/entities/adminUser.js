module.exports = {
    name: "AdminUser",
    viewName: 'ViewAdminUser',
    primaryKey: "UserId",
    properties: getProperties(),
    accountTypesDataSource: getAccountTypesDataSource()
}

function getProperties() {
    return [
        getProperty("UserId", "UserId"),
        getProperty("UserName", "用户名"),
        getProperty("LoginName", "登录名"),
        getProperty("IsAdminName", "是否管理员"),
        getProperty("LastLoginDate", "最近登录时间"),
        getProperty("CreateDate", "创建时间")
    ]
}

function getProperty(name, label) {
    return { name, label }
}

function getAccountTypesDataSource() {
    return {
        valueName: "TypeId",
        textName: "Name",
        stateName: "getAccountTypes",
        serviceName: "AccountTypeService",
        actionName: "getAccountTypes",
        isRefresh: true,
        payload: {}
    }
}
