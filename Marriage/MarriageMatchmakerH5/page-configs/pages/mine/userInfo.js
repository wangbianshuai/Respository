const { getTextBox, getButton } = require('../../common');

//index 400-199
const dataActionTypes = {
  //get entity data
  getEntityData: 400,
  //Save entity data
  saveEntityData: 401,
  //更新用户信息
  updateMatchmakerInfo: 402
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
    eventActionName: "getEntityData",
    getEntityDataActionType: dataActionTypes.getEntityData,
    className: 'divDetail',
    properties: getProperties()
  }
}

function getProperties() {
  return [
    {
      name: "title",
      type: 'SpanText',
      isDiv: true,
      x: 1,
      y: 1,
      className: 'divTitle',
      label: "基本信息"
    },
    {
      name: 'HeadImgUrl',
      label: '头像',
      type: 'UploadImage',
      pathName: 'CollaborationImages',
      className: 'divUpdateImage',
      isListItem: true,
      isEdit: true,
      isNullable: false,
      width: 100,
      height: 100,
      maxSize: 100,
      nullTipMessage: "请选择图片",
      x: 2,
      y: 1
    },
    getTextBox2('NickName', '昵称', '', 1, 1, '请输入昵称', 20, false),
    getTextBox2('Name', '姓名', '', 1, 1, '请输入姓名', 20, false),
    { ...getTextBox2('IdCard', '身份证号', '', 1, 1, '请输入身份证号', 20, false), validateNames: ['validateIdentityCard'] },
    { ...getTextBox2('Phone', '手机号码', '', 1, 1, '请输入手机号码', 20, false), validateNames: ['validateMobile'] },
    getTextBox2('Province', '省份', '', 1, 1, '省份', 20, true),
    getTextBox2('City', '城市', '', 1, 1, '城市', 20, true),
    getTextBox2('Address', '家庭地址', '', 1, 1, '请输入家庭地址', 100, false),
    getTextBox2('Features', '特点', 'textarea', 1, 1, '特点说明', 500, true),
    getButtonView()
  ]
}

function getButtonView() {
  return {
    name: 'buttonView',
    type: 'RowsColsView',
    isDiv: true,
    entity,
    className: "divButtonView",
    properties: [
      { ...getButton('save', '保存', 'primary', 1, 1), saveEntityDataActionType: dataActionTypes.updateMatchmakerInfo, className: 'button', eventActionName: 'updateMatchmakerInfo', rowClassName: "divRow4" },
    ]
  }
}

function getTextBox2(name, label, controlType, x, y, placeHorder, maxLength, isNullable) {
  return { ...getTextBox(name, label, controlType, x, y, placeHorder, maxLength), isEdit: true, clear: true, isNullable, isRed: !isNullable }
}

function getEventActions() {
  return [{
    name: "updateMatchmakerInfo",
    type: "entityEdit/saveEntityData",
    editView: "matchmakerEditEdit"
  },
  {
    name: "getEntityData",
    type: "entityEdit/getEntityData",
    editView: "matchmakerEditEdit"
  }]
}