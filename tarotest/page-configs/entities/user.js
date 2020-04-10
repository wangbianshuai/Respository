// eslint-disable-next-line import/no-commonjs
module.exports = {
  name: "User",
  primaryKey: "UserId",
  properties: getProperties()
}

function getProperties() {
  return [
    getProperty("UserId", "UserId"),
    getProperty("UserName", "User Name"),
    getProperty("LoginName", "Login Name"),
    getProperty("LastLoginDate", "Last Login Date"),
    getProperty("CreateDate", "Create Date")
  ]
}

function getProperty(name, label) {
  return { name, label }
}
