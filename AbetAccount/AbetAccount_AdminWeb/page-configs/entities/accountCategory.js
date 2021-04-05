module.exports = {
  name: "AccountCategory",
  viewName: 'ViewAccountCategory',
  primaryKey: "CategoryId",
  properties: getProperties(),
  incomeOutlayDataSource: getIncomeOutlayDataSource()
}

function getProperties() {
  return [
    getProperty("CategoryId", "CategoryId"),
    getProperty("Name", "名称"),
    getProperty("IncomeOutlayName", "收支"),
    getProperty("Remark", "备注"),
    getProperty("CreateDate", "创建时间")
  ]
}

function getProperty(name, label) { return { name, label } }

function getIncomeOutlayDataSource() {
  return [{ value: 0, text: "支出" }, { value: 1, text: "收入" }]
}