//boygirl/conditionType 1100-1199
const dataActionTypes = {
  //get entity data
  getEntityData: 1100,
  //Save entity data
  saveEntityData: 1101,
  //get entity data
  getUserConditionTypeByMatchmaker: 1102
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
    eventActionName: "getUserConditionTypeByMatchmaker",
    getEntityDataActionType: dataActionTypes.getUserConditionTypeByMatchmaker,
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
      isReadOnly: true,
      defaultValue: 0
    }]
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
    name: "getUserConditionTypeByMatchmaker",
    type: "entityEdit/getEntityData",
    editView: "editFormView"
  }]
}