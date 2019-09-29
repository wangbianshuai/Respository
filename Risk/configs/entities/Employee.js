const { GetProperty } =require( "./Common");

module.exports= {
    Name: "Employee",
    PrimaryKey: "userCode",
    Properties: GetProperties()
}

function GetProperties() {
    return [
        GetProperty("UserCode", "usercode", "员工编号"),
        GetProperty("UserName", "realname", "姓名"),
        GetProperty("Email", "email", "邮箱"),
        GetProperty("Phone", "mobile", "手机号码"),
        GetProperty("JobName", "position", "职位"),
        GetProperty("DepartName", "depStr", "部门")
    ]
}

