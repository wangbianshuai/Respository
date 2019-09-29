const { GetProperty } =require( "./Common");

module.exports= {
    Name: "User",
    PrimaryKey: "UserId",
    PropertyPrimaryKey: "userId",
    Properties: GetProperties()
}

function GetProperties() {
    return [
        GetProperty("UserId", "userId", "UserId"),
        GetProperty("UserCode", "employeeId", "员工编号"),
        GetProperty("UserName", "name", "姓名"),
        GetProperty("Email", "email", "邮箱"),
        GetProperty("Phone", "phone", "手机号码"),
        GetProperty("JobName", "job", "职位"),
        GetProperty("DepartName", "department", "部门")
    ]
}

