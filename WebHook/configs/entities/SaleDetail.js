module.exports = {
    Name: "SaleDetail",
    PrimaryKey: "Id",
    Properties: GetProperties(),
    SaleStatusDataSource: GetSaleStatusDataSource(),
    ProductTypeDataSource: GetProductTypeDataSource(),
    ProductBrandDataSource: GetProductBrandDataSource(),
}

function GetProperties() {
    return [
        GetProperty("Id", "Id"),
        GetProperty("SaleId", "销售Id"),
        GetProperty("SaleCode", "销售单号"),
        GetProperty("ProductId", "商品Id"),
        GetProperty("ProductName", "商品"),
        GetProperty("SillingPrice", "价格"),
        GetProperty("BidPrice", "进价"),
        GetProperty("Discount2", "折扣"),
        GetProperty("ProductTypeName", "类型"),
        GetProperty("ProductBrandName", "品牌"),
        GetProperty("Number", "数量"),
        GetProperty("Amount2", "金额"),
        GetProperty("Amount", "金额"),
        GetProperty("BidAmount2", "成本"),
        GetProperty("Profit", "利润"),
        GetProperty("SaleDate","销售日期"),
        GetProperty("ProfitRate", "利润率(%)"),
        GetProperty("SaleStatusName","状态")
    ]
}

function GetProperty(Name, Label) { return { Name, Label } }

function GetSaleStatusDataSource() {
    return [{ Value: 0, Text: "待提交" }, { Value: 1, Text: "已提交" }, { Value: 2, Text: "已存档" }, { Value: 3, Text: "已作废" }]
}

function GetProductTypeDataSource() {
    return {
        ValueName: "Id",
        TextName: "Name",
        StateName: "ProductTypes",
        ServiceName: "SaleService",
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
        ServiceName: "SaleService",
        ActionName: "GetProductBrands",
        IsRefresh: true,
        Payload: {}
    }
}
