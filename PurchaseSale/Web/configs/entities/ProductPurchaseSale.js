module.exports = {
    Name: "ProductPurchaseSale",
    PrimaryKey: "ProductId",
    Properties: GetProperties(),
    ProductTypeDataSource: GetProductTypeDataSource(),
    ProductBrandDataSource: GetProductBrandDataSource(),
}

function GetProperties() {
    return [
        GetProperty("SaleDate", "日期"),
        GetProperty("SaleYear", "年"),
        GetProperty("SaleMonth", "月"),
        GetProperty("SaleDay", "天"),
        GetProperty("ProductId", "ProductId"),
        GetProperty("ProductName", "名称"),
        GetProperty("ProductTypeName", "类型"),
        GetProperty("ProductBrandName", "品牌"),
        GetProperty("SaleAmount", "销售金额"),
        GetProperty("SaleBidAmount", "销售成本"),
        GetProperty("SaleProfit", "销售利润"),
        GetProperty("SaleDiscount", "销售折扣"),
        GetProperty("PurchaseAmount", "采购金额"),
        GetProperty("PurchaseDiscount", "采购折扣")
    ]
}

function GetProperty(Name, Label) { return { Name, Label } }

function GetProductTypeDataSource() {
    return {
        ValueName: "Id",
        TextName: "Name",
        StateName: "ProductTypes",
        ServiceName: "ProductPurchaseSaleService",
        ActionName: "GetProductTypes",
        IsRefresh: true,
        Payload: {}
    }
}

function GetProductBrandDataSource() {
    return {
        ValueName: "Id",
        TextName: "Name",
        StateName: "ProductBrands",
        ServiceName: "ProductPurchaseSaleService",
        ActionName: "GetProductBrands",
        IsRefresh: true,
        Payload: {}
    }
}
