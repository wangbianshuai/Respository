module.exports = {
  name: "MarriageUser",
  viewName: 'ViewMarriageUser',
  primaryKey: "UserId",
  properties: getProperties(),
  sexDataSource: getSexDataSource(),
  statusDataSource: getStatusDataSource(),
  matchmakerDataSource: getMatchmakerDataSource(),
  shengxiaoDataSource: getShengxiaoDataSource(),
}

function getProperties() {
  return [
    getProperty("UserId", "UserId"),
    getProperty("Name", "姓名"),
    getProperty("NickName", "昵称"),
    getProperty("SexName", "性别"),
    getProperty("Age", "年龄"),
    getProperty("Shengxiao", "生肖"),
    getProperty("MatchmakerName", "专属红娘"),
    getProperty("Birthday", "出生年月"),
    getProperty("LunarBirthday", "农历生日"),
    getProperty("HeadImgUrl", "头像"),
    getProperty("IdCard", "身份证号码"),
    getProperty("Phone", "手机"),
    getProperty("Address", "家庭地址"),
    getProperty("StatusName", "状态"),
    getProperty("CreateDate", "创建时间")
  ]
}

function getProperty(name, label) { return { name, label } }

function getSexDataSource() {
  return [{ value: 1, text: "男" }, { value: 2, text: "女" }]
}

function getStatusDataSource() {
  return [{ value: 0, text: "待审核" }, { value: 1, text: "审核通过" }, { value: 2, text: "审核不通过" }, { value: 3, text: "关闭" }]
}

function getShengxiaoDataSource() {
  return [{ value: '鼠', text: "鼠" },
  { value: '牛', text: "牛" },
  { value: '虎', text: "虎" },
  { value: '兔', text: "兔" },
  { value: '龙', text: "龙" },
  { value: '蛇', text: "蛇" },
  { value: '马', text: "马" },
  { value: '羊', text: "羊" },
  { value: '猴', text: "猴" },
  { value: '鸡', text: "鸡" },
  { value: '狗', text: "狗" },
  { value: '猪', text: "猪" }]
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