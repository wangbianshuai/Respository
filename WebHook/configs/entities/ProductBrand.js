module.exports = {
    Name: "ProductBrand",
    PrimaryKey: "Id",
    Properties: GetProperties()
}

function GetProperties() {
    return [
        GetProperty("Id", "Id"),
        GetProperty("Name", "名称"),
        GetProperty("Remark", "备注"),
        GetProperty("CreateDate", "创建时间")
    ]
}

function GetProperty(Name, Label) { return { Name, Label } }