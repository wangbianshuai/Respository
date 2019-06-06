import { GetProperty } from "./Common";

export default {
    Name: "PersonBaseInfo",
    PrimaryKey: "Id",
    Properties: GetProperties(),
    EducationalDataSource: GetEducationalDataSource(),
    MaritalStatusDataSource: GetMaritalStatusDataSource(),
    HouseStatusDataSource: GetHouseStatusDataSource()
}

function GetProperties() {
    return [
        GetProperty("Phone", "Phone", "常用手机号"),
        GetProperty("Email", "Email", "邮箱地址"),
        GetProperty("Educational", "Educational", "教育程度"),
        GetProperty("MaritalStatus", "MaritalStatus", "婚姻状况"),
        GetProperty("MaritalYears", "MaritalYears", "已婚年限"),
        GetProperty("NowAddress", "NowAddress", "现居住地址"),
        GetProperty("HouseStatus", "HouseStatus", "居住地是否租赁"),
        GetProperty("HousePeriod", "HousePeriod", "租赁有效期限"),
        GetProperty("ElectricityCode", "ElectricityCode", "居住地电费单号"),
        GetProperty("ApprovalRemark", "ApprovalRemark", "审核备注")
    ]
}

function GetEducationalDataSource() {
    return [{ Value: 1, Text: "本科" }, { Value: 2, Text: "大专" }]
}

function GetMaritalStatusDataSource() {
    return [{ Value: 1, Text: "已婚" }, { Value: 2, Text: "未婚" }]
}

function GetHouseStatusDataSource() {
    return [{ Value: 1, Text: "是" }, { Value: 0, Text: "否" }]
}

