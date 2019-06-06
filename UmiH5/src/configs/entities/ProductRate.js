import { GetProperty } from "./Common";

export default {
    Name: "ProductRate",
    PrimaryKey: "ProductRateId",
    Properties: GetProperties()
}

function GetProperties() {
    return [
        GetProperty("ProductRateId", "ProductRateId", "ProductRateId"),
        GetProperty("ProductId", "ProductId", "产品名称"),
        GetProperty("ProductName", "ProductName", "产品名称"),
        GetProperty("ProductPeriod", "ProductPeriod", "产品期限"),
        GetProperty("YearRate", "YearRate", "年化利率"),
        GetProperty("Remark", "Remark", "描述"),
        GetProperty("CreateUser", "CreateUser", "创建人"),
        GetProperty("CreateDate", "CreateDate", "创建时间"),
        GetProperty("UpdateDate", "UpdateDate", "更新时间")
    ]
}

