import { GetProperty } from "./Common";

export default {
    Name: "PlatformRate",
    PrimaryKey: "PlatformRateId",
    Properties: GetProperties()
}

function GetProperties() {
    return [
        GetProperty("PlatformRateId", "PlatformRateId", "PlatformRateId"),
        GetProperty("Name", "Name", "名称"),
        GetProperty("ServiceRate", "ServiceRate", "信息服务费率"),
        GetProperty("ManageRate", "ManageRate", "信息管理费率"),
        GetProperty("FineRate", "FineRate", "罚息费率"),
        GetProperty("RateType", "RateType", "费用类型"),
        GetProperty("CollectionType", "CollectionType", "收取类型"),
        GetProperty("CollectionMethod", "CollectionMethod", "收取方式"),
        GetProperty("Remark", "Remark", "描述"),
        GetProperty("CreateUser", "CreateUser", "创建人"),
        GetProperty("CreateDate", "CreateDate", "创建时间"),
        GetProperty("UpdateDate", "UpdateDate", "更新时间")
    ]
}

