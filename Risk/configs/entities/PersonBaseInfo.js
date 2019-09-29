const { GetProperty } =require( "./Common");

module.exports= {
    Name: "PersonBaseInfo",
    PrimaryKey: "Id",
    Properties: GetProperties(),
    EducationalDataSource: GetEducationalDataSource(),
    MaritalStatusDataSource: GetMaritalStatusDataSource(),
    HouseStatusDataSource: GetHouseStatusDataSource()
}

/*commonUsePhone (number, optional): 个人基本信息-常用手机号 ,
userType (string, optional): 个人基本信息-用户类型 ,
emailAddress (string, optional): 个人基本信息-邮箱地址 ,
educationLevel (string, optional): 个人基本信息-教育程度 ,
maritalStatus (string, optional): 个人基本信息-婚姻状况 ,
marriedYears (number, optional): 个人基本信息-婚姻年限 ,
homeAddress (string, optional): 个人基本信息-现居住地址 ,
leaseStatus (string, optional): 个人基本信息-是否租赁 ,
leaseStartPeriod (string, optional): 个人基本信息-租赁起始日期 ,
leaseEndPeriod (string, optional): 个人基本信息-租赁截止日期 ,
electricityBillId (string, optional): 个人基本信息-电费账单号*/
function GetProperties() {
    return [
        GetProperty("Phone", "commonUsePhone", "常用手机号"),
        GetProperty("Email", "emailAddress", "邮箱地址"),
        GetProperty("Educational", "educationLevel", "教育程度"),
        GetProperty("MaritalStatus", "maritalStatus", "婚姻状况"),
        GetProperty("MaritalYears", "marriedYears", "已婚年限"),
        GetProperty("NowAddress", "homeAddress", "现居住地址"),
        GetProperty("HouseStatus", "leaseStatus", "居住地是否租赁"),
        GetProperty("HousePeriod", "HousePeriod", "租赁有效期限"),
        GetProperty("ElectricityCode", "electricityBillId", "居住地电费单号"),
        GetProperty("ApprovalRemark", "ApprovalRemark", "审核备注"),
        GetProperty("HasLocalHouse", "hasLocalHouse", "居住地是否租赁"),
    ]
}

  /*教育程度	01	小学02	初中03	高中04	专科05	本科06	硕士07	博士08	未知09	中专10	博士后11其他*/
function GetEducationalDataSource() {
    return [{ Value: "01", Text: "小学" }, { Value: "02", Text: "初中" },
    { Value: "03", Text: "高中" }, { Value: "04", Text: "专科" },
    { Value: "05", Text: "本科" }, { Value: "06", Text: "硕士" },
    { Value: "07", Text: "博士" },{ Value: "08", Text: "未知" }, { Value: "09", Text: "中专" },
    { Value: "10", Text: "博士后" }, { Value: "11", Text: "其他" },]
}

/*
婚姻状况	01	未婚
	02	已婚
	03	离异
	04	丧偶*/
function GetMaritalStatusDataSource() {
    return [{ Value: "01", Text: "未婚" }, { Value: "02", Text: "已婚" },
    { Value: "03", Text: "离异" }, { Value: "04", Text: "丧偶" }]
}

/*
布尔值是否	01	是
	02	否*/
function GetHouseStatusDataSource() {
    return [{ Value: "01", Text: "是" }, { Value: "02", Text: "否" }]
}

