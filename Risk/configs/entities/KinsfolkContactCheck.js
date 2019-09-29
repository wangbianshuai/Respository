const { GetProperty } =require( "./Common");

module.exports= {
    Name: "KinsfolkContactCheck",
    PrimaryKey: "OrderCode",
    PropertyPrimaryKey: "loanApplyId",
    Properties: GetProperties()
}

function GetProperties() {
    return [
        GetProperty("ContactPhone", "phoneNumber", "联系人电话"),
        GetProperty("ContactName", "contactName", "联系人名称"),
        GetProperty("Relationship", "relationshipName", "联系人关系"),
        GetProperty("FirstCallDate", "firstCallTime", "选择第一次拨打时间"),
        GetProperty("SecondCallDate", "secondCallTime", "选择第二次拨打时间"),
        GetProperty("ThirdCallDate", "thirdCallTime", "选择第三次拨打时间"),
        GetProperty("Question1", "主要申请人身份信息", "主要申请人身份信息"),
        GetProperty("Question2", "单位名称、单位地址", "单位名称、单位地址"),
        GetProperty("Question3", "主要申请人住宅地址", "主要申请人住宅地址"),
        GetProperty("Question4", "主要申请人资产情况", "主要申请人资产情况"),
        GetProperty("Question5", "主要申请人负债情况", "主要申请人负债情况"),
        GetProperty("Question6", "主要申请人其他联系方式", "主要申请人其他联系方式"),
        GetProperty("Question7", "主要申请人其他公司", "主要申请人其他公司"),
        GetProperty("Question8", "主要申请人投资偏好", "主要申请人投资偏好/不良嗜好/是否购买保险以及家庭成员健康情况"),
        GetProperty("Question9", "主要申请人婚姻状况、子女情况", "主要申请人婚姻状况、子女情况"),
        GetProperty("Question10", "其他情况", "其他情况")
    ]
}