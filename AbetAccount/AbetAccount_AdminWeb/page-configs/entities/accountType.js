module.exports= {
    name: "AccountType",
    viewName: 'ViewAccountType',
    primaryKey: "TypeId",
    properties: getProperties()
}

function getProperties() {
    return [
        getProperty("TypeId", "TypeId"),
        getProperty("Name", "名称"),
        getProperty("IsHaveCustomerName", "是否关联客户"),
        getProperty("Remark", "备注"),
        getProperty("CreateDate", "创建时间")
    ]
}

function getProperty(name, label) {
    return { name, label }
}