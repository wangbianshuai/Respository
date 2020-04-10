// eslint-disable-next-line import/no-commonjs
module.exports = {
  name: "PullRequest",
  primaryKey: "Id",
  storyDataSource: getStoryDataSource(),
  userDataSource: getUserDataSource(),
  properties: getProperties()
}

function getProperties() {
  return [
    getProperty("Id", "Id"),
    getProperty("PullRequestTitle", "Pull Request Title"),
    getProperty("StoryName", "Story"),
    getProperty("StoryUrl", "Story Url"),
    getProperty("PullRequestUrl", "Pull Request Url"),
    getProperty("TestCases", "Test Cases"),
    getProperty("Comments", "Comments"),
    getProperty("StartDate", "Start Date"),
    getProperty("EndDate", "End Date"),
    getProperty("StartMonth", "Start Month"),
    getProperty("EndMonth", "End Month"),
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
