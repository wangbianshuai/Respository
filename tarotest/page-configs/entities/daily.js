// eslint-disable-next-line import/no-commonjs
module.exports = {
  name: "Daily",
  primaryKey: "Id",
  storyDataSource: getStoryDataSource(),
  userDataSource: getUserDataSource(),
  properties: getProperties()
}

function getProperties() {
  return [
    getProperty("Id", "Id"),
    getProperty("WorkingDate", "Working Date"),
    getProperty("StoryName", "Story"),
    getProperty("Content", "Content"),
    getProperty("HoursCount", "Hours"),
    getProperty("Remark", "Remark"),
    getProperty("CreateUserName", "User"),
    getProperty("CreateDate", "Create Date")
  ]
}

function getProperty(name, label) { return { name, label } }

function getStoryDataSource() {
  return {
    valueName: "Id",
    textName: "StoryName",
    stateName: "getStorys",
    serviceName: "StoryService",
    actionName: "getStorys",
    isRefresh: true,
    payload: {}
  }
}

function getUserDataSource() {
  return {
    valueName: "UserId",
    textName: "UserName",
    stateName: "getUsers",
    serviceName: "UserService",
    actionName: "getUsers",
    isRefresh: true,
    payload: {}
  }
}
