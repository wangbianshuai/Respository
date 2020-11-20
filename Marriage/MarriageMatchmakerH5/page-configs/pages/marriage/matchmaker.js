const { getTextBox } = require('../../common');

//marriage/matchmaker 1500-1599
const dataActionTypes = {
    //get entity data
    getEntityData: 1500,
    //Save entity data
    saveEntityData: 1501,
    //获取用户红娘
    getMatchmakerById: 1502
};

const entity = { name: 'Matchmaker', primaryKey: 'matchmakerId' };

module.exports = {
    name: "matchmakerEdit",
    type: "View",
    entity,
    eventActions: getEventActions(),
    properties: [matchmakerEditView()]
}

function matchmakerEditView() {
    return {
        name: "editView",
        type: "View",
        isDiv: true,
        className: 'divRegister',
        properties: [matchmakerEditView2()]
    }
}

function matchmakerEditView2() {
    return {
        name: "matchmakerEditEdit",
        type: "View",
        entity,
        isList: true,
        eventActionName: "getMatchmakerById",
        getEntityDataActionType: dataActionTypes.getMatchmakerById,
        className: 'divDetail',
        properties: getProperties()
    }
}

function getProperties() {
    return [
        {
            name: 'MatchmakerInfo',
            type: 'topUserInfo'
        },
        {
            name: 'whiteSpace16',
            type: 'WhiteSpace',
            className: 'whiteSpace16'
        },
        getTextBox2('Name', '姓名', '', 1, 1, '', 20,),
        getTextBox2('Province', '省份', '', 1, 1, '', 20),
        getTextBox2('City', '城市', '', 1, 1, '', 20),
        getTextBox2('Address', '家庭地址', '', 1, 1, '', 100),
        getTextBox2('Features', '特点', 'textarea', 1, 1, '', 500)
    ]
}

function getTextBox2(name, label, controlType, x, y, placeHorder, maxLength) {
    return { ...getTextBox(name, label, controlType, x, y, placeHorder, maxLength), isReadOnly: true, style: { color: '#108ee9' }, isNullable: true }
}

function getEventActions() {
    return [{
        name: "getMatchmakerById",
        type: "entityEdit/getEntityData",
        editView: "matchmakerEditEdit"
    }]
}