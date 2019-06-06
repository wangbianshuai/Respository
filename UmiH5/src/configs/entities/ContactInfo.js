import { GetProperty } from "./Common";

export default {
    Name: "ContactInfo",
    PrimaryKey: "Id",
    Properties: GetProperties()
}

function GetProperties() {
    return [
        GetProperty("kinsfolkContactName", "kinsfolkContactName", "姓名"),
        GetProperty("kinsfolkContactMobile", "kinsfolkContactMobile", "手机号"),
        GetProperty("kinsfolkContactRelation", "kinsfolkContactRelation", "关系"),
        GetProperty("kinsfolkContactAddr", "kinsfolkContactAddr", "现居住地址"),
        GetProperty("urgencyContactName", "urgencyContactName", "姓名"),
        GetProperty("urgencyContactMobile", "urgencyContactMobile", "手机号"),
        GetProperty("urgencyContactRelation", "urgencyContactRelation", "关系"),
        GetProperty("urgencyContactAddr", "urgencyContactAddr", "现居住地址"),
        GetProperty("companyContactName", "companyContactName", "姓名"),
        GetProperty("companyContactMobile", "companyContactMobile", "手机号"),
        GetProperty("companyContactRelation", "companyContactRelation", "关系"),
        GetProperty("companyContactAddr", "companyContactAddr", "现居住地址"),
        GetProperty("ApprovalRemark", "ApprovalRemark", "审核备注")
    ]
}

