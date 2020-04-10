// eslint-disable-next-line import/no-commonjs
const User = require('../../entities/user');
// eslint-disable-next-line import/no-commonjs
const { assignProporties, getTextBox, getButton } = require('../../Common');

//config/userInput 4400-4499
const DataActionTypes = {
  //Get Entity Data
  getEntityData: 4400,
  //Save Entity Data
  saveEntityData: 4401,
  //Delete Entity Data
  deleteEntityData: 4402,
}

const entity = { name: User.name, primaryKey: User.primaryKey };

// eslint-disable-next-line import/no-commonjs
module.exports = {
  name: "UserEdit",
  type: "View",
  eventActions: getEventActions(),
  properties: assignProporties({ name: "UserEdit" }, [geEditView()])
}

function geEditView() {
  return {
    name: "UserEdit2",
    type: "View",
    entity,
    eventActionName: "getEntityData",
    isClear: true,
    saveEntityDataActionType: DataActionTypes.saveEntityData,
    getEntityDataActionType: DataActionTypes.getEntityData,
    properties: assignProporties(User, getProperties())
  }
}


function getProperties() {
  return [
    getNavBar(),
    getTextBox2("LoginName", "Login Name", 3, 1, "", "Please input login name", 50, false),
    getTextBox2("UserName", "User Name", 3, 1, "", "Please input user name", 50, false),
    { ...getTextBox2("LoginPassword", "Login Password", 3, 1, "", "Please input loign password", 50, false), isJudgeNullable: false, inputType: "password" },
    { ...getTextBox2("LoginAgainPassword", "Login Again Password", 4, 1, "", "Please input loign again password", 50, false), isJudgeNullable: false, inputType: "password" },
    { ...getButton("saveEntityData", "Save", "primary"), eventActionName: "saveEntityData", className: 'button1', visibleParamName: 'isEdit' },
    { type: 'SpanText', style: { height: '80px' } }
  ]
}

function getNavBar() {
  return {
    title: 'Add New User',
    updateTitle: 'Update New User',
    fixed: true,
    type: 'NavBar',
    name: 'NavBar1',
    rightFirstEventActionName: 'deleteUser',
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
function getEventActions() {
  return [{
    name: "saveEntityData",
    type: "EntityEdit/saveEntityData",
    editView: "UserEdit2",
    expandSetEntityData: 'expandSetEntityData',
  },
  {
    name: "getEntityData",
    type: "EntityEdit/getEntityData",
    editView: "UserEdit2"
  },
  {
    name: "deleteUser",
    type: "EntityEdit/deleteEntityData",
    isSelfOperation: true,
    selfPropertyName: "CreateUser",
    dataActionType: DataActionTypes.deleteEntityData,
    successTip: "Delete Succeed!",
    confirmTip: "Please confirm whether to delete the current User?"
  }]
}
