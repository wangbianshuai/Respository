module.exports = {
  Name: "Story",
  PrimaryKey: "Id",
  Properties: GetProperties()
}

function GetProperties() {
  return [
      GetProperty("Id", "Id"),
      GetProperty("StoryId", "Story Id"),
      GetProperty("StoryTitle", "Story Title"),
      GetProperty("StoryUrl", "Story Url"),
      GetProperty("StartDate", "Start Date"),
      GetProperty("EndDate", "End Date"),
      GetProperty("StartMonth", "Start Month"),
      GetProperty("EndMonth", "End Month"),
      GetProperty("Remark", "Remark"),
      GetProperty("CreateDate", "Create Date")
  ]
}

function GetProperty(Name, Label) { return { Name, Label } }