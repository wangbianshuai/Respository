import { GetProperty } from "./Common";

export default {
    Name: "Product",
    PrimaryKey: "ProductId",
    Properties: GetProperties()
}

function GetProperties() {
    return [
        GetProperty("ProductId", "ProductId", "ProductId", "long"),
        GetProperty("ProuctType", "ProuctType", "产品大类", "string", false),
        GetProperty("ProductName", "ProductName", "产品名称", "string", false, 50),
        GetProperty("ProductCode", "ProductCode", "产品代码", "string", false, 50),
        GetProperty("ProductNo", "ProductNo", "产品编号", "string", false, 50),
        GetProperty("MinLoanAmount", "MinLoanAmount", "最小借款额度", "decimal", false),
        GetProperty("MaxLoanAmount", "MaxLoanAmount", "最大借款额度", "decimal", false),
        GetProperty("BackMethods", "BackMethods", "还款方式", "string", false),
        GetProperty("Remark", "Remark", "描述", "string", false),
        GetProperty("CreateUser", "CreateUser", "创建人", "string", false),
        GetProperty("CreateDate", "CreateDate", "创建时间", "date", false),
        GetProperty("UpdateDate", "UpdateDate", "更新时间", "date", false)
    ]
}

