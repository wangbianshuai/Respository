module.exports = {
    Name: "Purchase",
    PrimaryKey: "PurchaseId",
    Properties: GetProperties(),
    PurchaseTypeDataSource: GetPurchaseTypeDataSource(),
    ProductDataSource: GetProductDataSource(),
    UserDataSource: GetUserDataSource(),
    SupplierDataSource: GetSupplierDataSource(),
    PurchaseStatusDataSource: GetPurchaseStatusDataSource(),
    AmountTypeDataSource: GetAmountTypeDataSource()
}

function GetProperties() {
    return [
        GetProperty("PurchaseId", "PurchaseId"),
        GetProperty("PurchaseCode", "采购单号"),
        GetProperty("PurchaseDate", "采购日期"),
        GetProperty("PurchaseUserName", "采购员"),
        GetProperty("LogisticsFee", "物流费"),
        GetProperty("OtherFee", "其他费"),
        GetProperty("DiscountFee", "折扣费"),
        GetProperty("ShouldAmount2", "应付金额"),
        GetProperty("RealAmount2", "实付金额"),
        GetProperty("SupplierName", "供应商"),
        GetProperty("PurchaseTypeName", "类型"),
        GetProperty("PurchaseStatusName", "状态"),
        GetProperty("PurchaseAmount", "商品金额"),
        GetProperty("AmountType", "付款状态"),
        GetProperty("DueAmount", "待付金额"),
        GetProperty("Remark", "备注"),
        GetProperty("CreateDate", "创建时间")
    ]
}

function GetProperty(Name, Label) { return { Name, Label } }

function GetPurchaseTypeDataSource() {
    return [{ Value: 1, Text: "采购" }, { Value: 2, Text: "退货" }]
}

function GetPurchaseStatusDataSource() {
    return [{ Value: 0, Text: "待提交" }, { Value: 1, Text: "已提交" }, { Value: 2, Text: "已存档" }, { Value: 3, Text: "已作废" }]
}

function GetAmountTypeDataSource() {
    return [{ Value: "未结款", Text: "未结款" }, { Value: "部分结款", Text: "部分结款" }, { Value: "已结清", Text: "已结清" }]
}

function GetProductDataSource() {
    return {
        ValueName: "Id",
        TextName: "ProductName",
        StateName: "Products",
        ServiceName: "PurchaseService",
        ActionName: "GetProducts",
        IsRefresh: true,
        Payload: {}
    }
}

function GetUserDataSource() {
    return {
        ValueName: "UserId",
        TextName: "UserName",
        StateName: "Users",
        ServiceName: "PurchaseService",
        ActionName: "GetUsers",
        IsRefresh: true,
        Payload: {}
    }
}

function GetSupplierDataSource(){
    return {
        ValueName: "Id",
        TextName: "Name",
        StateName: "Suppliers",
        ServiceName: "PurchaseService",
        ActionName: "GetSuppliers",
        IsRefresh: true,
        Payload: {}
    }
}