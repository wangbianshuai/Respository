module.exports = {
  Name: "Week",
  PrimaryKey: "Id",
  Properties: GetProperties()
}

function GetProperties() {
  return [
      GetProperty("Id", "Id"),
      GetProperty("StartDate", "Start Date"),
      GetProperty("EndDate", "End Date"),
      GetProperty("WorkingHours", "Working Hours"),
      GetProperty("Remark", "Remark"),
      GetProperty("CreateDate", "Create Date")
  ]
}

function GetProperty(Name, Label) { return { Name, Label } }