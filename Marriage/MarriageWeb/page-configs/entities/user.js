module.exports = {
    name: 'User',
    viewName: 'ViewUser',
    primaryKey: 'OpenId',
    properties: getProperties(),
    sexDataSource: getSexDataSource(),
    userTagDataSource: getUserTagDataSource(),
}

function getProperties() {
    return [
        getProperty('OpenId', 'OpenId'),
        getProperty('UnionId', 'UnionID'),
        getProperty('NickName', '昵称'),
        getProperty('SexName', '性别'),
        getProperty('City', '城市'),
        getProperty('Province', '省份'),
        getProperty('HeadImgUrl', '头像'),
        getProperty('UserTagNames', '标签集合'),
        getProperty('Remark', '备注'),
        getProperty('UpdateDate', '更新时间')
    ]
}

function getProperty(name, label) { return { name, label } }

function getSexDataSource() {
    return [{ value: 1, text: "男" }, { value: 2, text: "女" }, { value: 0, text: "未知" }]
}

function getUserTagDataSource() {
    return {
        valueName: "UserTagId",
        textName: "Name",
        stateName: "getUserTags",
        serviceName: "UserTagService",
        actionName: "getUserTags",
        isRefresh: true,
        payload: {}
    }
}
