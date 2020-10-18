module.exports = {
    name: 'SendTemplateMessage',
    viewName: 'ViewSendTemplateMessage',
    primaryKey: 'SendTemplateMessageId',
    properties: getProperties(),
    statusDataSource: getStatusDataSource(),
    userTagDataSource: getUserTagDataSource(),
    weChatTemplateDataSource: getWeChatTemplateDataSource()
}

function getProperties() {
    return [
        getProperty('SendTemplateMessageId', 'SendTemplateMessageId'),
        getProperty('WeChatTemplateName', '微信消息模板'),
        getProperty('UserTagNames', '粉丝标签'),
        getProperty('StatusName', '状态'),
        getProperty('Color', '字体颜色'),
        getProperty('Remark', '备注'),
        getProperty('CreateDate', '创建时间')
    ]
}

function getProperty(name, label) { return { name, label } }

function getStatusDataSource() {
    return [{ value: 0, text: "未发送" }, { value: 1, text: "已发送" }]
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


function getWeChatTemplateDataSource() {
    return {
        valueName: "TemplateId",
        textName: "Title",
        stateName: "getWeChatTemplates",
        serviceName: "WeChatTemplateService",
        actionName: "getWeChatTemplates",
        isRefresh: true,
        payload: {}
    }
}
