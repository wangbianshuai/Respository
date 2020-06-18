module.exports = {
    Name: "DictionaryConfig",
    PrimaryKey: "DictionaryConfigId",
    Properties: GetProperties()
  }
  
  function GetProperties() {
    return [
        GetProperty("DictionaryConfigId", "DictionaryConfigId"),
        GetProperty("Name", "键名"),
        GetProperty("Value", "值"),
        GetProperty("TypeName", "类型名"),
        GetProperty("Remark", "备注"),
        GetProperty("CreateDate", "创建时间")
    ]
  }
  
  function GetProperty(Name, Label) { return { Name, Label } }