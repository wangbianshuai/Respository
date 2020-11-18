module.exports = {
    name: "MarriageMakePair",
    viewName: 'ViewMarriageMakePair',
    primaryKey: "MakePairId",
    properties: getProperties(),
    sexDataSource:getSexDataSource()
  }
  
  function getProperties() {
    return [
        getProperty("MakePairId", "MakePairId"),
        getProperty("UserName", "姓名"),
        getProperty("UserSexName", "性别"),
        getProperty("OtherSideUserName", "对方姓名"),
        getProperty("PercentValue", "匹配度(%)"),
        getProperty("CreateDate", "创建时间")
    ]
  }
  
  function getProperty(name, label) { return { name, label } }

  function getSexDataSource() {
    return [{ value: 1, text: "男" }, { value: 2, text: "女" }]
  }