const EntityModelsConfig = require("./EntityModelsConfig");

module.exports = {
    Name: "RegExp",
    PrimaryKey: "Id",
    Properties: GetProperties(),
    ModelsConfig: EntityModelsConfig("RegExp")
}

function GetProperties() {
    return [
        GetProperty("Id", "Id"),
        GetProperty("Name", "名称"),
        GetProperty("Expression", "表达式"),
        GetProperty("Remark", "备注"),
        GetProperty("Create_Date", "创建时间")
    ]
}

function GetProperty(Name, Label) {
    return { Name, Label }
}