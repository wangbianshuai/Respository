const { GetProperty } =require( "./Common");

module.exports= {
    Name: "FinalCreditCalculate",
    PrimaryKey: "OrderCode",
    PropertyPrimaryKey: "loanApplyId",
    Properties: GetProperties(),
    CreditTypeDataSource: GetCreditTypeDataSource(),
    PeriodUnitDataSource: GetPeriodUnitDataSource()
}

/*checkedPrivateFlow (number, optional): 对私认定流水 ,
checkedPublicFlow (number, optional): 对公认定流水 ,
calcLoanPeriod (number, optional): 测算借款期限 ,
calcLoanPeriodUnit (string, optional): 测算借款期限单位 ,
calcType (string, optional): 授信计算类型*/
function GetProperties() {
    return [
        GetProperty("CompanyTotalAmount", "checkedPublicFlow", "对公认定流水"),
        GetProperty("PersonTotalAmount", "checkedPrivateFlow", "对私认定流水"),
        GetProperty("CalulateLoanPeriod", "calcLoanPeriod", "测算借款期限"),
        GetProperty("CreditType", "calcType", "授信计算类型"),
        GetProperty("FinalCalulateAmout", "calcLoanAmount", "最终测算金额"),
    ]
}

/*
时间单位	01	日
	02	周s
	03	月
	04	季
	05	年*/
function GetPeriodUnitDataSource() {
    return [{ Value: "01", Text: "日" },
    { Value: "03", Text: "个月" }]
}

function GetCreditTypeDataSource() {
    return [{ Value: "01", Text: "ME" }, { Value: "02", Text: "新三板" }, { Value: "03", Text: "SE-有房" }, { Value: "04", Text: "SE-无房" }]
}

