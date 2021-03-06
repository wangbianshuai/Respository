//mine/index 200-299
const dataActionTypes = {
    getMatchmaker: 200
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
        entity: { name: 'Matchmaker', primaryKey: 'MatchmakerId', isGet: true },
        eventActionName: "getMatchmaker",
        getEntityDataActionType: dataActionTypes.getMatchmaker,
        properties: getProperties()
    }
}
function getProperties() {
    return [
        getUserInfoView(),
        getMatchmakerFeeListMenu(),
        getQrCodeListMenu(),
        getStatusListMenu(),
        getExitListMenu()
    ]
}

function getUserInfoView() {
    return {
        name: 'MatchmakerInfo',
        type: 'topUserInfo',
        detailUrl: '/mine/userInfo'
    }
}

function getEventActions() {
    return [{
        name: "getMatchmaker",
        type: "entityEdit/getEntityData",
        editView: "infoView"
    }]
}

function getMatchmakerFeeListMenu() {
    return {
        name: 'TotalFeeAmount',
        type: 'ListMenu',
        className: 'divListMenu',
        dataSource: [{ text: '红包总金额', arrow: 'horizontal', thumb: 'fee.png', url: '/mine/matchmakerFee' }]
    }
}

function getQrCodeListMenu() {
    return {
        name: 'MyQrCode',
        type: 'ListMenu',
        isValueParams: true,
        isShowValue: false,
        className: 'divListMenu',
        dataSource: [{ text: '我的二维码', arrow: 'horizontal', thumb: 'qrcode.png', url: '/mine/myqrcode' }]
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