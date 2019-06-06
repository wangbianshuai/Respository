import { GetProperty } from "./Common";

export default {
    Name: "CautionerInfo",
    PrimaryKey: "OrderCode",
    Properties: GetProperties(),
    UserTypeDataSource: GetUserTypeDataSource(),
    CautionerTypeDataSource: GetCautionerTypeDataSource(),
    LoanRelationDataSource: GetLoanRelationDataSource()
}

function GetProperties() {
    return [
        GetProperty("UserType", "UserType", "用户类型"),
        GetProperty("Name", "Name", "姓名/企业名称"),
        GetProperty("IdNumber", "IdNumber", "身份证号/统一社会信用代码"),
        GetProperty("Phone", "Phone", "联系方式"),
        GetProperty("Email", "Email", "邮箱"),
        GetProperty("BankCardNo", "BankCardNo", "银行卡号"),
        GetProperty("OpenBank", "OpenBank", "开户行"),
        GetProperty("BankInfo", "BankInfo", "支行信息"),
        GetProperty("CautionerType", "CautionerType", "担保主体"),
        GetProperty("LoanRelation", "LoanRelation", "与借款主体关系")
    ]
}

function GetUserTypeDataSource() {
    return [{ Value: 1, Text: "个人" }, { Value: 0, Text: "单位" }]
}

function GetCautionerTypeDataSource() {
    return [{ Value: 1, Text: "个人" }, { Value: 0, Text: "单位" }]
}

function GetLoanRelationDataSource() {
    return [{ Value: 1, Text: "个人" }, { Value: 0, Text: "单位" }]
}