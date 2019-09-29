const { GetProperty } =require( "./Common");

module.exports= {
    Name: "NetCheck",
    PrimaryKey: "NetCheckId",
    PropertyPrimaryKey: "id",
    Properties: GetProperties()
}

function GetProperties() {
    return [
        GetProperty("NetCheckId", "id", "NetCheckId"),
        GetProperty("UserName", "userName", "用户名"),
        GetProperty("BorrowerUser", "name", "借款人"),
        GetProperty("Phone", "mobile", "手机号"),
        GetProperty("IdNumber", "idNumber", "身份证号"),
        GetProperty("LoanUser", "employeeName", "信贷员"),
        GetProperty("ReviewDate", "applyTimeF", "申请复核时间"),
        GetProperty("QueryDate", "wcTimeF", "网查时间"),
        GetProperty("NetCheckStatus", "statusF", "状态")
    ]
}

