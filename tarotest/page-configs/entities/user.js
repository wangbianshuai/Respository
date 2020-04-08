// eslint-disable-next-line import/no-commonjs
module.exports = {
  name: "User",
  primaryKey: "UserId",
  properties: getProperties()
}

function getProperties() {
  return [
    getProperty("UserId", "UserId"),
    getProperty("UserName", "用户名"),
    getProperty("LoginName", "登录名"),
    getProperty("LastLoginDate", "最近登录时间"),
    getProperty("CreateDate", "创建时间")
  ]
}

function getProperty(name, label) {
  return { name, label }
}
