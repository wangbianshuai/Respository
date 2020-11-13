//boygirl/detail 600-699
const dataActionTypes = {
    getUserByMatchmaker: 600
};

module.exports = {
    name: "index",
    type: "View",
    eventActions: getEventActions(),
    properties: [getInfoView()]
}

function getInfoView() {
    return {
        name: "infoView",
        type: "View",
        entity: { name: 'MarriageUser', primaryKey: 'UserId', isGet: true },
        eventActionName: "getUserByMatchmaker",
        getEntityDataActionType: dataActionTypes.getUserByMatchmaker,
        properties: getProperties()
    }
}
function getProperties() {
    return [
        getUserInfoView(),
        getPhotoListMenu(),
        getConditionTypeListMenu(),
        getSelectLoverListMenu(),
        getStatusListMenu(),
    ]
}

function getUserInfoView() {
    return {
        name: 'UserInfo',
        type: 'topUserInfo',
        detailUrl: '/boygirl/userInfo?userId=#{userId}'
    }
}

function getEventActions() {
    return [{
        name: "getUserByMatchmaker",
        type: "entityEdit/getEntityData",
        editView: "infoView"
    }]
}

function getPhotoListMenu() {
    return {
        name: 'UserPhoto',
        type: 'ListMenu',
        className: 'divListMenu',
        dataSource: [{ text: '生活照', arrow: 'horizontal', thumb: 'photo.png', url: '/boygirl/userPhoto?userId=#{userId}' }]
    }
}

function getSelectLoverListMenu() {
    return {
        name: 'SelectLover',
        type: 'ListMenu',
        className: 'divListMenu',
        dataSource: [{ text: '择偶标准', arrow: 'horizontal', thumb: 'select_lover.png', url: '/boygirl/selectLover?userId=#{userId}' }]
    }
}

function getStatusListMenu() {
    return {
        name: 'StatusInfo',
        type: 'StatusListMenu',
        arrow: 'horizontal',
        isMenu: true,
        url: '/boygirl/userStatus?userId=#{userId}',
        className: 'divListMenu',
    }
}

function getConditionTypeListMenu() {
    return {
        name: 'conditionTypes',
        type: 'ListMenu',
        className: 'divConditionListMenu',
        isRightArraw: true,
        url: '/boygirl/conditionType?userId=#{userId}&ConditionTypeId=#{ConditionTypeId}&UserConditionTypeId=#{UserConditionTypeId}&title=' + encodeURIComponent('条件信息-') + '#{ConditionTypeName}',
        serviceDataSource: getConditionTypeDataSource()
    }
}

function getConditionTypeDataSource() {
    return {
        valueName: "Percentage",
        textName: "ConditionTypeName",
        stateName: "getUserConditionTypesByMatchmaker",
        serviceName: "MarriageUserService",
        actionName: "getUserConditionTypesByMatchmaker",
        isRefresh: true,
        getPayload: 'getUserConditionTypesPayload',
        payload: { SelectType: 1, }
    }
}