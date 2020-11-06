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
        getUserInfoView(),
        getPhotoListMenu(),
        getMatchmakerListMenu(),
        getExitListMenu()
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

function getPhotoListMenu() {
    return {
        name: 'UserPhoto',
        type: 'ListMenu',
        className: 'divListMenu',
        dataSource: [{ text: '生活照', arrow: 'horizontal', thumb: 'photo.png', url: 'mine/userPhoto' }]
    }
}

function getMatchmakerListMenu(){
    return {
        name: 'Matchmarker',
        type: 'ListMenu',
        className: 'divListMenu',
        dataSource: [{ text: '专属红娘', arrow: 'horizontal', thumb: 'matchmaker.png', url: 'mine/matchmaker' }]
    }
}

function getExitListMenu(){
    return {
        name: 'exitListMenu',
        type: 'ExitListMenu',
        className: 'divExitListMenu',
    }
}