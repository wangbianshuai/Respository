const { GetProperty } =require( "./Common");

module.exports= {
    Name: "CoBorrowerInfo",
    PrimaryKey: "OrderCode",
    PropertyPrimaryKey: "loanApplyId",
    Properties: GetProperties(),
    UserTypeDataSource: GetUserTypeDataSource(),
    CautionerTypeDataSource: GetCautionerTypeDataSource(),
    LoanRelationDataSource: GetLoanRelationDataSource()
}

/*/*personType (string, optional): 类型 ,
name (string, optional): 姓名或企业名称 ,
personId (string, optional): 身份证或社会信用代码 ,
contactPhone (string, optional): 联系方式 ,
email (string, optional): 邮箱 ,
coLenderMainPart (string, optional): 共同借款主体 ,
guarantorMainPart (string, optional): 担保主体 ,
relationship (string, optional): 与借款主体关系 ,
bankcardId (string, optional): 银行卡号 ,
accountOpenBank (string, optional): 开户行 ,
branchBank (string, optional): 支行信息*/
function GetProperties() {
    return [
        GetProperty("UserType", "personType", "用户类型"),
        GetProperty("Name", "name", "姓名/企业名称"),
        GetProperty("IdNumber", "personId", "身份证号/统一社会信用代码"),
        GetProperty("CompanyName", "name", "企业名称"),
        GetProperty("CompanyIdNumber", "personId", "统一社会信用代码"),
        GetProperty("Phone", "contactPhone", "联系方式"),
        GetProperty("Email", "email", "邮箱"),
        GetProperty("CautionerType", "coLenderMainPart", "共同借款主体"),
        GetProperty("LoanRelation", "relationship", "与借款主体关系")
    ]
}

/*
借款人类型	01	个人
	02	企业*/
function GetUserTypeDataSource() {
    return [{ Value: "01", Text: "个人" }, { Value: "02", Text: "企业" }]
}

/*
*/
function GetCautionerTypeDataSource() {
    return [{ Value: "01", Text: "主共同借款人" }, { Value: "02", Text: "法定代表共同借款人" },
    { Value: "03", Text: "有房朋友共同借款人" }, { Value: "04", Text: "额外共同借款人" },
    { Value: "05", Text: "其他" }]
}

/*
与借款主体关系	01	股东
    02	配偶
    03	亲属
    04	其他*/
function GetLoanRelationDataSource() {
    return [{ Value: "01", Text: "股东" }, { Value: "02", Text: "配偶" },
    { Value: "03", Text: "亲属" }, { Value: "04", Text: "其他" }]
}