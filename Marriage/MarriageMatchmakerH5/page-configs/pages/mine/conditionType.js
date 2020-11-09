const { getButton } = require('../../common');

//mine/conditionType 800-899
const dataActionTypes = {
  //get entity data
  getEntityData: 800,
  //Save entity data
  saveEntityData: 801,
  //get entity data
  getUserConditionType: 802,
  //Save entity data
  saveUserConditionType: 803
};

const entity = { name: 'ConditionType', primaryKey: 'ConditionTypeId' };

module.exports = {
  name: "conditionTypeForm",
  type: "View",
  eventActions: getEventActions(),
  properties: [getEditFormView()]
}

function getEditFormView() {
  return {
    name: "editFormView",
    type: "View",
    isDiv: true,
    entity,
    eventActionName: "getUserConditionType",
    getEntityDataActionType: dataActionTypes.getUserConditionType,
    className: 'divConditionView',
    properties: [{
      name: "title",
      type: 'SpanText',
      isDiv: true,
      x: 1,
      y: 1,
      className: 'divTitle'
    },
    getEditView2(),
    {
      name: 'IsPublic',
      label: '信息是否公开',
      type: 'Switch',
      isEdit: true,
      defaultValue: 0
    },
    getButtonView()]
  }
}

function getButtonView() {
  return {
    name: 'buttonView',
    type: 'RowsColsView',
    isDiv: true,
    entity,
    className: "divButtonView",
    properties: [
      { ...getButton('save', '保存', 'primary', 1, 1), saveEntityDataActionType: dataActionTypes.saveUserConditionType, className: 'button', eventActionName: 'saveUserConditionType', rowClassName: "divRow4" },
    ]
  }
}

function getEditView2() {
  return {
    name: "Items",
    type: "conditionTypeFormPage",
    isList: true,
    isEdit: true,
    entity: entity,
    selectType: 1,
    className: 'divConditionType',
    properties: []
  }
}

function getEventActions() {
  return [{
    name: "getUserConditionType",
    type: "entityEdit/getEntityData",
    editView: "editFormView"
  },
  {
    name: "saveUserConditionType",
    type: "entityEdit/saveEntityData",
    editView: "editFormView"
  }]
}