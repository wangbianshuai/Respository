const { GetProperty } =require( "./Common");

module.exports= {
    Name: "CompanyContactCheck",
    PrimaryKey: "OrderCode",
    PropertyPrimaryKey: "loanApplyId",
    Properties: GetProperties()
}

function GetProperties() {
    return [
        GetProperty("CompanyPhone", "phoneNumber", "单位电话"),
        GetProperty("FirstCallDate", "firstCallTime", "选择第一次拨打时间"),
        GetProperty("SecondCallDate", "secondCallTime", "选择第二次拨打时间"),
        GetProperty("ThirdCallDate", "thirdCallTime", "选择第三次拨打时间"),
        GetProperty("Question1", "公司名称、地址", "公司名称、地址"),
        GetProperty("Question2", "主要申请人在公司职务", "主要申请人在公司职务"),
        GetProperty("Question3", "公司主营业务及品牌", "公司主营业务及品牌"),
        GetProperty("Question4", "上下游客户情况", "上下游客户情况"),
        GetProperty("Question5", "员工情况/作息时间/工资发放情况/是否五险一金", "员工情况/作息时间/工资发放情况/是否五险一金"),
        GetProperty("Question6", "单位邮箱", "单位邮箱"),
        GetProperty("Question7", "主要申请人联系方式", "主要申请人联系方式"),
        GetProperty("Question8", "其他情况", "其他情况")
    ]
}