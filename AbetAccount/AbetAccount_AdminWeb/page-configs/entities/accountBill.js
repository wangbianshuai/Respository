module.exports = {
    name: "AccountBill",
    viewName: 'ViewAccountBill',
    primaryKey: "BillId",
    properties: getProperties()
  }
  
  function getProperties() {
    return [
        getProperty("BillId", "BillId"),
        getProperty("CustomerName", "客户"),
        getProperty("AccountTypeNme", "账目类型"),
        getProperty("BillDate", "日期"),
        getProperty("Amount2", "金额"),
        getProperty("Tax2", "税额"),
        getProperty("IncomeOutlay", "收支"),
        getProperty("CreateUserName", "记账人"),
        getProperty("Remark", "备注"),
        getProperty("CreateDate", "创建时间")
    ]
  }
  
  function getProperty(name, label) { return { name, label } }