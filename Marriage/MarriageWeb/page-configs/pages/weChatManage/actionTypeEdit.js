const actionType = require("../../entities/actionType");
const { assignProporties, getTextBox, getButton } = require("../../Common");

//weChatManage/actionTypeEdit 1000-1099
const dataActionTypes = {
  //get entity data
  getEntityData: 1000,
  //Save entity data
  saveEntityData: 1001
}

const { name, primaryKey } = actionType;
const entity = { name, primaryKey };


module.exports = {
  name: "actionTypeEdit",
  type: "View",
  eventActions: getEventActions(),
  properties: assignProporties({ name: "actionTypeEdit" }, [getEditView()])
}

function getEditView() {
  return {
    name: "actionTypeEdit2",
    type: "RowsColsView",
    entity: entity,
    isForm: true,
    eventActionName: "getEntityData",
    isClear: true,
    saveEntityDataActionType: dataActionTypes.saveEntityData,
    getEntityDataActionType: dataActionTypes.getEntityData,
    properties: assignProporties(actionType, getProperties())
  }
}

function getButtonProperties() {
  return [{
    name: "leftSpace1",
    type: "WhiteSpace",
    className: "ant-col ant-col-8 ant-form-item-label"
  },
  { ...getButton("saveEntityData", "保存", "primary"), eventActionName: "saveEntityData", style: { width: 84 } },
  { ...getButton("backToLast", "返回", ""), eventActionName: "backToLast", style: { marginLeft: 10 } }]
}

function getProperties() {
  return [
    getTextBox2("Name", "名称", 1, 1, "", "请输入名称", 50, false),
    getTextBox2("ActionKey", "行为KEY值", 2, 1, "", "请输入行为KEY值", 50, false),
    getTextArea("Remark", "备注", 3, 1),
    getButtonView()
  ]
}
function getTextBox2(name, label, x, y, contorlType, placeHolder, maxLength, isNullable, isVisible, validateNames, validateTipMessage) {
  return {
    ...getTextBox(name, label, contorlType, x, y, placeHolder, maxLength || 50),
    validateNames, validateTipMessage,
    isFormItem: true,
    colSpan: 24,
    labelCol: 8,
    wrapperCol: 8,
    isNullable,
    isVisible,
    isEdit: true
  }
}

function getButtonView() {
  return {
    name: "buttonView",
    type: "View",
    className: "divCenterButton",
    isDiv: true,
    isFormItem: true,
    colSpan: 24,
    x: 5,
    y: 1,
    properties: assignProporties({ name: "actionTypeEdit" }, getButtonProperties())
  }
}

function getTextArea(name, label, x, y, placeHolder) {
  return {
    ...getTextBox(name, label, "TextArea", x, y),
    isFormItem: true,
    isNullable: true,
    isEdit: true,
    colSpan: 24,
    Rows: 3,
    placeHolder,
    labelCol: 8,
    wrapperCol: 8
  }
}

function getEventActions() {
  return [{
    name: "backToLast",
    type: "page/toPage",
    pageUrl: "/weChatManage/actionTypeList",
    expandSetPageUrl: "expandSetPageUrl"
  },
  {
    name: "saveEntityData",
    type: "entityEdit/saveEntityData",
    editView: "actionTypeEdit2",
    expandSetEntityData: "expandSetEntityData"
  },
  {
    name: "getEntityData",
    type: "entityEdit/getEntityData",
    editView: "actionTypeEdit2"
  }]
}