import { GetProperty } from "./Common";

export default {
    Name: "Blacklist",
    PrimaryKey: "BlacklistId",
    Properties: GetProperties()
}

function GetProperties() {
    return [
        GetProperty("BlacklistId", "BlacklistId", "BlacklistId", "long"),
        GetProperty("UserType", "UserType", "用户类型", "string", false),
        GetProperty("Name", "Name", "姓名", "string", false, 50),
        GetProperty("CompanyName", "CompanyName", "企业名称", "string", false, 100),
        GetProperty("IdNumber", "IdNumber", "身份证号", "string", false),
        GetProperty("CompanyIdNumber", "CompanyIdNumber", "统一社会信用代码", "string", false),
        GetProperty("Phone", "Phone", "手机号码", "string", false),
        GetProperty("Remark", "Remark", "备注", "string", false),
        GetProperty("UpdateDate", "UpdateDate", "更新时间", "date", false)
    ]
}

