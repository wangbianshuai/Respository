import { GetProperty } from "./Common";

export default {
    Name: "DealInfo",
    PrimaryKey: "OrderCode",
    Properties: GetProperties()
}

function GetProperties() {
    return [
        GetProperty("DownAccountPeriod", "DownAccountPeriod", "下游账期"),
        GetProperty("CurrentInAmount", "CurrentInAmount", "当前应收账款"),
        GetProperty("CurrentStockAmount", "CurrentStockAmount", "当前存货价值"),
        GetProperty("CurrentPayAmount", "CurrentPayAmount", "当前应付账款"),
        GetProperty("CurrentOtherPayAmount", "CurrentOtherPayAmount", "当前其他应付账款"),
        GetProperty("IndustryProfitRate", "IndustryProfitRate", "行业利润率")
    ]
}