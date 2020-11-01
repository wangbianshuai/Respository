module.exports = {
    name: "Matchmaker",
    viewName: 'ViewMatchmaker',
    primaryKey: "MatchmakerId",
    properties: getProperties()
  }
  
  function getProperties() {
    return [
        getProperty("MatchmakerId", "MatchmakerId"),
        getProperty("Name", "键名"),
        getProperty("Value", "值"),
        getProperty("TypeName", "类型名"),
        getProperty("Remark", "备注"),
        getProperty("CreateDate", "创建时间")
    ]
  }
  
  function getProperty(name, label) { return { name, label } }