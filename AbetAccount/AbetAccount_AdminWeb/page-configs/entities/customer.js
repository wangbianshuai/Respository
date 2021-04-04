module.exports = {
    name: "Customer",
    viewName: 'ViewCustomer',
    primaryKey: "CustomerId",
    properties: getProperties()
  }
  
  function getProperties() {
    return [
        getProperty("CustomerId", "CustomerId"),
        getProperty("Name", "姓名"),
        getProperty("Phone", "手机"),
        getProperty("CompanyName", "公司"),
        getProperty("Address", "地址"),
        getProperty("Remark", "备注"),
        getProperty("CreateDate", "创建时间")
    ]
  }
  
  function getProperty(name, label) { return { name, label } }