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
        getMatchmakerListMenu(),
        getStatusListMenu(),
        getExitListMenu()
    ]
}

function getUserInfoView() {
    return {
        name: 'UserInfo',
        type: 'topUserInfo',
        detailUrl: '/mine/userInfo'
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
        dataSource: [{ text: '生活照', arrow: 'horizontal', thumb: 'photo.png', url: '/mine/userPhoto' }]
    }
}

function getMatchmakerListMenu() {
    return {
        name: 'Matchmarker',
        type: 'ListMenu',
        className: 'divListMenu',
        dataSource: [{ text: '专属红娘', arrow: 'horizontal', thumb: 'matchmaker.png', url: '/mine/matchmaker' }]
    }
}

function getSelectLoverListMenu() {
    return {
        name: 'SelectLover',
        type: 'ListMenu',
        className: 'divListMenu',
        dataSource: [{ text: '择偶标准', arrow: 'horizontal', thumb: 'select_lover.png', url: '/mine/selectLover' }]
    }
}

function getExitListMenu() {
    return {
        name: 'exitListMenu',
        type: 'ExitListMenu',
        className: 'divExitListMenu',
    }
}

function getStatusListMenu() {
    return {
        name: 'StatusInfo',
        type: 'StatusListMenu',
        className: 'divListMenu',
    }
}

function getConditionTypeListMenu() {
    return {
        name: 'conditionTypes',
        type: 'ListMenu',
        className: 'divConditionListMenu',
        isRightArraw: true,
        url: '/mine/conditionType?ConditionTypeId=#{ConditionTypeId}&UserConditionTypeId=#{UserConditionTypeId}&title='+ encodeURIComponent('条件信息-')+'#{ConditionTypeName}',
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
        payload: { SelectType: 1 }
    }
}