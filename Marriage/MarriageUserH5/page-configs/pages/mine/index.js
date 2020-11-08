//mine/index 200-299
const dataActionTypes = {
    getUser: 200
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
        eventActionName: "getUser",
        getEntityDataActionType: dataActionTypes.getUser,
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
        name: "getUser",
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
        dataSource: [{ text: '择偶标准', arrow: 'horizontal', thumb: 'select_lover.png', url: '/mine/conditionSelectValue' }]
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
        url: '/mine/conditiontype?conditionType=#{ConditionTypeId}&userCoditionType=#{UserConditionTypeId}',
        serviceDataSource: getConditionTypeDataSource()
    }
}

function getConditionTypeDataSource() {
    return {
        valueName: "Percentage",
        textName: "ConditionTypeName",
        stateName: "getUserConditionTypes",
        serviceName: "MarriageUserService",
        actionName: "getUserConditionTypes",
        isRefresh: true,
        payload: { SelectType: 1 }
    }
}