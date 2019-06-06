import { GetProperty } from "./Common";

export default {
    Name: "NetCheck",
    PrimaryKey: "NetCheckId",
    Properties: GetProperties()
}

function GetProperties() {
    return [
        GetProperty("NetCheckId", "NetCheckId", "NetCheckId"),
        GetProperty("UserName", "UserName", "用户名"),
        GetProperty("BorrowerUser", "BorrowerUser", "主借人"),
        GetProperty("Phone", "Phone", "手机号"),
        GetProperty("IdNumber", "IdNumber", "身份证号"),
        GetProperty("LoanUser", "LoanUser", "信贷员"),
        GetProperty("ReviewDate", "ReviewDate", "申请复核时间"),
        GetProperty("QueryDate", "QueryDate", "网查时间"),
        GetProperty("NetCheckStatus", "NetCheckStatus", "状态")
    ]
}

