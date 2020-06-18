module.exports = {
    name: "AppAccount",
    primaryKey: "AppAccountId",
    properties: getProperties(),
    statusDataSource: getStatusDataSource()
}

function getProperties() {
    return [
        getProperty("AppAccountId", "AppAccountId"),
        getProperty("AccessPathName", "访问路径名"),
        getProperty("CompanyName", "公司名称"),
        getProperty("LogoImageUrl", "公司Logo"),
        getProperty("Address", "地址"),
        getProperty("Linkman", "联系人"),
        getProperty("Phone", "手机"),
        getProperty("AppId", "微信AppId"),
        getProperty("Secret", "微信Secret"),
        getProperty("DeveloperWeChat", "微信开发者微信号"),
        getProperty("StatusName", "状态"),
        getProperty("CreateDate", "创建时间")
    ]
}

function getProperty(name, label) { return { name, label } }

function getStatusDataSource() {
    return [{ value: 1, text: "正常" }, { value: 2, text: "关闭" }]
}