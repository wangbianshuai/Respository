//mine/index 200-299
const dataActionTypes = {
    getUserInfo: 200
};


module.exports = {
    name: "index",
    type: "View",
    eventActions: getEventActions(),
    properties: getProperties()
}

function getProperties() {
    return [
        getUserInfoView()
    ]
}

function getUserInfoView() {
    return {
        name: "userInfoView",
        type: "View",
        isDiv: true,
        entity: { name: 'MarriageUser', primaryKey: 'UserId', isGet: true },
        eventActionName: "getUserInfo",
        getEntityDataActionType: dataActionTypes.getUserInfo,
        className: 'divUserInfo',
        properties: [getTopUserInfo()]
    }
}

function getTopUserInfo() {
    return {
        name: 'UserInfo',
        type: 'topUserInfo'
    }
}


function getEventActions() {
    return [{
        name: "getUserInfo",
        type: "entityEdit/getEntityData",
        editView: "userInfoView"
    }]
}