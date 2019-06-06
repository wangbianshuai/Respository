import { GetProperty } from "./Common";

export default {
    Name: "KinsfolkContactCheck",
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
        GetProperty("Question1", "Question1", "主要申请人身份信息"),
        GetProperty("Question2", "Question2", "单位名称、单位地址"),
        GetProperty("Question3", "Question3", "主要申请人住宅地址"),
        GetProperty("Question4", "Question4", "主要申请人资产情况"),
        GetProperty("Question5", "Question5", "主要申请人负债情况"),
        GetProperty("Question6", "Question6", "主要申请人其他联系方式"),
        GetProperty("Question7", "Question7", "主要申请人其他公司"),
        GetProperty("Question8", "Question8", "主要申请人投资偏好/不良嗜好/是否购买保险以及家庭成员健康情况"),
        GetProperty("Question9", "Question9", "主要申请人婚姻状况、子女情况", "请输入备注"),
        GetProperty("Question10", "Question10", "其他情况")
    ]
}