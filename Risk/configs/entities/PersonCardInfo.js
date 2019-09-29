const { GetProperty } =require( "./Common");

module.exports= {
    Name: "PersonCardInfo",
    PrimaryKey: "Id",
    Properties: GetProperties()
}

/*name (string, optional): 个人证件-姓名 ,
idCard (string, optional): 个人证件-身份证号 ,
gender (string, optional): 个人证件-性别 ,
nationality (string, optional): 个人证件-民族 ,
birthday (string, optional): 个人证件-出生年月 ,
idCardAddress (string, optional): 个人证件-身份证地址 ,
issueAuthority (string, optional): 个人证件-签发机关 ,
validityStartDate (string, optional): 个人证件-证件起始有效期 ,
validityEndDate (string, optional): 个人证件-证件截止有效期*/
function GetProperties() {
    return [
        GetProperty("UserName", "name", "姓名"),
        GetProperty("IdNumber", "idCard", "身份证号"),
        GetProperty("Sex", "genderName", "性别"),
        GetProperty("Nation", "nationalityName", "民族"),
        GetProperty("Birthday", "birthday", "出生年月"),
        GetProperty("Address", "idCardAddress", "身份证地址"),
        GetProperty("SignUnit", "issueAuthority", "签发机关"),
        GetProperty("Period", "Period", "证件有效期"),
        GetProperty("ApprovalRemark", "ApprovalRemark", "审核备注")
    ]
}

