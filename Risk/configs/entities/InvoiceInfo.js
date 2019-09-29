const { GetProperty } =require( "./Common");

module.exports= {
    Name: "InvoiceInfo",
    PrimaryKey: "OrderCode",
    PropertyPrimaryKey: "loanApplyId",
    Properties: GetProperties()
}

/*monthAvgBillFierstyear (number, optional): 企业月均开票金额 ,
monthAvgBillSecondyear (number, optional): 企业月均开票金额*/
function GetProperties() {
    return [
        GetProperty("InvoiceFile", "InvoiceFile", "开票数据导入"),
        GetProperty("AvgInvoiceAmount24", "monthAvgBillFierstyear", "企业月均开票金额（近13～24个月）"),
        GetProperty("AvgInvoiceAmount12", "monthAvgBillSecondyear", "企业月均开票金额（近12个月）")
    ]
}