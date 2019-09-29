const { GetProperty } =require( "./Common");

module.exports= {
    Name: "Product",
    PrimaryKey: "ProductId",
    PropertyPrimaryKey: "productId",
    Properties: GetProperties()
}

function GetProperties() {
    return [
        GetProperty("ProductId", "productId", "ProductId"),
        GetProperty("ProductType", "productCategory", "产品大类"),
        GetProperty("ProductTypeName", "productCategoryName", "产品大类"),
        GetProperty("ProductName", "productName", "产品名称"),
        GetProperty("ProductCode", "productShortName", "简称"),
        GetProperty("MinLoanAmount", "minLoanAmount", "最小借款额度"),
        GetProperty("MaxLoanAmount", "maxLoanAmount", "最大借款额度"),
        GetProperty("MinMaxLoanAmount", "minMaxLoanAmount", "借款额度范围"),
        GetProperty("BackMethods", "repaymentWay", "还款方式"),
        GetProperty("BackMethodName", "repaymentWayName", "还款方式"),
        GetProperty("Remark", "description", "描述")
    ]
}

