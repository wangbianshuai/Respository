module.exports = {
    Name: "Product",
    PrimaryKey: "Id",
    Properties: GetProperties(),
    ProductTypeDataSource: GetProductTypeDataSource(),
    ProductBrandDataSource: GetProductBrandDataSource(),
    UnitDataSource: GetUnitDataSource()
}

function GetProperties() {
    return [
        GetProperty("Id", "Id"),
        GetProperty("Name", "名称"),
        GetProperty("ProductCode", "编号"),
        GetProperty("ProductTypeName", "类型"),
        GetProperty("ProductBrandName", "品牌"),
        GetProperty("BidPrice", "进价"),
        GetProperty("SillingPrice", "售价"),
        GetProperty("InitStock", "初始库存"),
        GetProperty("CurrentStock", "当前库存"),
        GetProperty("Unit", "单位"),
        GetProperty("Remark", "说明"),
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

function GetUnitDataSource() {
    return {
        ValueName: "Value",
        TextName: "Value",
        StateName: "Units",
        ServiceName: "ProductService",
        ActionName: "GetUnits",
        IsRefresh: true,
        Payload: {}
    }
}
