// eslint-disable-next-line import/no-commonjs
const Daily = require('../../entities/Daily');
// eslint-disable-next-line import/no-commonjs
const { assignProporties, getTextBox, getButton, getSelect, getDatePicker } = require('../../Common');

//WorkReportManage/DailyEdit 1200-1299
const DataActionTypes = {
  //Get Entity Data
  getEntityData: 1200,
  //Save Entity Data
  saveEntityData: 1201,
  //Delete Entity Data
  deleteEntityData: 1202,
}

const entity = { name: Daily.name, primaryKey: Daily.primaryKey };

// eslint-disable-next-line import/no-commonjs
module.exports = {
  name: "DailyEdit",
  type: "View",
  eventActions: getEventActions(),
  properties: assignProporties({ name: "DailyEdit" }, [geEditView()])
}

function geEditView() {
  return {
    name: "DailyEdit2",
    type: "View",
    entity,
    eventActionName: "getEntityData",
    isClear: true,
    saveEntityDataActionType: DataActionTypes.saveEntityData,
    getEntityDataActionType: DataActionTypes.getEntityData,
    properties: assignProporties(Daily, getProperties())
  }
}


function getProperties() {
  return [
    getNavBar(),
    getEditSelect("StoryId", "Story", Daily.storyDataSource, 1, 1, true, ""),
    { ...getTextArea("Content", "Content", 2, 1, 'Please input content'), maxLength: 500, isNullable: false },
    { ...getTextBox2("HoursCount", "Hours", 3, 1, "", "Please input hours", 4, false), dataType: "int" },
    getDatePicker2("WorkingDate", "Working Date", 4, 1, false, "Please select a date"),
    getTextArea("Remark", "Remark", 5, 1),
    { ...getButton("saveEntityData", "Save", "primary"), eventActionName: "saveEntityData", className: 'button1', visibleParamName: 'isEdit' },
    { type: 'SpanText', style: { height: '80px' } }
  ]
}

function getNavBar() {
  return {
    title: 'Add New Daily',
    updateTitle: 'Update New Daily',
    fixed: true,
    type: 'NavBar',
    name: 'NavBar1',
    rightFirstEventActionName: 'deleteDaily',
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
    isCurrentDay: true,
    type: 'FormItem',
    controlType: 'DatePicker',
    viewClassName: 'formItem',
    labelClassName: "label",
  }
}

function getEditSelect(name, label, dataSource, x, y, isNullable, placeholder, defaultValue) {
  return {
    ...getSelect(name, label, null, x, y, defaultValue),
    isNullable,
    isEdit: true,
    allowClear: true, isSearch: true,
    serviceDataSource: dataSource,
    placeholder,
    type: 'FormItem',
    controlType: 'Select',
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
    editView: "DailyEdit2",
  },
  {
    name: "getEntityData",
    type: "EntityEdit/getEntityData",
    editView: "DailyEdit2"
  },
  {
    name: "deleteDaily",
    type: "EntityEdit/deleteEntityData",
    isSelfOperation: true,
    selfPropertyName: "CreateUser",
    dataActionType: DataActionTypes.deleteEntityData,
    successTip: "Delete Succeed!",
    confirmTip: "Please confirm whether to delete the current Daily?"
  }]
}
