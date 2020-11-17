module.exports = {
    name: "MarriageSquare",
    viewName: 'ViewMarriageSquare',
    primaryKey: "MarriageSquareId",
    properties: getProperties()
  }
  
  function getProperties() {
    return [
        getProperty("MarriageSquareId", "MarriageSquareId"),
        getProperty("UserName", "姓名"),
        getProperty("UserSexName", "性别"),
        getProperty("OtherSideUserName", "对方姓名"),
        getProperty("RoseCount", "赠送玫瑰数"),
        getProperty("UpdateDate", "最近赠送时间")
    ]
  }
  
  function getProperty(name, label) { return { name, label } }