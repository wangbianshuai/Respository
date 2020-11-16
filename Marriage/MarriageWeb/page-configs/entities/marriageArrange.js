module.exports = {
  name: "MarriageArrange",
  viewName: 'ViewMarriageArrange',
  primaryKey: "MarriageArrangeId",
  properties: getProperties(),
  statusDataSource: getStatusDataSource(),
  sourceTypeDataSource: getSourceTypeDataSource(),
  matchmakerDataSource: getMatchmakerDataSource(),
  manMarriageUserDataSource: getManMarriageUserDataSource(),
  womanMarriageUserDataSource: getWomanMarriageUserDataSource(),
  agreeDataSource: getAgreeDataSource(),
}

function getProperties() {
  return [
    getProperty("MarriageArrangeId", "MarriageArrangeId"),
    getProperty("ArrangeId", "编号"),
    getProperty("ManUserName", "男方"),
    getProperty("WomanUserName", "女方"),
    getProperty("ManMatchmakerName", "男方红娘"),
    getProperty("WomanMatchmakerName", "女方红娘"),
    getProperty("AppMatchmakerName", "平台红娘"),
    getProperty("MarriageDate", "相亲时间"),
    getProperty("MarriageAddress", "相亲地点"),
    getProperty("SourceTypeName", "来源类型"),
    getProperty("Amount", "相亲总费用"),
    getProperty("StatusName", "状态"),
    getProperty("CreateDate", "创建时间")
  ]
}

function getProperty(name, label) { return { name, label } }

function getStatusDataSource() {
  return [{ value: 0, text: "待相亲" }, { value: 1, text: "有意向" }, { value: 2, text: "无意向" }, { value: 3, text: "牵手成功" },
  { value: 4, text: "订婚" }, { value: 5, text: "结婚" }, { value: 6, text: "分手" }, { value: 7, text: "取消" }]
}

function getSourceTypeDataSource() {
  return [{ value: 1, text: "相亲匹配" }, { value: 2, text: "相亲广场" }, { value: 3, text: "相亲牵线" }]
}

function getAgreeDataSource() {
  return [{ value: 1, text: "同意" }, { value: 0, text: "不同意" }]
}

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

function getManMarriageUserDataSource() {
  return {
    valueName: "UserId",
    textName: "UserName",
    stateName: "getMarriageUsers",
    serviceName: "MarriageUserService",
    actionName: "getMarriageUsers",
    isRefresh: true,
    payload: { pathQuery: '?Sex=1' }
  }
}

function getWomanMarriageUserDataSource() {
  return {
    valueName: "UserId",
    textName: "UserName",
    stateName: "getMarriageUsers",
    serviceName: "MarriageUserService",
    actionName: "getMarriageUsers",
    isRefresh: true,
    payload: { pathQuery: '?Sex=2' }
  }
}