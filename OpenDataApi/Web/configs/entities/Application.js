module.exports= {
    Name: "Application",
    PrimaryKey: "Applcation_Id",
    Properties: GetProperties()
}

function GetProperties() {
    return [
        GetProperty("Applcation_Id", "Applcation_Id"),
        GetProperty("Name", "应用名"),
        GetProperty("Connection_String", "链接字符串"),
        GetProperty("Db_User", "用户名"),
        GetProperty("Db_Password", "密码"),
        GetProperty("Remark", "备注"),
        GetProperty("Create_Date", "创建时间")
    ]
}

function GetProperty(Name, Label) {
    return { Name, Label }
}