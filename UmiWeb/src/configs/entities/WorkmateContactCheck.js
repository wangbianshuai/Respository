import { GetProperty } from "./Common";

export default {
    Name: "WorkmateContactCheck",
    PrimaryKey: "OrderCode",
    Properties: GetProperties()
}

function GetProperties() {
    return [
        GetProperty("ContactPhone", "ContactPhone", "联系人电话"),
        GetProperty("ContactName", "ContactName", "联系人电话"),
        GetProperty("Relationship", "Relationship", "联系人电话"),
        GetProperty("FirstCallDate", "FirstCallDate", "选择第一次拨打时间"),
        GetProperty("SecondCallDate", "SecondCallDat", "选择第二次拨打时间"),
        GetProperty("ThirdCallDate", "ThirdCallDate", "选择第三次拨打时间"),
        GetProperty("Question1", "Question1", "单位名称、单位地址", "请输入备注"),
        GetProperty("Question2", "Question2", "单位联系人职务", "请输入备注"),
        GetProperty("Question3", "Question3", "主营业务及经营情况", "请输入备注"),
        GetProperty("Question4", "Question4", "上下游客户情况"),
        GetProperty("Question5", "Question5", "淡旺季情况"),
        GetProperty("Question6", "Question6", "员工情况/作息时间/工资发放情况/是否五险一金"),
        GetProperty("Question7", "Question7", "：其他情况")
    ]
}