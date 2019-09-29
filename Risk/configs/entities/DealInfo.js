const { GetProperty } =require("./Common");

module.exports= {
    Name: "DealInfo",
    PrimaryKey: "OrderCode",
    PropertyPrimaryKey: "loanApplyId",
    Properties: GetProperties()
}

/*downBillPeriod (number, optional): 下游账期 ,
curAccountsRecv (number, optional): 当前应收账款 ,
curInventoryValue (number, optional): 当前存货价值 ,
curAccountsPay (number, optional): 当前应付账款 ,
curAccountsOtherPay (number, optional): 当前其他应付账款 ,
enterpriseNetProfitRate (number, optional): 企业净利润率*/
function GetProperties() {
    return [
        GetProperty("DownAccountPeriod", "downBillPeriod", "下游账期"),
        GetProperty("CurrentInAmount", "curAccountsRecv", "当前应收账款"),
        GetProperty("CurrentStockAmount", "curInventoryValue", "当前存货价值"),
        GetProperty("CurrentPayAmount", "curAccountsPay", "当前应付账款"),
        GetProperty("CurrentOtherPayAmount", "curAccountsOtherPay", "当前其他应付账款"),
        GetProperty("IndustryProfitRate", "enterpriseNetProfitRate", "行业利润率")
    ]
}