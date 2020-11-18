const entity = { name: 'ConditionType', primaryKey: 'ConditionTypeId' };

var dataActionTypes = {};

module.exports = function (actionTypes) {
    dataActionTypes = actionTypes;

    return {
      name: "conditionTypeForm",
      type: "View",
        eventActions: getEventActions(),
        properties: [getEditFormView()]
    }
}

function getEditFormView() {
  return {
    name: "editFormView",
    type: "View",
    isDiv: true,
    entity,
    eventActionName: "getUserConditionTypeByUser",
    getEntityDataActionType: dataActionTypes.getUserConditionTypeByUser,
    className: 'divConditionView',
    properties: [{
      name: "title",
      type: 'SpanText',
      isDiv: true,
      x: 1,
      y: 1,
      className: 'divTitle'
    },
    getEditView2()]
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
    name: "getUserConditionTypeByUser",
    type: "entityEdit/getEntityData",
    editView: "editFormView"
  }]
}