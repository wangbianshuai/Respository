import { GetProperty } from "./Common";

export default {
    Name: "PropertyInfo",
    PrimaryKey: "OrderCode",
    Properties: GetProperties(),
    LocalHouseDataSource: GetLocalHouseDataSource(),
    MortgageDataSource: GetMortgageDataSource()
}

function GetProperties() {
    return [
        GetProperty("IsLocalHouse", "IsLocalHouse", "是否本地有房产"),
        GetProperty("IsMortgage", "IsMortgage", "是否有按揭"),
        GetProperty("HouseAmount", "HouseAmount", "清房房价（如有房产，则必填）"),
        GetProperty("MonthMortgage", "MonthMortgage", "按揭月供金额")
    ]
}

function GetLocalHouseDataSource() {
    return [{ Value: 1, Text: "有" }, { Value: 0, Text: "无" }]
}

function GetMortgageDataSource() {
    return [{ Value: 1, Text: "有" }, { Value: 0, Text: "无" }]
}