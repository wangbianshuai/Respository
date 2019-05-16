import { GetProperty } from "./Common";

export default {
    Name: "ProductRate",
    PrimaryKey: "ProductRateId",
    Properties: GetProperties()
}

function GetProperties() {
    return [
        GetProperty("ProductRateId", "ProductRateId", "ProductRateId", "long"),
        GetProperty("ProductId", "ProductId", "产品名称", "string", false),
        GetProperty("ProductName", "ProductName", "产品名称", "string", false, 50),
        GetProperty("ProductPeriod", "ProductPeriod", "产品期限", "string", false, 50),
        GetProperty("YearRate", "YearRate", "年化利率", "decimal", false),
        GetProperty("Remark", "Remark", "描述", "string", false),
        GetProperty("CreateUser", "CreateUser", "创建人", "string", false),
        GetProperty("CreateDate", "CreateDate", "创建时间", "date", false),
        GetProperty("UpdateDate", "UpdateDate", "更新时间", "date", false)
    ]
}

