const { GetProperty } =require( "./Common");

module.exports= {
    Name: "ProductRate",
    PrimaryKey: "ProductRateId",
    PropertyPrimaryKey: "interestRateId",
    Properties: GetProperties(),
    PeriodUnitDataSource: GetPeriodUnitDataSource()
}

function GetProperties() {
    return [
        GetProperty("ProductRateId", "interestRateId", "ProductRateId"),
        GetProperty("ProductId", "productId", "产品名称"),
        GetProperty("ProductName", "productName", "产品名称"),
        GetProperty("ProductPeriod", "loanPeriod", "产品期限"),
        GetProperty("ProductPeriodName", "loanPeriodName", "产品期限"),
        GetProperty("YearRate", "interestRate", "年化利率"),
        GetProperty("YearRateName", "interestRateName", "年化利率"),
        GetProperty("Remark", "description", "描述")
    ]
}

/*
时间单位	01	日
	02	周
	03	月
	04	季
	05	年*/
function GetPeriodUnitDataSource() {
    return [{ Value: "01", Text: "日" },
    { Value: "03", Text: "个月" }]
}