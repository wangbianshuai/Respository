const { getTextBox, getSelect, getButton, getDatePicker, getRadio } = require('../../common');

//marriage/marriagetatus 1800-1899
const dataActionTypes = {
  //get entity data
  getEntityData: 1800,
  //Save entity data
  saveEntityData: 1801
};

const entity = { name: 'MarriageStatus', primaryKey: 'marriageArrangeId', dataPrimaryKey: 'MarriageArrangeId' };

module.exports = {
  name: "marriageStatusEdit",
  type: "View",
  entity,
  eventActions: getEventActions(),
  properties: [marriageStatusEditView()]
}

function marriageStatusEditView() {
  return {
    name: "editView",
    type: "View",
    isDiv: true,
    className: 'divRegister',
    properties: [marriageStatusEditView2()]
  }
}

function marriageStatusEditView2() {
  return {
    name: "marriageStatusEditEdit",
    type: "View",
    entity,
    isList: true,
    eventActionName: "getEntityData",
    getEntityDataActionType: dataActionTypes.getEntityData,
    className: 'divDetail',
    properties: getProperties()
  }
}

function getProperties() {
  return [
    {
      name: "title",
      type: 'SpanText',
      isDiv: true,
      x: 1,
      y: 1,
      className: 'divTitle',
      label: "相亲状态"
    },
    {
      ...getEditSelect3("Status", "状态", getStatusDataSource(), 1, 1),
      valueVisibleProperties: {
        2: ['IsManAgree', 'NoManAgreeRemark', 'IsWomanAgree', 'NoWomanAgreeRemark'],
        4: ['BookMarryDate'],
        5: ['MarryDate'],
        6: ['BreakUpDate', 'BreakUpReason'],
        7: ['CancelReason'],
      }
    },
    { ...getRadio2("IsManAgree", "男方是否同意", getAgreeDataSource(), 2, 1, 0), type: 'Switch' },
    getTextArea2('NoManAgreeRemark', '男方不同意原因', 3, 1, '男方不同意原因'),
    { ...getRadio2("IsWomanAgree", "女方是否同意", getAgreeDataSource(), 4, 1, 0), type: 'Switch' },
    getTextArea2('NoWomanAgreeRemark', '女方不同意原因', 5, 1, '女方不同意原因'),
    getTextArea2('CancelReason', '取消原因', 6, 1, '取消原因'),
    getDatePicker2('BreakUpDate', '分手日期', 7, 1),
    getTextArea2('BreakUpReason', '分手原因', 8, 1, '分手原因'),
    getDatePicker2('BookMarryDate', '订婚日期', 9, 1),
    getDatePicker2('MarryDate', '结婚日期', 10, 1),
    getButtonView()
  ]
}

function getEditSelect3(name, label, dataSource, x, y, defaultValue) {
  return {
    ...getSelect(name, label, dataSource, x, y, defaultValue),
    isEdit: true,
    isNullable: false,
  }
}

function getAgreeDataSource() {
  return [{ value: 1, text: "同意" }, { value: 0, text: "不同意" }]
}

function getRadio2(name, label, dataSource, x, y, defaultValue) {
  return {
    ...getRadio(name, label, dataSource, x, y, defaultValue),
    isEdit: true,
    isVisible: false
  }
}

function getTextArea2(name, label, x, y, placeHolder) {
  return {
    ...getTextBox(name, label, 'textarea', x, y, placeHolder, 500),
    clear: true,
    labelNumber: 7,
    isNullable:false,
    isEdit: true,
    isVisible: false
  }
}

function getDatePicker2(name, label, x, y, placeHolder) {
  return {
    ...getDatePicker(name, label, x, y),
    placeHolder,
    isEdit: true,
    isNullable:false,
    isVisible: false
  }
}

function getButtonView() {
  return {
    name: 'buttonView',
    type: 'RowsColsView',
    isDiv: true,
    entity,
    className: "divButtonView",
    properties: [
      { ...getButton('save', '确定', 'primary', 1, 1), saveEntityDataActionType: dataActionTypes.saveEntityData, className: 'button', eventActionName: 'saveEntityData', rowClassName: "divRow4" },
    ]
  }
}

function getEventActions() {
  return [{
    name: "saveEntityData",
    type: "entityEdit/saveEntityData",
    editView: "marriageStatusEditEdit",
    expandSetEntityData: 'expandSetEntityData'
  },
  {
    name: "getEntityData",
    type: "entityEdit/getEntityData",
    editView: "marriageStatusEditEdit"
  }]
}

function getStatusDataSource() {
  return [{ value: 0, text: "待相亲" }, { value: 1, text: "有意向" }, { value: 2, text: "无意向" }, { value: 3, text: "牵手成功" },
  { value: 4, text: "订婚" }, { value: 5, text: "结婚" }, { value: 6, text: "分手" }, { value: 7, text: "取消" }]
}