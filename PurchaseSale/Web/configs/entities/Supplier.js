module.exports = {
    Name: "Supplier",
    PrimaryKey: "Id",
    Properties: GetProperties()
}

function GetProperties() {
    return [
        GetProperty("Id", "Id"),
        GetProperty("Name", "名称"),
        GetProperty("CompanyName", "公司名称"),
        GetProperty("Linkman", "联系人"),
        GetProperty("Phone", "手机"),
        GetProperty("Telephone", "电话"),
        GetProperty("Fax", "传真"),
        GetProperty("Address", "地址"),
        GetProperty("Remark", "备注"),
        GetProperty("CreateDate", "创建时间")
    ]
}

function GetProperty(Name, Label) { return { Name, Label } }