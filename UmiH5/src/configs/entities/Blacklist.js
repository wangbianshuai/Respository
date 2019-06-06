import { GetProperty } from "./Common";

export default {
    Name: "Blacklist",
    PrimaryKey: "BlacklistId",
    Properties: GetProperties()
}

function GetProperties() {
    return [
        GetProperty("BlacklistId", "BlacklistId", "BlacklistId"),
        GetProperty("UserType", "UserType", "用户类型"),
        GetProperty("Name", "Name", "姓名"),
        GetProperty("CompanyName", "CompanyName", "企业名称"),
        GetProperty("IdNumber", "IdNumber", "身份证号"),
        GetProperty("CompanyIdNumber", "CompanyIdNumber", "统一社会信用代码"),
        GetProperty("Phone", "Phone", "手机号码"),
        GetProperty("Remark", "Remark", "备注"),
        GetProperty("UpdateDate", "UpdateDate", "更新时间")
    ]
}

