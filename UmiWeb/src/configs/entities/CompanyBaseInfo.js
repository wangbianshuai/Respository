import { GetProperty } from "./Common";

export default {
    Name: "CompanyBaseInfo",
    PrimaryKey: "Id",
    Properties: GetProperties(),
    HouseStatusDataSource: GetHouseStatusDataSource()
}

function GetProperties() {
    return [
        GetProperty("CompanyName", "CompanyName", "公司名称"),
        GetProperty("CompanyIdNumber", "CompanyIdNumber", "统一社会信用代码"),
        GetProperty("LegalPersonName", "LegalPersonName", "公司名称"),
        GetProperty("LegalPersonIdNumber", "LegalPersonIdNumber", "统一社会信用代码"),
        GetProperty("LegalPersonPhone", "LegalPersonPhone", "统一社会信用代码"),
        GetProperty("RegisterDate", "RegisterDate", "成立时间"),
        GetProperty("RegisterAmount", "RegisterAmount", "注册资金"),
        GetProperty("ManageYears", "ManageYears", "经营年限"),
        GetProperty("CompanyAddress", "CompanyAddress", "单位地址"),
        GetProperty("CompanyTelephone", "CompanyTelephone", "单位电话"),
        GetProperty("CompanyEmail", "CompanyEmail", "单位邮箱"),
        GetProperty("Industry1", "Industry1", "行业门类"),
        GetProperty("Industry2", "Industry2", "行业大类"),
        GetProperty("Industry3", "Industry3", "行业中类"),
        GetProperty("Industry4", "Industry4", "行业小类"),
        GetProperty("CompanyHouseStatus", "CompanyHouseStatus", "办公地是否租赁"),
        GetProperty("CompanyHousePeriod", "CompanyHousePeriod", "租赁有效期限"),
        GetProperty("CompanyElectricityCode", "CompanyElectricityCode", "办公地电费单号"),
        GetProperty("ApprovalRemark", "ApprovalRemark", "审核备注")
    ]
}

function GetHouseStatusDataSource() {
    return [{ Value: 1, Text: "是" }, { Value: 0, Text: "否" }]
}

