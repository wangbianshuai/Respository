module.exports = {
    name: "AccountBill",
    viewName: 'ViewAccountBill',
    primaryKey: "BillId",
    properties: getProperties(),
    accountTypesDataSource: getAccountTypesDataSource(),
    customersDataSource: getCustomersDataSource(),
    usersDataSource:getUsersDataSource(),
    incomeOutlayDataSource:getIncomeOutlayDataSource()
}

function getProperties() {
    return [
        getProperty("BillId", "BillId"),
        getProperty("CustomerName", "客户"),
        getProperty("AccountTypeName", "账目类型"),
        getProperty("BillDate", "日期"),
        getProperty("Amount2", "金额"),
        getProperty("Tax2", "税额"),
        getProperty("IncomeOutlay", "收支"),
        getProperty("CreateUserName", "记账人"),
        getProperty("Remark", "备注"),
        getProperty("CreateDate", "记账时间")
    ]
}

function getIncomeOutlayDataSource() {
    return [{ value: 0, text: "支出" }, { value: 1, text: "收入" }]
}

function getProperty(name, label) { return { name, label } }

function getAccountTypesDataSource() {
    return {
        valueName: "TypeId",
        textName: "Name",
        stateName: "getUserAccountTypes",
        serviceName: "AccountTypeService",
        actionName: "getUserAccountTypes",
        isRefresh: true,
        payload: {}
    }
}

function getCustomersDataSource() {
    return {
        valueName: "CustomerId",
        textName: "Name",
        stateName: "getCustomers",
        serviceName: "CustomerService",
        actionName: "getCustomers",
        isRefresh: true,
        payload: {}
    }
}

function getUsersDataSource(){
    return {
        valueName: "UserId",
        textName: "UserName",
        stateName: "getUsers",
        serviceName: "AdminUserService",
        actionName: "getUsers",
        isRefresh: true,
        payload: {}
    }
}