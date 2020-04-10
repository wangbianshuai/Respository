// eslint-disable-next-line import/no-commonjs
module.exports = {
  name: "Story",
  primaryKey: "Id",
  properties: getProperties()
}

function getProperties() {
  return [
    getProperty("Id", "Id"),
    getProperty("StoryId", "Story Id"),
    getProperty("StoryTitle", "Story Title"),
    getProperty("StoryUrl", "Story Url"),
    getProperty("StartDate", "Start Date"),
    getProperty("EndDate", "End Date"),
    getProperty("StartMonth", "Start Month"),
    getProperty("EndMonth", "End Month"),
    getProperty("Remark", "Remark"),
    getProperty("CreateDate", "Create Date")
  ]
}

function getProperty(name, label) {
  return { name, label }
}
