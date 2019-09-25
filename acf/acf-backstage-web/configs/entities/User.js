module.exports= {
    Name: "User",
    PrimaryKey: "User_Id",
    Properties: GetProperties()
}

function GetProperties() {
    return [
        GetProperty("User_Id", "User_Id"),
        GetProperty("User_Name", "用户名"),
        GetProperty("Login_Name", "登录名"),
        GetProperty("Last_Login_Date", "最近登录时间"),
        GetProperty("Create_Date", "创建时间")
    ]
}

function GetProperty(Name, Label) {
    return { Name, Label }
}