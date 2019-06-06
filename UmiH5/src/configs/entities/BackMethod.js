import { GetProperty } from "./Common";

export default {
    Name: "BackMethod",
    PrimaryKey: "BackMethodId",
    Properties: GetProperties()
}

function GetProperties() {
    return [
        GetProperty("BackMethodId", "BackMethodId", "BackMethodId"),
        GetProperty("Name", "Name", "名称"),
        GetProperty("MethodType", "MethodType", "还款方式"),
        GetProperty("PeriodMethod", "PeriodMethod", "分期方式"),
        GetProperty("YearRateMethod", "YearRateMethod", "年化计算方式"),
        GetProperty("Remark", "Remark", "描述"),
        GetProperty("CreateUser", "CreateUser", "创建人"),
        GetProperty("CreateDate", "CreateDate", "创建时间"),
        GetProperty("UpdateDate", "UpdateDate", "更新时间")
    ]
}

