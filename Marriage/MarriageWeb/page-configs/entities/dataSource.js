module.exports = {
    name: "DataSource",
    viewName: 'ViewDataSource',
    primaryKey: "DataSourceId",
    properties: getProperties()
  }
  
  function getProperties() {
    return [
        getProperty("DataSourceId", "DataSourceId"),
        getProperty("Name", "名称"),
        getProperty("Remark", "备注"),
        getProperty("CreateDate", "创建时间")
    ]
  }
  
  function getProperty(name, label) { return { name, label } }