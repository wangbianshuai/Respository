module.exports = {
  Name: "Daily",
  PrimaryKey: "Id",
  StoryDataSource: GetStoryDataSource(),
  UserDataSource: GetUserDataSource(),
  Properties: GetProperties()
}

function GetProperties() {
  return [
    GetProperty("Id", "Id"),
    GetProperty("WorkingDate", "Working Date"),
    GetProperty("StoryName", "Story"),
    GetProperty("Content", "Content"),
    GetProperty("HoursCount", "Hours"),
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
    ServiceName: "DailyService",
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
    ServiceName: "DailyService",
    ActionName: "GetUsers",
    IsRefresh: true,
    Payload: {}
  }
}
