module.exports = {
    Name: "Sale",
    PrimaryKey: "SaleId",
    Properties: GetProperties(),
    SaleTypeDataSource: GetSaleTypeDataSource(),
    ProductDataSource: GetProductDataSource(),
    UserDataSource: GetUserDataSource(),
    SaleStatusDataSource: GetSaleStatusDataSource(),
    AmountTypeDataSource: GetAmountTypeDataSource()
}

function GetProperties() {
    return [
        GetProperty("SaleId", "SaleId"),
        GetProperty("SaleCode", "销售单号"),
        GetProperty("SaleDate", "销售日期"),
        GetProperty("SaleUserName", "销售员"),
        GetProperty("LogisticsFee", "物流费"),
        GetProperty("OtherFee", "其他费"),
        GetProperty("DiscountFee", "折扣费"),
        GetProperty("ShouldAmount2", "应收金额"),
        GetProperty("RealAmount2", "实收金额"),
        GetProperty("CustomerName", "顾客姓名"),
        GetProperty("CustomerPhone", "顾客手机"),
        GetProperty("SaleTypeName", "类型"),
        GetProperty("SaleStatusName", "状态"),
        GetProperty("SaleAmount", "商品金额"),
        GetProperty("BidAmount", "商品成本"),
        GetProperty("Profit", "商品利润"),
        GetProperty("ProfitRate", "利润率(%)"),
        GetProperty("AmountType", "收款状态"),
        GetProperty("DueAmount", "待收金额"),
        GetProperty("Remark", "备注"),
        GetProperty("CreateDate", "创建时间")
    ]
}

function GetProperty(Name, Label) { return { Name, Label } }

function GetSaleTypeDataSource() {
    return [{ Value: 1, Text: "销售" }, { Value: 2, Text: "退货" }]
}

function GetSaleStatusDataSource() {
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
        ServiceName: "SaleService",
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
        ServiceName: "StockCheckService",
        ActionName: "GetUsers",
        IsRefresh: true,
        Payload: {}
    }
}
