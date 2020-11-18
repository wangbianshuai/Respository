module.exports = {
    name: "MarriageMakePair2",
    viewName: 'ViewMarriageMakePair2',
    primaryKey: "MakePairId",
    properties: getProperties(),
    appMatchmakerDataSource:getAppMatchmakerDataSource()
  }
  
  function getProperties() {
    return [
        getProperty("MakePairId", "MakePairId"),
        getProperty("ManUserName", "男方"),
        getProperty("ManMatchmakerName", "男方红娘"),
        getProperty("PercentValue", "女方匹配男方(%)"),
        getProperty("WomanUserName", "女方"),
        getProperty("WomanMatchmakerName", "女方红娘"),
        getProperty("PercentValue2", "男方匹配女方(%)"),
        getProperty("PercentValue3", "综合匹配度(%)"),
        getProperty("CreateDate3", "创建时间"),
        getProperty("ArrangeId", "相亲安排编号")
    ]
  }
  
  function getProperty(name, label) { return { name, label } }

  function getAppMatchmakerDataSource() {
    return {
      valueName: "MatchmakerId",
      textName: "Name",
      stateName: "getAppMatchmakers",
      serviceName: "MatchmakerService",
      actionName: "getAppMatchmakers",
      isRefresh: true,
      payload: {}
    }
  }