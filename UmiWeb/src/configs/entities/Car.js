import { GetProperty } from "./Common";

export default {
    Name: "Car",
    PrimaryKey: "Id",
    Properties: GetProperties(),
    CarTypeDataSource: GetCarTypeDataSource(),
    CarUserDataSource: GetCarUserDataSource(),
    CarUseNatureDataSource: GetCarUseNatureDataSource()
}

function GetProperties() {
    return [
        GetProperty("CarNo", "CarNo", "车牌号码"),
        GetProperty("CarType", "CarType", "车辆类型"),
        GetProperty("CarUser", "CarUser", "车辆所有人"),
        GetProperty("CarUserAddress", "CarUserAddress", "车辆所有人住址"),
        GetProperty("CarUseNature", "CarUseNature", "使用性质"),
        GetProperty("BrandModel", "BrandModel", "品牌型号"),
        GetProperty("CarCode", "CarCode", "车辆识别代号"),
        GetProperty("CarAutoCode", "CarAutoCode", "发动机号码"),
        GetProperty("RegisterDate", "RegisterDate", "注册日期"),
        GetProperty("CardDate", "CardDate", "发证日期")
    ]
}

function GetCarTypeDataSource() {
    return [{ Value: 1, Text: "小型桥车" }, { Value: 0, Text: "客车" }]
}

function GetCarUserDataSource() {
    return [{ Value: 1, Text: "本人" }, { Value: 0, Text: "朋友" }]
}

function GetCarUseNatureDataSource() {
    return [{ Value: 1, Text: "家用代步" }, { Value: 0, Text: "营运" }]
}