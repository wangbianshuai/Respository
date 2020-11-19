var dataActionTypes = {};

var pageType = '';
var userType = '';

module.exports = function (pageType2, actionTypes, userType2) {
    pageType = pageType2;
    userType = userType2;
    dataActionTypes = actionTypes;

    return {
        name: "index",
        type: "View",
        eventActions: getEventActions(),
        properties: [getInfoView()]
    }
}

function getInfoView() {
    return {
        name: "infoView",
        type: "View",
        entity: { name: 'MarriageUser', primaryKey: 'UserId', isGet: true },
        eventActionName: "getUserByUser",
        getEntityDataActionType: dataActionTypes.getUserByUser,
        properties: getProperties()
    }
}
function getProperties() {
    var properties = [
        getUserInfoView(),
        getPhotoListMenu(),
        getConditionTypeListMenu()
    ]

    if (userType === 1) {
        properties.push(getRoseListMenu());
        properties.push(getCancelRoseListMenu());
    }

    return properties;
}

function getRoseListMenu() {
    return {
        name: 'roseCountListMenu',
        type: 'RoseCountListMenu',
        className: 'divExitListMenu',
    }
}

function getCancelRoseListMenu() {
    return {
        name: 'cancelRoseListMenu',
        type: 'RoseCountListMenu',
        isCancel: true,
        className: 'divExitListMenu',
    }
}

function getUserInfoView() {
    return {
        name: 'UserInfo',
        type: 'topUserInfo2',
        isSquare: userType === 1,
        detailUrl: '/' + pageType + '/userInfo?userId=#{userId}'
    }
}

function getEventActions() {
    return [{
        name: "getUserByUser",
        type: "entityEdit/getEntityData",
        editView: "infoView"
    }]
}

function getPhotoListMenu() {
    return {
        name: 'UserPhoto',
        type: 'ListMenu',
        className: 'divListMenu',
        dataSource: [{ text: '生活照', arrow: 'horizontal', thumb: 'photo.png', url: '/' + pageType + '/userPhoto?userId=#{userId}' }]
    }
}


function getConditionTypeListMenu() {
    return {
        name: 'conditionTypes',
        type: 'ListMenu',
        className: 'divConditionListMenu',
        isRightArraw: true,
        url: '/' + pageType + '/conditionType?userId=#{userId}&ConditionTypeId=#{ConditionTypeId}&UserConditionTypeId=#{UserConditionTypeId}&title=' + encodeURIComponent('条件信息-') + '#{ConditionTypeName}',
        serviceDataSource: getConditionTypeDataSource()
    }
}

function getConditionTypeDataSource() {
    return {
        valueName: "Percentage",
        textName: "ConditionTypeName",
        stateName: "getUserConditionTypesByUser",
        serviceName: userType === 1 ? "MarriageSquareUserService" : 'MarriageArrangeUserService',
        actionName: "getUserConditionTypesByUser",
        isRefresh: true,
        getPayload: 'getUserConditionTypesPayload',
        payload: { SelectType: 1, Type: userType }
    }
}