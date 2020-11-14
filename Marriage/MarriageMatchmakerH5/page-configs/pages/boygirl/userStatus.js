const { getTextBox, getSelect, getButton } = require('../../common');

//detail/userStatus 1200-1299
const dataActionTypes = {
  //get entity data
  getEntityData: 1200,
  //Save entity data
  saveEntityData: 1201,
  //getUserStatusByMatchmaker,
  getUserStatusByMatchmaker: 1202,
  // updateUserStatusByMatchmaker
  updateUserStatusByMatchmaker: 1203
};

const entity = { name: 'MarriageUser', primaryKey: 'userId' };

module.exports = {
  name: "marriageUserEdit",
  type: "View",
  entity,
  eventActions: getEventActions(),
  properties: [marriageUserEditView()]
}

function marriageUserEditView() {
  return {
    name: "editView",
    type: "View",
    isDiv: true,
    className: 'divRegister',
    properties: [marriageUserEditView2()]
  }
}

function marriageUserEditView2() {
  return {
    name: "marriageUserEditEdit",
    type: "View",
    entity,
    isList: true,
    eventActionName: "getUserStatusByMatchmaker",
    getEntityDataActionType: dataActionTypes.getUserStatusByMatchmaker,
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
      label: "审核状态"
    },
    getSelectPicker('Status', '状态', getStatusDataSource(), 6, 1, false),
    getTextBox2('NoPassReason', '不通过原因', 'textarea', 1, 1, '当选择审核不通过时，需填不通过原因', 500, true),
    getButtonView()
  ]
}

function getTextBox2(name, label, controlType, x, y, placeHorder, maxLength, isNullable) {
  return { ...getTextBox(name, label, controlType, x, y, placeHorder, maxLength), isEdit: true, isVisible: false, clear: true, isNullable, isRed: !isNullable }
}

function getSelectPicker(name, label, dataSource, x, y, isNullable) {
  return { ...getSelect(name, label, dataSource, x, y), isEdit: true, isNullable, isRed: !isNullable }
}

function getButtonView() {
  return {
    name: 'buttonView',
    type: 'RowsColsView',
    isDiv: true,
    entity,
    className: "divButtonView",
    properties: [
      { ...getButton('save', '确定', 'primary', 1, 1), saveEntityDataActionType: dataActionTypes.updateUserStatusByMatchmaker, className: 'button', eventActionName: 'updateUserStatusByMatchmaker', rowClassName: "divRow4" },
    ]
  }
}

function getEventActions() {
  return [{
    name: "updateUserStatusByMatchmaker",
    type: "entityEdit/saveEntityData",
    editView: "marriageUserEditEdit"
  },
  {
    name: "getUserStatusByMatchmaker",
    type: "entityEdit/getEntityData",
    editView: "marriageUserEditEdit"
  }]
}

function getItem(value, text) { return { value, text } }

function getStatusDataSource() {
  return [
    getItem(0, '待审核'),
    getItem(1, '审核通过'),
    getItem(2, '审核不通过')
  ]
}