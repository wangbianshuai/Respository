module.exports = {
  name: "MatchmakerFeeDetail",
  viewName: 'ViewMatchmakerFeeDetail',
  primaryKey: "DetailId",
  properties: getProperties(),
  matchmakerDataSource: getMatchmakerDataSource()
}

function getProperties() {
  return [
    getProperty("DetailId", "DetailId"),
    getProperty("ArrangeId", "相亲安排编号"),
    getProperty("FeeDate", "日期"),
    getProperty("ManName", "男方"),
    getProperty("WomanName", "女方"),
    getProperty("MatchmakerName", "红娘"),
    getProperty("MatchmakerTypeName","红娘类型"),
    getProperty("Amount", "红娘中介费"),
    getProperty("AppAmount", "平台中介费"),
    getProperty("Remark", "备注"),
    getProperty("CreateDate", "创建时间")
  ]
}

function getProperty(name, label) { return { name, label } }


function getMatchmakerDataSource() {
  return {
    valueName: "MatchmakerId",
    textName: "Name",
    stateName: "getMatchmakers",
    serviceName: "MatchmakerService",
    actionName: "getMatchmakers",
    isRefresh: true,
    payload: {}
  }
}