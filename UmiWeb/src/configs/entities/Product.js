import { GetProperty } from "./Common";

export default {
    Name: "Product",
    PrimaryKey: "ProductId",
    Properties: GetProperties()
}

function GetProperties() {
    return [
        GetProperty("ProductId", "ProductId", "ProductId"),
        GetProperty("ProuctType", "ProuctType", "产品大类"),
        GetProperty("ProductName", "ProductName", "产品名称"),
        GetProperty("ProductCode", "ProductCode", "产品代码"),
        GetProperty("ProductNo", "ProductNo", "产品编号"),
        GetProperty("MinLoanAmount", "MinLoanAmount", "最小借款额度"),
        GetProperty("MaxLoanAmount", "MaxLoanAmount", "最大借款额度"),
        GetProperty("BackMethods", "BackMethods", "还款方式"),
        GetProperty("Remark", "Remark", "描述"),
        GetProperty("CreateUser", "CreateUser", "创建人"),
        GetProperty("CreateDate", "CreateDate", "创建时间"),
        GetProperty("UpdateDate", "UpdateDate", "更新时间")
    ]
}

