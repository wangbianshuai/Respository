module.exports = {
  name: "Matchmaker",
  viewName: 'ViewMatchmaker',
  primaryKey: "MatchmakerId",
  properties: getProperties(),
  sexDataSource: getSexDataSource(),
  isAppMatchmakerDataSource: getIsAppMatchmakerDataSource()
}

function getProperties() {
  return [
    getProperty("MatchmakerId", "MatchmakerId"),
    getProperty("Name", "名称"),
    getProperty("NickName", "昵称"),
    getProperty("SexName", "性别"),
    getProperty("Province", "省份"),
    getProperty("City", "城市"),
    getProperty("HeadImgUrl", "头像"),
    getProperty("IdCard", "身份证号码"),
    getProperty("Phone", "手机"),
    getProperty("Address", "家庭地址"),
    getProperty("IsAppMatchmakerName", "是否平台红娘"),
    getProperty("StatusName", "状态"),
    getProperty("CreateDate", "创建时间")
  ]
}

function getProperty(name, label) { return { name, label } }

function getSexDataSource() {
  return [{ value: 1, text: "男" }, { value: 2, text: "女" }]
}

function getIsAppMatchmakerDataSource() {
  return [{ value: 1, text: "是" }, { value: 0, text: "否" }]
}