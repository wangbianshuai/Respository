module.exports = {
  name: "AccountCategory",
  viewName: 'ViewAccountCategory',
  primaryKey: "CategoryId",
  properties: getProperties(),
  accountItemsDataSource: getAccountItemsDataSource()
}

function getProperties() {
  return [
    getProperty("CategoryId", "CategoryId"),
    getProperty("Name", "名称"),
    getProperty("AccountItemName", "账目名称"),
    getProperty("Remark", "备注"),
    getProperty("CreateDate", "创建时间")
  ]
}

function getProperty(name, label) { return { name, label } }

function getAccountItemsDataSource() {
  return {
      valueName: "ItemId",
      textName: "Name",
      stateName: "getAccountItems",
      serviceName: "AccountItemService",
      actionName: "getAccountItems",
      isRefresh: true,
      payload: {}
  }
}