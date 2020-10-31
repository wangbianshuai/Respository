module.exports= {
    name: "AppUser",
    viewName: 'ViewAppUser',
    primaryKey: "AppUserId",
    properties: getProperties()
}

function getProperties() {
    return [
        getProperty("AppUserId", "AppUserId"),
        getProperty("Name", "用户名"),
        getProperty("LoginName", "登录名"),
        getProperty("LastLoginDate", "最近登录时间"),
        getProperty("CreateDate", "创建时间")
    ]
}

function getProperty(name, label) {
    return { name, label }
}