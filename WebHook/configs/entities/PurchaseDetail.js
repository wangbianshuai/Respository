module.exports = {
    Name: "PurchaseDetail",
    PrimaryKey: "Id",
    Properties: GetProperties(),
    PurchaseStatusDataSource: GetPurchaseStatusDataSource(),
    ProductTypeDataSource: GetProductTypeDataSource(),
    ProductBrandDataSource: GetProductBrandDataSource(),
}

function GetProperties() {
    return [
        GetProperty("Id", "Id"),
        GetProperty("PurchaseId", "采购Id"),
        GetProperty("PurchaseCode", "采购单号"),
        GetProperty("ProductId", "商品Id"),
        GetProperty("ProductName", "商品"),
        GetProperty("BidPrice", "价格"),
        GetProperty("Discount2", "折扣"),
        GetProperty("ProductTypeName", "类型"),
        GetProperty("ProductBrandName", "品牌"),
        GetProperty("Number", "数量"),
        GetProperty("Amount2", "金额"),
        GetProperty("Amount", "金额"),
        GetProperty("PurchaseDate","采购日期"),
        GetProperty("PurchaseStatusName","状态")
    ]
}

function GetProperty(Name, Label) { return { Name, Label } }

function GetPurchaseStatusDataSource() {
    return [{ Value: 0, Text: "待提交" }, { Value: 1, Text: "已提交" }, { Value: 2, Text: "已存档" }, { Value: 3, Text: "已作废" }]
}

function GetProductTypeDataSource() {
    return {
        ValueName: "Id",
        TextName: "Name",
        StateName: "ProductTypes",
        ServiceName: "PurchaseService",
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
        ServiceName: "PurchaseService",
        ActionName: "GetProductBrands",
        IsRefresh: true,
        Payload: {}
    }
}
