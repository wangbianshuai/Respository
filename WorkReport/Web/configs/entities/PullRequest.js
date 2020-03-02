module.exports = {
  Name: "PullRequest",
  PrimaryKey: "Id",
  StoryDataSource: GetStoryDataSource(),
  UserDataSource: GetUserDataSource(),
  Properties: GetProperties()
}

function GetProperties() {
  return [
    GetProperty("Id", "Id"),
    GetProperty("PullRequestTitle", "Pull Request Title"),
    GetProperty("StoryName", "Story"),
    GetProperty("TestCases", "Test Cases"),
    GetProperty("Comments", "Comments"),
    GetProperty("StartDate", "Start Date"),
    GetProperty("EndDate", "End Date"),
    GetProperty("Remark", "Remark"),
    GetProperty("CreateUserName", "User"),
    GetProperty("CreateDate", "Create Date")
  ]
}

function GetProperty(Name, Label) { return { Name, Label } }

function GetStoryDataSource() {
  return {
    ValueName: "Id",
    TextName: "StoryName",
    StateName: "Storys",
    ServiceName: "PullRequestService",
    ActionName: "GetStorys",
    IsRefresh: true,
    Payload: {}
  }
}

function GetUserDataSource() {
  return {
    ValueName: "UserId",
    TextName: "UserName",
    StateName: "Users",
    ServiceName: "PullRequestService",
    ActionName: "GetUsers",
    IsRefresh: true,
    Payload: {}
  }
}
