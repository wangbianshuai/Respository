module.exports= {
    Name: "User",
    PrimaryKey: "UserId",
    Properties: GetProperties()
}

function GetProperties() {
    return [
        GetProperty("UserId", "UserId"),
        GetProperty("UserName", "用户名"),
        GetProperty("LoginName", "登录名"),
        GetProperty("LastLoginDate", "最近登录时间"),
        GetProperty("CreateDate", "创建时间")
    ]
}

function GetProperty(Name, Label) {
    return { Name, Label }
}