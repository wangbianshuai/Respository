module.exports = {
    name: "DictionaryConfig",
    viewName: 'ViewDictionaryConfig',
    primaryKey: "DictionaryConfigId",
    properties: getProperties()
  }
  
  function getProperties() {
    return [
        getProperty("DictionaryConfigId", "DictionaryConfigId"),
        getProperty("name", "键名"),
        getProperty("value", "值"),
        getProperty("TypeName", "类型名"),
        getProperty("Remark", "备注"),
        getProperty("CreateDate", "创建时间")
    ]
  }
  
  function getProperty(name, label) { return { name, label } }