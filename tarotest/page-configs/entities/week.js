// eslint-disable-next-line import/no-commonjs
module.exports = {
  name: "Week",
  primaryKey: "Id",
  properties: getProperties()
}

function getProperties() {
  return [
    getProperty("Id", "Id"),
    getProperty("StartDate", "Start Date"),
    getProperty("EndDate", "End Date"),
    getProperty("WorkingHours", "Working Hours"),
    getProperty("Remark", "Remark"),
    getProperty("CreateDate", "Create Date")
  ]
}

function getProperty(name, label) {
  return { name, label }
}
