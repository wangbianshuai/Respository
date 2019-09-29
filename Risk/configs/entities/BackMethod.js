const { GetProperty } =require( "./Common");

module.exports= {
    Name: "BackMethod",
    PrimaryKey: "BackMethodId",
    PropertyPrimaryKey: "repaymentConfigId",
    Properties: GetProperties(),
    PeriodUnitDataSource: GetPeriodUnitDataSource()
}

function GetProperties() {
    return [
        GetProperty("BackMethodId", "repaymentConfigId", "BackMethodId"),
        GetProperty("Name", "name", "名称"),
        GetProperty("MethodType", "repaymentWay", "还款方式"),
        GetProperty("MethodTypeName", "repaymentWayName", "还款方式"),
        GetProperty("PeriodMethod", "periodWay", "分期方式"),
        GetProperty("PeriodMethodName", "periodWayName", "分期方式"),
        GetProperty("YearRateMethod", "annualCalcWay", "年化计算方式"),
        GetProperty("YearRateMethodName", "annualCalcWayName", "年化计算方式"),
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
