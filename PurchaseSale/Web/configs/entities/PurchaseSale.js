module.exports = {
    Name: "PurchaseSale",
    PrimaryKey: "SaleDate",
    Properties: GetProperties()
}

function GetProperties() {
    return [
        GetProperty("SaleDate", "日期"),
        GetProperty("SaleYear", "年"),
        GetProperty("SaleMonth", "月"),
        GetProperty("SaleDay", "天"),
        GetProperty("SaleAmount", "销售商品金额"),
        GetProperty("SaleBidAmount", "销售商品成本"),
        GetProperty("SaleDueAmount", "销售待收金额"),
        GetProperty("SaleProfit", "销售商品利润"),
        GetProperty("SaleRealAmount", "销售实收金额"),
        GetProperty("SaleShouldAmount", "销售应收金额"),
        GetProperty("PurchaseAmount", "采购商品金额"),
        GetProperty("PurchaseDueAmount", "采购待付金额"),
        GetProperty("PurchaseRealAmount", "采购实付金额"),
        GetProperty("PurchaseShouldAmount", "采购应付金额"),
        GetProperty("ShouldBalance", "应结余金额"),
        GetProperty("RealBalance", "实结余金额")
    ]
}

function GetProperty(Name, Label) { return { Name, Label } }