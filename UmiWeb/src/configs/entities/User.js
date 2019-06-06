import { GetProperty } from "./Common";

export default {
    Name: "User",
    PrimaryKey: "UserId",
    Properties: GetProperties()
}

function GetProperties() {
    return [
        GetProperty("UserId", "UserId", "UserId"),
        GetProperty("UserName", "UserName", "姓名"),
        GetProperty("Email", "Email", "邮箱"),
        GetProperty("Phone", "Phone", "手机号码"),
        GetProperty("JobName", "JobName", "职位"),
        GetProperty("DepartName", "DepartName", "部门"),
        GetProperty("CreateUser", "CreateUser", "创建人"),
        GetProperty("CreateDate", "CreateDate", "创建时间"),
        GetProperty("UpdateDate", "UpdateDate", "更新时间")
    ]
}

