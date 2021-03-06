const dictionaryConfig = require("../../entities/dictionaryConfig");
const { assignProporties, getTextBox, getButton } = require("../../Common");

//systemManage/dictionaryConfigEdit 700-799
const dataActionTypes = {
  //get entity data
  getEntityData: 700,
  //Save entity data
  saveEntityData: 701
}

const { name, primaryKey } = dictionaryConfig;
const entity = { name, primaryKey };


module.exports = {
  name: "dictionaryConfigEdit",
  type: "View",
  eventActions: getEventActions(),
  properties: assignProporties({ name: "dictionaryConfigEdit" }, [getEditView()])
}

function getEditView() {
  return {
    name: "dictionaryConfigEdit2",
    type: "RowsColsView",
    entity: entity,
    isForm: true,
    eventActionName: "getEntityData",
    isClear: true,
    saveEntityDataActionType: dataActionTypes.saveEntityData,
    getEntityDataActionType: dataActionTypes.getEntityData,
    properties: assignProporties(dictionaryConfig, getProperties())
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
    getTextBox2("Name", "键名", 1, 1, "", "请输入键名", 50, false),
    { ...getTextArea("Value", "值", 2, 1, ''), maxLength: 500 },
    getTextBox2("TypeName", "类型名", 3, 1, "", "", 50, true),
    getTextArea("Remark", "备注", 4, 1),
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
    properties: assignProporties({ name: "dictionaryConfigEdit" }, getButtonProperties())
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
    pageUrl: "/systemManage/dictionaryConfigList",
    expandSetPageUrl: "expandSetPageUrl"
  },
  {
    name: "saveEntityData",
    type: "entityEdit/saveEntityData",
    editView: "dictionaryConfigEdit2",
    expandSetEntityData: "expandSetEntityData"
  },
  {
    name: "getEntityData",
    type: "entityEdit/getEntityData",
    editView: "dictionaryConfigEdit2"
  }]
}