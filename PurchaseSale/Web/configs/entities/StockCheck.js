module.exports = {
    Name: "StockCheck",
    PrimaryKey: "Id",
    Properties: GetProperties(),
    ProductTypeDataSource: GetProductTypeDataSource(),
    ProductBrandDataSource: GetProductBrandDataSource(),
    UnitDataSource: GetUnitDataSource()
}

function GetProperties() {
    return [
        GetProperty("Id", "Id"),
        GetProperty("ProductName", "商品名称"),
        GetProperty("ProductCode", "商品编号"),
        GetProperty("ProductTypeName", "类型"),
        GetProperty("ProductBrandName", "品牌"),
        GetProperty("BidPrice", "进价"),
        GetProperty("LossAmount", "亏损金额"),
        GetProperty("ShouldStock", "应有库存"),
        GetProperty("RealStock", "实有库存"),
        GetProperty("CheckDate", "盘点日期"),
        GetProperty("CheckUserName", "盘点人"),
        GetProperty("Remark", "备注"),
        GetProperty("CreateDate", "创建时间")
    ]
}

function GetProperty(Name, Label) { return { Name, Label } }

function GetProductTypeDataSource() {
    return {
        ValueName: "Id",
        TextName: "Name",
        StateName: "ProductTypes",
        ServiceName: "ProductService",
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
        ServiceName: "ProductService",
        ActionName: "GetProductBrands",
        IsRefresh: true,
        Payload: {}
    }
}
