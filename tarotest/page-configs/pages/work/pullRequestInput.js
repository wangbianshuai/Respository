// eslint-disable-next-line import/no-commonjs
const PullRequest = require('../../entities/pullRequest');
// eslint-disable-next-line import/no-commonjs
const { assignProporties, getTextBox, getButton, getSelect, getDatePicker } = require('../../Common');

//work/pullRequestInput 1000-1099
const DataActionTypes = {
  //Get Entity Data
  getEntityData: 1000,
  //Save Entity Data
  saveEntityData: 1001,
  //Delete Entity Data
  deleteEntityData: 1002,
}

const entity = { name: PullRequest.name, primaryKey: PullRequest.primaryKey };

// eslint-disable-next-line import/no-commonjs
module.exports = {
  name: "PullRequestEdit",
  type: "View",
  eventActions: getEventActions(),
  properties: assignProporties({ name: "PullRequestEdit" }, [geEditView()])
}

function geEditView() {
  return {
    name: "PullRequestEdit2",
    type: "View",
    entity,
    eventActionName: "getEntityData",
    isClear: true,
    saveEntityDataActionType: DataActionTypes.saveEntityData,
    getEntityDataActionType: DataActionTypes.getEntityData,
    properties: assignProporties(PullRequest, getProperties())
  }
}


function getProperties() {
  return [
    getNavBar(),
    getEditSelect("StoryId", "Story", PullRequest.storyDataSource, 1, 1, false, ""),
    { ...getTextArea("PullRequestTitle", "Pull Request Title", 2, 1, 'Please input pull request title'), maxLength: 500, isNullable: false },
    getTextBox2("PullRequestUrl", "PullRequest Url", 3, 1, "", "Please input pull request url", 200, false),
    { ...getTextBox2("TestCases", "Test Cases", 3, 1, "", "Please input test cases", 10, false), dataType: "int" },
    { ...getTextBox2("Comments", "Comments", 3, 1, "", "Please input comments", 10, false), dataType: "int" },
    getDatePicker2("StartDate", "Start Date", 4, 1, true, ""),
    getDatePicker2("EndDate", "End Date", 4, 1, true, ""),
    getTextArea("Remark", "Remark", 5, 1),
    { ...getButton("saveEntityData", "Save", "primary"), eventActionName: "saveEntityData", className: 'button1', visibleParamName: 'isEdit' },
    { type: 'SpanText', style: { height: '80px' } }
  ]
}

function getNavBar() {
  return {
    title: 'Add New Pull Request',
    updateTitle: 'Update New Pull Request',
    fixed: true,
    type: 'NavBar',
    name: 'NavBar1',
    rightFirstEventActionName: 'deletePullRequest',
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
    editView: "PullRequestEdit2",
  },
  {
    name: "getEntityData",
    type: "EntityEdit/getEntityData",
    editView: "PullRequestEdit2"
  },
  {
    name: "deletePullRequest",
    type: "EntityEdit/deleteEntityData",
    isSelfOperation: true,
    selfPropertyName: "CreateUser",
    dataActionType: DataActionTypes.deleteEntityData,
    successTip: "Delete Succeed!",
    confirmTip: "Please confirm whether to delete the current Pull Request?"
  }]
}
