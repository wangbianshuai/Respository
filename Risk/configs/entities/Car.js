const { GetProperty } =require( "./Common");

module.exports= {
    Name: "Car",
    PrimaryKey: "Id",
    Properties: GetProperties(),
    CarTypeDataSource: GetCarTypeDataSource(),
    CarUseNatureDataSource: GetCarUseNatureDataSource()
}

/*numberPlate (string, optional): 车产-车牌号 ,
carType (string, optional): 车产-车辆类型 ,
ower (string, optional): 车产-车辆所有人 ,
owerHomeAddress (string, optional): 车产-车辆所有人住址 ,
useType (string, optional): 车产-使用性质 ,
brandModel (string, optional): 车产-品牌型号 ,
vehicleId (string, optional): 车产-车辆识别代号 ,
engineId (string, optional): 车产-发动机号码 ,
registrationDate (string, optional): 车产-注册日期 ,
issueDate (string, optional): 车产-发证日期*/
function GetProperties() {
    return [
        GetProperty("CarNo", "numberPlate", "车牌号码"),
        GetProperty("CarType", "carType", "车辆类型"),
        GetProperty("CarTypeName", "carTypeName", "车辆类型"),
        GetProperty("CarUser", "ower", "车辆所有人"),
        GetProperty("CarUserAddress", "owerHomeAddress", "车辆所有人住址"),
        GetProperty("CarUseNature", "useType", "使用性质"),
        GetProperty("CarUseNatureName", "useTypeName", "使用性质"),
        GetProperty("BrandModel", "brandModel", "品牌型号"),
        GetProperty("CarCode", "vehicleId", "车辆识别代号"),
        GetProperty("CarAutoCode", "engineId", "发动机号码"),
        GetProperty("RegisterDate", "registrationDate", "注册日期"),
        GetProperty("CardDate", "issueDate", "发证日期")
    ]
}

/*车辆类型
01	轿车（5人座）
02	SUV
03	商务型（7人座）
04	客车
05	货车*/
function GetCarTypeDataSource() {
    return [{ Value: "01", Text: "轿车（5人座）" }, { Value: "02", Text: "SUV" },
    { Value: "03", Text: "商务型（7人座）" }, { Value: "04", Text: "客车" },
    { Value: "05", Text: "货车" }]
}

/*
车辆使用性质	01	营运 02	非营运*/
function GetCarUseNatureDataSource() {
    return [{ Value: "01", Text: "营运" }, { Value: "02", Text: "非营运" }]
}