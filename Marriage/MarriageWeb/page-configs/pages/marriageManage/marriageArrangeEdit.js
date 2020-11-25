const marriageArrange = require("../../entities/marriageArrange");
const { assignProporties, getTextBox, getButton, getDatePicker, getSelect2 } = require("../../Common");

//marriageManage/marriageArrangeEdit 1200-1299
const dataActionTypes = {
  //get entity data
  getEntityData: 1200,
  //Save entity data
  saveEntityData: 1201
}

const { name, primaryKey } = marriageArrange;
const entity = { name, primaryKey };


module.exports = {
  name: "marriageArrangeEdit",
  type: "View",
  eventActions: getEventActions(),
  properties: assignProporties({ name: "marriageArrangeEdit" }, [getEditView()])
}

function getEditView() {
  return {
    name: "marriageArrangeEdit2",
    type: "RowsColsView",
    entity: entity,
    isForm: true,
    eventActionName: "getEntityData",
    isClear: true,
    saveEntityDataActionType: dataActionTypes.saveEntityData,
    getEntityDataActionType: dataActionTypes.getEntityData,
    properties: assignProporties(marriageArrange, getProperties())
  }
}

function getButtonProperties() {
  return [{
    name: "leftSpace1",
    type: "WhiteSpace",
    className: "ant-col ant-col-8 ant-form-item-label"
  },
  { ...getButton("saveEntityData", "保存", "primary"), eventActionName: "saveEntityData", style: { width: 84 } },
  { ...getButton("backToList", "返回", ""), eventActionName: "backToList", style: { marginLeft: 10 } }]
}

function getProperties() {
  return [
    getAutoComplete2("ManUserId", "男方", 1, 1, marriageArrange.manMarriageUserDataSource, false, "请输入关键字选择"),
    getAutoComplete2("WomanUserId", "女方", 2, 1, marriageArrange.womanMarriageUserDataSource, false, "请输入关键字选择"),
    getEditSelect2("AppMatchmakerId", "平台红娘", 3, 1, marriageArrange.appMatchmakerDataSource, false, "请输入平台红娘"),
    getDatePicker2("MarriageDate", "相亲时间", 4, 1, "", "请选择相亲时间", 10, false),
    getTextBox2("MarriageAddress", "相亲地点", 5, 1, "", "相亲地址", 100, true),
    getTextArea("MarriageContent", "相亲情况", 6, 1, '相亲情况', 500),
    getTextArea("Remark", "备注", 7, 1, '备注', 200),
    getButtonView()
  ]
}

function getEditSelect2(name, label, x, y, serviceDataSrouce, isNullable, placeHolder) {
  return {
    ...getSelect2(name, label, serviceDataSrouce, x, y),
    isFormItem: true,
    colSpan: 24,
    labelCol: 8,
    wrapperCol: 8,
    isNullable,
    placeHolder,
    isEdit: true
  }
}

function getAutoComplete2(name, label, x, y, serviceDataSrouce, isNullable, placeHolder) {
  return {
    ...getSelect2(name, label, serviceDataSrouce, x, y),
    isFormItem: true,
    colSpan: 24,
    labelCol: 8,
    wrapperCol: 8,
    isNullable,
    placeHolder,
    allowClear: true, 
    isSearch: true,
    isEdit: true
  }
}

function getDatePicker2(name, label, x, y, isNullable, placeHolder, defaultValue) {
  return {
    ...getDatePicker(name, label, x, y, defaultValue),
    isFormItem: true,
    colSpan: 24,
    labelCol: 8,
    wrapperCol: 8,
    isNullable,
    placeHolder,
    isEdit: true,
    isCurrentDay: true
  }
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
    x: 8,
    y: 1,
    properties: assignProporties({ name: "marriageArrangeEdit" }, getButtonProperties())
  }
}

function getTextArea(name, label, x, y, placeHolder, maxLength) {
  return {
    ...getTextBox(name, label, "TextArea", x, y),
    isFormItem: true,
    isNullable: true,
    isEdit: true,
    colSpan: 24,
    Rows: 3,
    maxLength,
    placeHolder,
    labelCol: 8,
    wrapperCol: 8
  }
}

function getEventActions() {
  return [{
    name: "backToList",
    type: "page/toPage",
    propertyNames: [entity.primaryKey],
    pageUrl: '/marriageManage/marriageArrangeList?selectedRowKey=#{' + entity.primaryKey + '}'
  },
  {
    name: "saveEntityData",
    type: "entityEdit/saveEntityData",
    editView: "marriageArrangeEdit2",
    expandSetEntityData: "expandSetEntityData"
  },
  {
    name: "getEntityData",
    type: "entityEdit/getEntityData",
    editView: "marriageArrangeEdit2"
  }]
}