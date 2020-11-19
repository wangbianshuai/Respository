const { getTextBox } = require('../../common');

//marriage/appMatchmaker 2000-2099
const dataActionTypes = {
  //更新用户红娘
  getAppMatchmaker: 2000
};

const entity = { name: 'Matchmaker', primaryKey: 'MatchmakerId', isGet: true };

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
    eventActionName: "getAppMatchmaker",
    getEntityDataActionType: dataActionTypes.getAppMatchmaker,
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
    name: "getAppMatchmaker",
    type: "entityEdit/getEntityData",
    editView: "matchmakerEditEdit"
  }]
}