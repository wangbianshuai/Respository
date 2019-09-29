const { GetProperty } =require( "./Common");

module.exports= {
    Name: "WorkmateContactCheck",
    PrimaryKey: "OrderCode",
    PropertyPrimaryKey: "loanApplyId",
    Properties: GetProperties()
}

function GetProperties() {
    return [
        GetProperty("ContactPhone", "phoneNumber", "联系人电话"),
        GetProperty("ContactName", "contactName", "联系人姓名"),
        GetProperty("Relationship", "relationshipName", "联系人关系"),
        GetProperty("FirstCallDate", "firstCallTime", "选择第一次拨打时间"),
        GetProperty("SecondCallDate", "secondCallTime", "选择第二次拨打时间"),
        GetProperty("ThirdCallDate", "thirdCallTime", "选择第三次拨打时间"),
        GetProperty("Question1", "单位名称、单位地址", "单位名称、单位地址"),
        GetProperty("Question2", "单位联系人职务", "单位联系人职务"),
        GetProperty("Question3", "主营业务及经营情况", "主营业务及经营情况"),
        GetProperty("Question4", "上下游客户情况", "上下游客户情况"),
        GetProperty("Question5", "淡旺季情况", "淡旺季情况"),
        GetProperty("Question6", "员工情况/作息时间/工资发放情况/是否五险一金", "员工情况/作息时间/工资发放情况/是否五险一金"),
        GetProperty("Question7", "其他情况", "其他情况")
    ]
}