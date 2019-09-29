const { GetProperty } =require( "./Common");

module.exports= {
    Name: "PlatformRate",
    PrimaryKey: "PlatformRateId",
    PropertyPrimaryKey: "feeTemplateId",
    Properties: GetProperties(),
    CollectionMethodDataSource: GetCollectionMethodDataSource(),
    CollectionTypeDataSource: GetCollectionTypeDataSource()
}

function GetProperties() {
    return [
        GetProperty("PlatformRateId", "feeTemplateId", "PlatformRateId"),
        GetProperty("Name", "feeName", "名称"),
        GetProperty("ServiceRate", "feeRate", "信息服务费率"),
        GetProperty("ManageRate", "feeRate", "信息管理费率"),
        GetProperty("FineRate", "feeRate", "罚息费率"),
        GetProperty("ServiceRateName", "feeRateName", "信息服务费率"),
        GetProperty("ManageRateName", "feeRateName", "信息管理费率"),
        GetProperty("FineRateName", "feeRateName", "罚息费率"),
        GetProperty("RateType", "feeType", "费用类型"),
        GetProperty("CollectionType", "chargeStage", "收取类型"),
        GetProperty("CollectionMethod", "chargeWay", "收取方式"),
        GetProperty("CollectionTypeName", "chargeStageName", "收取类型"),
        GetProperty("CollectionMethodName", "chargeWayName", "收取方式"),
        GetProperty("Remark", "description", "描述")
    ]
}

/*费用收取方式	01	一次性收取
	02	分期收取*/
function GetCollectionMethodDataSource() {
    return [{ Value: "01", Text: "一次性收取" }, { Value: "02", Text: "分期收取" }]
}

/*费用收取阶段	01	前置
    02	后置*/
function GetCollectionTypeDataSource() {
    return [{ Value: "01", Text: "前置" }, { Value: "02", Text: "后置" }]
}

