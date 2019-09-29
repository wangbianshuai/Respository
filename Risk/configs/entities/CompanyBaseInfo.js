const { GetProperty } =require( "./Common");

module.exports= {
    Name: "CompanyBaseInfo",
    PrimaryKey: "Id",
    Properties: GetProperties(),
    HouseStatusDataSource: GetHouseStatusDataSource()
}

/*companyName (string, optional): 企业-公司名称 ,
legalPersonIdNum (string, optional): 企业-法人身份证号 ,
legalPersonName (string, optional): 企业-法人姓名 ,
legalPersonPhone (string, optional): 企业-法人手机号 ,
socialCreditId (string, optional): 企业-统一社会信用代码 ,
establishedDate (string, optional): 企业-公司成立时间 ,
registeredCapital (number, optional): 企业-注册资金 ,
operateYears (number, optional): 企业-经营年限 ,
companyAddress (string, optional): 企业-单位地址 ,
companyPhone (string, optional): 企业-单位电话 ,
companyEmail (string, optional): 企业-单位邮箱 ,
industryCategory (string, optional): 企业-行业门类 ,
industryCategoryBig (string, optional): 企业-行业大类 ,
industryCategoryMiddle (string, optional): 企业-行业中类 ,
industryCategorySmall (string, optional): 企业-行业小类 ,
leaseStatus (string, optional): 企业-办公地是否租赁 ,
leaseStartPeriod (string, optional): 企业-办公地租赁起始日期 ,
leaseEndPeriod (string, optional): 企业-办公地租赁截止日期 ,
electricityBillId (string, optional): 企业-电费账单号*/
function GetProperties() {
    return [
        GetProperty("CompanyName", "companyName", "企业名称"),
        GetProperty("CompanyIdNumber", "socialCreditId", "统一社会信用代码"),
        GetProperty("LegalPersonName", "legalPersonName", "法人姓名"),
        GetProperty("LegalPersonIdNumber", "legalPersonIdNum", "法人身份证号"),
        GetProperty("LegalPersonPhone", "legalPersonPhone", "统一社会信用代码"),
        GetProperty("RegisterDate", "establishedDate", "成立时间"),
        GetProperty("RegisterAmount", "registeredCapital", "注册资金"),
        GetProperty("ManageYears", "operateYears", "经营年限"),
        GetProperty("CompanyAddress", "companyAddress", "单位地址"),
        GetProperty("CompanyTelephone", "companyPhone", "单位电话"),
        GetProperty("CompanyEmail", "companyEmail", "单位邮箱"),
        GetProperty("Industry1", "industryCategoryName", "行业门类"),
        GetProperty("Industry2", "industryCategoryBigName", "行业大类"),
        GetProperty("Industry3", "industryCategoryMiddleName", "行业中类"),
        GetProperty("Industry4", "industryCategorySmallName", "行业小类"),
        GetProperty("CompanyHouseStatus", "leaseStatus", "办公地是否租赁"),
        GetProperty("CompanyHousePeriod", "CompanyHousePeriod", "租赁有效期限"),
        GetProperty("CompanyElectricityCode", "electricityBillId", "办公地电费单号"),
        GetProperty("ApprovalRemark", "ApprovalRemark", "审核备注")
    ]
}

/*
布尔值是否	01	是
	02	否
*/
function GetHouseStatusDataSource() {
    return [{ Value: "01", Text: "是" }, { Value: "02", Text: "否" }]
}

