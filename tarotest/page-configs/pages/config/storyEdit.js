// eslint-disable-next-line import/no-commonjs
const Story = require('../../entities/story');
// eslint-disable-next-line import/no-commonjs
const { assignProporties, getTextBox, getButton, getDatePicker } = require('../../Common');

//config/storyInput 600-699
const DataActionTypes = {
  //Get Entity Data
  getEntityData: 600,
  //Save Entity Data
  saveEntityData: 601,
  //Delete Entity Data
  deleteEntityData: 602,
}

const entity = { name: Story.name, primaryKey: Story.primaryKey };

// eslint-disable-next-line import/no-commonjs
module.exports = {
  name: "StoryEdit",
  type: "View",
  eventActions: getEventActions(),
  properties: assignProporties({ name: "StoryEdit" }, [geEditView()])
}

function geEditView() {
  return {
    name: "StoryEdit2",
    type: "View",
    entity,
    eventActionName: "getEntityData",
    isClear: true,
    saveEntityDataActionType: DataActionTypes.saveEntityData,
    getEntityDataActionType: DataActionTypes.getEntityData,
    properties: assignProporties(Story, getProperties())
  }
}


function getProperties() {
  return [
    getNavBar(),
    { ...getTextBox2("StoryId", "Story Id", 3, 1, "", "Please input story id", 10, false), dataType: "int" },

    { ...getTextArea("StoryTitle", "Story Title", 2, 1, 'Please input story title'), maxLength: 1000, isNullable: false },
    getTextBox2("StoryUrl", "Story url", 3, 1, "", "Please input story url", 200, false),
    getDatePicker2("StartDate", "Start Date", 4, 1, true, ""),
    getDatePicker2("EndDate", "End Date", 4, 1, true, ""),
    getTextArea("Remark", "Remark", 5, 1),
    { ...getButton("saveEntityData", "Save", "primary"), eventActionName: "saveEntityData", className: 'button1', visibleParamName: 'isEdit' },
    { type: 'SpanText', style: { height: '80px' } }
  ]
}

function getNavBar() {
  return {
    title: 'Add New Story',
    updateTitle: 'Update New Story',
    fixed: true,
    type: 'NavBar',
    name: 'NavBar1',
    rightFirstEventActionName: 'deleteStory',
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
    editView: "StoryEdit2",
  },
  {
    name: "getEntityData",
    type: "EntityEdit/getEntityData",
    editView: "StoryEdit2"
  },
  {
    name: "deleteStory",
    type: "EntityEdit/deleteEntityData",
    isSelfOperation: true,
    selfPropertyName: "CreateUser",
    dataActionType: DataActionTypes.deleteEntityData,
    successTip: "Delete Succeed!",
    confirmTip: "Please confirm whether to delete the current Story?"
  }]
}
