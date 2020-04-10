// eslint-disable-next-line import/no-commonjs
const WorkingHours = require('../../entities/workingHours');
// eslint-disable-next-line import/no-commonjs
const { assignProporties, getTextBox, getButton, getSelect } = require('../../Common');

//work/workingHoursInput 800-899
const DataActionTypes = {
  //Get Entity Data
  getEntityData: 800,
  //Save Entity Data
  saveEntityData: 801,
  //Delete Entity Data
  deleteEntityData: 802,
}

const entity = { name: WorkingHours.name, primaryKey: WorkingHours.primaryKey };

// eslint-disable-next-line import/no-commonjs
module.exports = {
  name: "WorkingHoursEdit",
  type: "View",
  eventActions: getEventActions(),
  properties: assignProporties({ name: "WorkingHoursEdit" }, [geEditView()])
}

function geEditView() {
  return {
    name: "WorkingHoursEdit2",
    type: "View",
    entity,
    eventActionName: "getEntityData",
    isClear: true,
    saveEntityDataActionType: DataActionTypes.saveEntityData,
    getEntityDataActionType: DataActionTypes.getEntityData,
    properties: assignProporties(WorkingHours, getProperties())
  }
}


function getProperties() {
  return [
    getNavBar(),
    getEditSelect("WeekId", "Week", WorkingHours.weekDataSource, 1, 1, false, "Please select week"),
    getEditSelect("StoryId", "Story", WorkingHours.storyDataSource, 1, 1, true, "Please select story or input content"),
    { ...getTextArea("Content", "Content", 2, 1, 'Please select story or input content'), maxLength: 500 },
    { ...getTextBox2("HourCount", "Working Hours", 3, 1, "", "Please input working hours", 4, false), dataType: "int" },
    getTextArea("Remark", "Remark", 5, 1),
    { ...getButton("saveEntityData", "Save", "primary"), eventActionName: "saveEntityData", className: 'button1', visibleParamName: 'isEdit' },
    { type: 'SpanText', style: { height: '80px' } }
  ]
}

function getNavBar() {
  return {
    title: 'Add New Working Hours',
    updateTitle: 'Update New Working Hours',
    fixed: true,
    type: 'NavBar',
    name: 'NavBar1',
    rightFirstEventActionName: 'deleteWorkingHours',
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
    editView: "WorkingHoursEdit2",
    expandSetEntityData: "expandSetEntityData",
  },
  {
    name: "getEntityData",
    type: "EntityEdit/getEntityData",
    editView: "WorkingHoursEdit2"
  },
  {
    name: "deleteWorkingHours",
    type: "EntityEdit/deleteEntityData",
    isSelfOperation: true,
    selfPropertyName: "CreateUser",
    dataActionType: DataActionTypes.deleteEntityData,
    successTip: "Delete Succeed!",
    confirmTip: "Please confirm whether to delete the current Working Hours?"
  }]
}
