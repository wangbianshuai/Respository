export default {
    Name: "CompanyInfo",
    PrimaryKey: "Id",
    Properties: GetProperties()
}

function GetProperties() {
    return [
        get("companyName", "companyName","企业名称"),
        get("buslicenseNo","buslicenseNo", "统一社会信用代码"),
        get("registerTime","registerTime", "注册时间"),
        get("registerCapital","registerCapital", "注册资金", ),
        get("operateTime","operateTime", "经营年限"),
        get("companyAddr","companyAddr", "单位地址"),
        get("companyPhoneNumber","companyPhoneNumber","单位电话",),
        get("email","email", "单位邮箱"),
    ]
}

function get(Name, PropertyName, Label) {
    return { Name, PropertyName, Label}
}