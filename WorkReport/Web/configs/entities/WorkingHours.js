module.exports = {
  Name: "WorkingHours",
  PrimaryKey: "Id",
  WeekDataSource: GetWeekDataSource(),
  StoryDataSource: GetStoryDataSource(),
  UserDataSource: GetUserDataSource(),
  Properties: GetProperties()
}

function GetProperties() {
  return [
    GetProperty("Id", "Id"),
    GetProperty("WeekName", "Week"),
    GetProperty("WeekWorkingHours", "Week Working Hours"),
    GetProperty("StoryName", "Story"),
    GetProperty("Content", "Content"),
    GetProperty("HourCount", "Working Hours"),
    GetProperty("Remark", "Remark"),
    GetProperty("CreateUserName", "User"),
    GetProperty("CreateDate", "Create Date")
  ]
}

function GetProperty(Name, Label) { return { Name, Label } }

function GetWeekDataSource() {
  return {
    ValueName: "Id",
    TextName: "WeekName",
    StateName: "Weeks",
    ServiceName: "WorkingHoursService",
    ActionName: "GetWeeks",
    IsRefresh: true,
    Payload: {}
  }
}

function GetStoryDataSource() {
  return {
    ValueName: "Id",
    TextName: "StoryName",
    StateName: "Storys",
    ServiceName: "WorkingHoursService",
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
    ServiceName: "WorkingHoursService",
    ActionName: "GetUsers",
    IsRefresh: true,
    Payload: {}
  }
}
