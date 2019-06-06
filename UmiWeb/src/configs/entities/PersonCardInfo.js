import { GetProperty } from "./Common";

export default {
    Name: "PersonCardInfo",
    PrimaryKey: "Id",
    Properties: GetProperties()
}

function GetProperties() {
    return [
        GetProperty("UserName", "UserName", "姓名"),
        GetProperty("IdNumber", "IdNumber", "身份证号"),
        GetProperty("Sex", "Sex", "性别"),
        GetProperty("Nation", "Nation", "民族"),
        GetProperty("Birthday", "Birthday", "出生年月"),
        GetProperty("Address", "Address", "身份证地址"),
        GetProperty("SignUnit", "SignUnit", "签发机关"),
        GetProperty("Period", "Period", "证件有效期"),
        GetProperty("ApprovalRemark", "ApprovalRemark", "审核备注")
    ]
}

