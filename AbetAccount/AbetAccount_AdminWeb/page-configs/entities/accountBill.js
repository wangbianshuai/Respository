module.exports = {
    name: "AccountBill",
    viewName: 'ViewAccountBill',
    primaryKey: "BillId",
    properties: getProperties(),
    accountItemsDataSource: getAccountItemsDataSource(),
    accountCategorysDataSource: getAccountCategorysDataSource(),
    usersDataSource:getUsersDataSource(),
    incomeOutlayDataSource:getIncomeOutlayDataSource()
}

function getProperties() {
    return [
        getProperty("BillId", "BillId"),
        getProperty("AccountCategoryName", "类别"),
        getProperty("AccountItemName", "实体项目"),
        getProperty("BillDate", "日期"),
        getProperty("Amount2", "金额"),
        getProperty("Tax2", "税额"),
        getProperty("BillYear", "年"),
        getProperty("BillMonth", "月"),
        getProperty("BillDay", "日"),
        getProperty("IncomeOutlayName", "收支"),
        getProperty("BillUserName", "经手人"),
        getProperty("CreateUserName", "记账人"),
        getProperty("Remark", "摘要"),
        getProperty("CreateDate", "记账时间")
    ]
}

function getIncomeOutlayDataSource() {
    return [{ value: 0, text: "支出" }, { value: 1, text: "收入" }]
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

function getAccountCategorysDataSource() {
    return {
        valueName: "CategoryId",
        textName: "Name",
        stateName: "getAccountCategorys",
        serviceName: "AccountCategoryService",
        actionName: "getAccountCategorys",
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