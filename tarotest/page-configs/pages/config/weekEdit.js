// eslint-disable-next-line import/no-commonjs
const Week = require('../../entities/week');
// eslint-disable-next-line import/no-commonjs
const { assignProporties, getTextBox, getButton, getDatePicker } = require('../../Common');

//config/weekInput 400-499
const DataActionTypes = {
  //Get Entity Data
  getEntityData: 400,
  //Save Entity Data
  saveEntityData: 401,
  //Delete Entity Data
  deleteEntityData: 402,
}

const entity = { name: Week.name, primaryKey: Week.primaryKey };

// eslint-disable-next-line import/no-commonjs
module.exports = {
  name: "WeekEdit",
  type: "View",
  eventActions: getEventActions(),
  properties: assignProporties({ name: "WeekEdit" }, [geEditView()])
}

function geEditView() {
  return {
    name: "WeekEdit2",
    type: "View",
    entity,
    eventActionName: "getEntityData",
    isClear: true,
    saveEntityDataActionType: DataActionTypes.saveEntityData,
    getEntityDataActionType: DataActionTypes.getEntityData,
    properties: assignProporties(Week, getProperties())
  }
}


function getProperties() {
  return [
    getNavBar(),
    getDatePicker2("StartDate", "Start Date", 1, 1, false, "Please select a date"),
    getDatePicker2("EndDate", "End Date", 2, 1, false, "Please select a date"),
    { ...getTextBox2("WorkingHours", "Working Hours", 3, 1, "", "Please input working hours", 2, false), DataType: "int" },
    getTextArea("Remark", "Remark", 5, 1),
    { ...getButton("saveEntityData", "Save", "primary"), eventActionName: "saveEntityData", className: 'button1', visibleParamName: 'isEdit' },
    { type: 'SpanText', style: { height: '80px' } }
  ]
}

function getNavBar() {
  return {
    title: 'Add New Week',
    updateTitle: 'Update New Week',
    fixed: true,
    type: 'NavBar',
    name: 'NavBar1',
    rightFirstEventActionName: 'deleteWeek',
  };
}

function getTextBox2(name, label, x, y, controlType, placeholder, maxLength, isNullable, isVisible, validateNames, validateTipMessage) {
  return {
    ...getTextBox(name, label, controlType, x, y, placeholder, maxLength || 50),
    validateNames, validateTipMessage,
    isNullable,
    isVisible,
    type: 'FormItem',
    controlType: 'TextBox',
    viewClassName: 'formItem',
    labelClassName: "label",
    isEdit: true
  }
}

function getDatePicker2(name, label, x, y, isNullable, placeholder, defaultValue) {
  return {
    ...getDatePicker(name, label, x, y, defaultValue),
    isNullable: isNullable,
    placeholder: placeholder,
    isEdit: true,
    type: 'FormItem',
    controlType: 'DatePicker',
    viewClassName: 'formItem',
    labelClassName: "label",
  }
}

function getTextArea(name, label, x, y, placeHolder) {
  return {
    ...getTextBox(name, label, "TextArea", x, y),
    isNullable: true,
    isEdit: true,
    placeHolder,
    maxLength: 200,
    type: 'FormItem',
    controlType: 'TextArea',
    viewClassName: 'formItem',
    labelClassName: "label",
  }
}

function getEventActions() {
  return [{
    name: "saveEntityData",
    type: "EntityEdit/saveEntityData",
    editView: "WeekEdit2",
  },
  {
    name: "getEntityData",
    type: "EntityEdit/getEntityData",
    editView: "WeekEdit2"
  },
  {
    name: "deleteWeek",
    type: "EntityEdit/deleteEntityData",
    isSelfOperation: true,
    selfPropertyName: "CreateUser",
    dataActionType: DataActionTypes.deleteEntityData,
    successTip: "Delete Succeed!",
    confirmTip: "Please confirm whether to delete the current Week?"
  }]
}
