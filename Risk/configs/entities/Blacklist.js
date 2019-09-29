const { GetProperty } =require( "./Common");

module.exports= {
    Name: "Blacklist",
    PrimaryKey: "BlacklistId",
    PropertyPrimaryKey: "blackId",
    Properties: GetProperties()
}

function GetProperties() {
    return [
        GetProperty("BlacklistId", "blackId", "BlacklistId"),
        GetProperty("UserType", "lenderType", "用户类型"),
        GetProperty("Name", "lenderName", "姓名"),
        GetProperty("CompanyName", "lenderName", "企业名称"),
        GetProperty("IdNumber", "lenderIdNumber", "身份证号"),
        GetProperty("CompanyIdNumber", "lenderIdNumber", "统一社会信用代码"),
        GetProperty("Phone", "phone", "手机号码"),
        GetProperty("Remark", "remark", "备注"),
        GetProperty("UpdateDate", "UpdateDate", "更新时间")
    ]
}

