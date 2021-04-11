module.exports= {
    name: "AccountItem",
    viewName: 'ViewAccountItem',
    primaryKey: "ItemId",
    properties: getProperties()
}

function getProperties() {
    return [
        getProperty("ItemId", "ItemId"),
        getProperty("Name", "名称"),
        getProperty("Remark", "备注"),
        getProperty("CreateDate", "创建时间")
    ]
}

function getProperty(name, label) {
    return { name, label }
}