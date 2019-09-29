const { GetProperty } =require("./Common");

module.exports= {
    Name: "PropertyInfo",
    PrimaryKey: "OrderCode",
    PropertyPrimaryKey: "loanApplyId",
    Properties: GetProperties(),
    LocalHouseDataSource: GetLocalHouseDataSource(),
    MortgageDataSource: GetMortgageDataSource()
}

/*hasLocalRealEstate (string, optional): 是否本地有房产 ,
hasMortgage (string, optional): 是否有按揭 ,
clearRealEstateValue (number, optional): 轻房房价 ,
mortgageMonthAmount (number, optional): 按揭月供金额 */
function GetProperties() {
    return [
        GetProperty("IsLocalHouse", "hasLocalRealEstate", "是否本地有房产"),
        GetProperty("IsMortgage", "hasMortgage", "是否有按揭"),
        GetProperty("HouseAmount", "clearRealEstateValue", "清房房价（如有房产，则必填）"),
        GetProperty("MonthMortgage", "mortgageMonthAmount", "按揭月供金额")
    ]
}

/*
布尔值是否	01	是
	02	否*/
function GetLocalHouseDataSource() {
    return [{ Value: "01", Text: "是" }, { Value: "02", Text: "否" }]
}

/*
布尔值是否	01	是
	02	否*/
function GetMortgageDataSource() {
    return [{ Value: "01", Text: "是" }, { Value: "02", Text: "否" }]
}