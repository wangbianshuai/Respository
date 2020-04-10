// eslint-disable-next-line import/no-commonjs
module.exports = {
  name: "WorkingHours",
  primaryKey: "Id",
  weekDataSource: getWeekDataSource(),
  storyDataSource: getStoryDataSource(),
  userDataSource: getUserDataSource(),
  properties: getProperties()
}

function getProperties() {
  return [
    getProperty("Id", "Id"),
    getProperty("WeekName", "Week"),
    getProperty("WeekWorkingHours", "Week Working Hours"),
    getProperty("StoryName", "Story"),
    getProperty("Content", "Content"),
    getProperty("HourCount", "Working Hours"),
    getProperty("StartMonth", "Start Month"),
    getProperty("EndMonth", "End Month"),
    getProperty("Remark", "Remark"),
    getProperty("CreateUserName", "User"),
    getProperty("CreateDate", "Create Date")
  ]
}
function getProperty(name, label) { return { name, label } }

function getWeekDataSource() {
  return {
    valueName: "Id",
    textName: "WeekName",
    stateName: "getWeeks",
    serviceName: "WeekService",
    actionName: "getWeeks",
    isRefresh: true,
    payload: {}
  }
}

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
