module.exports = {
    Name: "SaleDetail",
    PrimaryKey: "Id",
    Properties: GetProperties()
}

function GetProperties() {
    return [
        GetProperty("Id", "Id"),
        GetProperty("SaleId", "销售Id"),
        GetProperty("ProductId", "商品Id"),
        GetProperty("ProductName", "商品"),
        GetProperty("SillingPrice", "价格"),
        GetProperty("Discount", "折扣"),
        GetProperty("ProductTypeName", "类型"),
        GetProperty("ProductBrandName", "品牌"),
        GetProperty("Number", "数量"),
        GetProperty("Amount", "金额")
    ]
}

function GetProperty(Name, Label) { return { Name, Label } }