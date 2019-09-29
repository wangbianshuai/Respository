const { GetProperty } =require( "./Common");

module.exports= {
    Name: "ContactInfo",
    PrimaryKey: "Id",
    Properties: GetProperties(),
    KinsfolkContactDataSource: GetKinsfolkContactDataSource(),
    CompanyContactDataSource: GetCompanyContactDataSource(),
    UrgencyContactDataSource: GetUrgencyContactDataSource()
}

function GetProperties() {
    return [
        GetProperty("kinsfolkContactName", "kinsfolkContactName", "姓名"),
        GetProperty("kinsfolkContactMobile", "kinsfolkContactMobile", "手机号"),
        GetProperty("kinsfolkContactRelation", "kinsfolkContactRelation", "关系"),
        GetProperty("kinsfolkContactRelationName", "kinsfolkContactRelationName", "关系"),
        GetProperty("kinsfolkContactAddr", "kinsfolkContactAddr", "现居住地址"),
        GetProperty("urgencyContactName", "urgencyContactName", "姓名"),
        GetProperty("urgencyContactMobile", "urgencyContactMobile", "手机号"),
        GetProperty("urgencyContactRelation", "urgencyContactRelation", "关系"),
        GetProperty("urgencyContactRelationName", "urgencyContactRelationName", "关系"),
        GetProperty("urgencyContactAddr", "urgencyContactAddr", "现居住地址"),
        GetProperty("companyContactName", "companyContactName", "姓名"),
        GetProperty("companyContactMobile", "companyContactMobile", "手机号"),
        GetProperty("companyContactRelation", "companyContactRelation", "关系"),
        GetProperty("companyContactRelationName", "companyContactRelationName", "关系"),
        GetProperty("companyContactAddr", "companyContactAddr", "现居住地址"),
        GetProperty("ApprovalRemark", "ApprovalRemark", "审核备注")
    ]
}

/*亲属关系	01	夫妻
	02	父母
    03	兄弟*/
function GetKinsfolkContactDataSource() {
    return [{ Value: "01", Text: "夫妻" }, { Value: "02", Text: "父母" }, { Value: "03", Text: "兄弟" }]
}

/*单位关系	01	上级
	02	下级
    03	同事*/
function GetCompanyContactDataSource() {
    return [{ Value: "01", Text: "上级" }, { Value: "02", Text: "下级" }, { Value: "03", Text: "同事" }]
}

/*紧急关系	01	亲属
	02	同事
    03	朋友*/
function GetUrgencyContactDataSource() {
    return [{ Value: "01", Text: "亲属" }, { Value: "02", Text: "同事" }, { Value: "03", Text: "朋友" }]
}