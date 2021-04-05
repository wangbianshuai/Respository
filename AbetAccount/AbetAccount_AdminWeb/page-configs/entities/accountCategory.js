module.exports = {
    name: "AccountCategory",
    viewName: 'ViewAccountCategory',
    primaryKey: "CategoryId",
    properties: getProperties()
  }
  
  function getProperties() {
    return [
        getProperty("CategoryId", "CategoryId"),
        getProperty("IncomeOutlayName", "收支"),
        getProperty("Remark", "备注"),
        getProperty("CreateDate", "创建时间")
    ]
  }
  
  function getProperty(name, label) { return { name, label } }