module.exports = {
    Name: "AppAccount",
    PrimaryKey: "AppAccountId",
    Properties: GetProperties(),
    StatusDataSource: GetStatusDataSource()
}

function GetProperties() {
    return [
        GetProperty("AppAccountId", "AppAccountId"),
        GetProperty("AccessPathName", "访问路径名"),
        GetProperty("CompanyName", "公司名称"),
        GetProperty("LogoImageUrl", "公司Logo"),
        GetProperty("Address", "地址"),
        GetProperty("Linkman", "联系人"),
        GetProperty("Phone", "手机"),
        GetProperty("AppId", "微信AppId"),
        GetProperty("Secret", "微信Secret"),
        GetProperty("DeveloperWeChat", "微信开发者微信号"),
        GetProperty("StatusName", "状态"),
        GetProperty("CreateDate", "创建时间")
    ]
}

function GetProperty(Name, Label) { return { Name, Label } }

function GetStatusDataSource() {
    return [{ Value: 1, Text: "正常" }, { Value: 2, Text: "关闭" }]
}