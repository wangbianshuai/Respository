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
      GetProperty("Remark", "Remark"),
      GetProperty("CreateDate", "Create Date")
  ]
}

function GetProperty(Name, Label) { return { Name, Label } }