module.exports = {
    Name: "Sale",
    PrimaryKey: "SaleId",
    Properties: GetProperties(),
    SaleTypeDataSource: GetSaleTypeDataSource(),
    ProductDataSource:GetProductDataSource(),
    UserDataSource:GetUserDataSource()
}

function GetProperties() {
    return [
        GetProperty("SaleId", "SaleId"),
        GetProperty("SaleCode", "销售单号"),
        GetProperty("Remark", "备注"),
        GetProperty("CreateDate", "创建时间")
    ]
}

function GetProperty(Name, Label) { return { Name, Label } }

function GetSaleTypeDataSource() {
    return [{ Value: 1, Text: "销售" }, { Value: 2, Text: "退货" }]
}

function GetProductDataSource() {
    return {
        ValueName: "Id",
        TextName: "ProductName",
        StateName: "Products",
        ServiceName: "SaleService",
        ActionName: "GetProducts",
        IsRefresh: true,
        Payload: {}
    }
}

function GetUserDataSource(){
    return {
        ValueName: "UserId",
        TextName: "UserName",
        StateName: "Users",
        ServiceName: "StockCheckService",
        ActionName: "GetUsers",
        IsRefresh: true,
        Payload: {}
    }
}
