const matchmaker = require("../../entities/matchmaker");
const { getButton, assignProporties, getTextBox, getSelect, getRadio, createGuid } = require("../../Common");

//marriageManage/matchmakerList 800-899
const dataActionTypes = {
  //搜索查询
  searchQuery: 800,
  //删除实体数据
  deleteEntityData: 801,
  //Excel导出
  excelExport: 802,
  //审核
  updateStatus: 803,
  //获取实体数据
  getViewEntityData: 804
};

const { name, primaryKey, viewName } = matchmaker;
const entity = { name, primaryKey, viewName };

module.exports = {
  name: "matchmakerList",
  type: "View",
  dialogViews: getDialogViews(),
  eventActions: getEventActions(),
  properties: assignProporties({ name: "matchmakerList" }, [getSearchOperationView(), getDataGridView()])
}

function getSearchOperationView() {
  return {
    name: "searchOperationView1",
    entity: entity,
    type: "RowsColsView",
    className: "divSerachView",
    properties: assignProporties({ name: "matchmakerList" }, [
      getEditSelect("Sex", "性别", matchmaker.sexDataSource, 1, 1),
      getEditSelect("IsAppMatchmaker", "是否平台红娘", matchmaker.isAppMatchmakerDataSource, 1, 2),
      getEditSelect("Status", "状态", matchmaker.statusDataSource, 2, 1),
      {
        ...getTextBox2("keyword", "关键字", 2, 2, "", "昵称/名称/身份证号码/手机号码/地址"), propertyName: "NickName,Name,IdCard,Phone,Address",
        operateLogic: "like", pressEnterEventActionName: "searchQuery", pressEnterEventPropertyName: "search",
      },
      { ...getButton("search", "搜索", "primary", 2, 4), isFormItem: true, icon: "search", eventActionName: "searchQuery", pressEnterEventActionName: "searchQuery" },
      { ...getButton("clearQuery", "清空", "default", 2, 5), isFormItem: true, eventActionName: "clearQuery" },
      { eventActionName: "updateStatus", ...getButton("updateStatus", "设置状态", "primary", 3, 1), icon: 'check', style: { marginLeft: 16, marginBottom: 16 } }
    ])
  }
}

function getEditSelect(name, label, dataSource, x, y, defaultValue) {
  return {
    ...getSelect(name, label, dataSource, x, y, defaultValue),
    isFormItem: true,
    colSpan: 8,
    labelCol: 8,
    wrapperCol: 16,
    operateLogic: "=",
    isNullable: true,
    allowClear: true,
    isCondition: true
  }
}

function getTextBox2(name, label, x, y, contorlType, placeHolder, maxLength) {
  return {
    ...getTextBox(name, label, contorlType, x, y, placeHolder, maxLength || 50),
    isFormItem: true,
    colSpan: 8,
    labelCol: 8,
    wrapperCol: 16,
    isNullable: true,
    isCondition: true
  }
}

function getDataGridView() {
  return {
    name: "dataGridView1",
    entity: entity,
    type: "DataGridView",
    entitySearchQuery: dataActionTypes.searchQuery,
    entityExcelExport: dataActionTypes.excelExport,
    eventActionName: "searchQuery",
    isDiv: true,
    className: "divInfoView3",
    isRowSelection: true,
    isSingleSelection: true,
    properties: assignProporties(matchmaker, [{ name: "HeadImgUrl", label: "头像", isImage: true, imageWidth: 75 }, "Name", "NickName", "SexName", "IdCard", "Phone", "Address", 'IsAppMatchmakerName',
      "StatusName", { name: "Status", isVisible: false }, { name: "RowVersion", isVisible: false }, { name: "IsAppMatchmaker", isVisible: false }, { name: "NoPassReason", isVisible: false },
    { name: "CreateDate", OrderByType: "desc" }, getOperation()])
  }
}

function getOperation() {
  return {
    name: "operation",
    label: "操作",
    isData: false,
    actionList: assignProporties(matchmaker, [lookDetail()])
  }
}

function lookDetail() {
  return {
    name: "lookDetail",
    label: "查看",
    eventActionName: "lookDetail",
    type: "AButton"
  }
}

function getEventActions() {
  return [{
    name: "searchQuery",
    type: "dataGridView/searchQuery",
    searchView: "searchOperationView1",
    searchButton: "search",
    dataGridView: "dataGridView1"
  },
  {
    name: "clearQuery",
    type: "dataGridView/searchQuery",
    searchView: "searchOperationView1",
    searchButton: "clearQuery",
    dataGridView: "dataGridView1",
    isClearQuery: true
  },
  {
    name: "lookDetail",
    type: "dialog/showDialogLookData",
    dialogView: "lookDetailView",
    lookView: "lookDetailView"
  },
  {
    name: "getViewEntityData",
    type: "entityEdit/getEntityData",
    editView: "lookDetailView"
  },
  {
    name: "updateStatus",
    type: "dialog/selectViewDataToList",
    dialogView: "updateApprovalView",
    dataProperties: ["Status", "IsAppMatchmaker", 'NoPassReason'],
    dataGridView: "dataGridView1"
  }]
}

function getDialogViews() {
  return [
    getUpdateApprovalView(),
    getLookDetailView()
  ]
}

function getLookDetailView() {
  return {
    id: createGuid(),
    dialogId: createGuid(),
    name: "lookDetailView",
    entity,
    type: "RowsColsView",
    dialogTitle: "红娘详情",
    dialogWidth: 860,
    className: "divView2",
    eventActionName: "getViewEntityData",
    getEntityDataActionType: dataActionTypes.getViewEntityData,
    dialogStyle: { height: 620, overflow: "auto" },
    properties: assignProporties(matchmaker, [
      getTextBox3("Name", "姓名", 1, 1),
      getTextBox3("NickName", "昵称", 1, 2),
      getTextBox3("SexName", "性别", 2, 1),
      getTextBox3("IdCard", "身份证号码", 2, 2),
      getTextBox3("Phone", "手机号码", 3, 1),
      getTextBox3("Address", "家庭地址", 3, 2),
      getTextBox3("Province", "省份", 4, 1),
      getTextBox3("City", "城市", 4, 2),
      getTextBox3("IsAppMatchmakerName", "是否平台红娘", 5, 1),
      getTextBox3("StatusName", "状态", 5, 2),
      getTextBox3("LastLoginDate", "最近登录时间", 6, 1),
      getTextBox3("LoginIp", "登录IP", 6, 2),
      getTextBox3("NoPassReason", "不通过原因", 7, 1, "TextArea"),
      getTextBox3("Features", "特点说明", 7, 2, "TextArea"),
      getTextBox3("Remark", "备注", 8, 1, "TextArea"),
    ])
  }
}

function getTextBox3(name, label, x, y, contorlType, placeHolder, maxLength) {
  return {
    ...getTextBox(name, label, contorlType, x, y, placeHolder, maxLength || 50),
    isFormItem: true,
    colSpan: 12,
    labelCol: 6,
    wrapperCol: 18,
    isReadOnly: true
  }
}

function getUpdateApprovalView() {
  return {
    id: createGuid(),
    dialogId: createGuid(),
    name: "updateApprovalView",
    entity,
    type: "RowsColsView",
    dialogTitle: "设置状态",
    dialogWidth: 540,
    successTip: "操作成功",
    className: "divView2",
    setSelectValuesOkActionType: dataActionTypes.updateStatus,
    dialogStyle: { height: 260, overflow: "auto" },
    properties: assignProporties(entity, [
      { ...getEditSelect3("Status", "状态", matchmaker.statusDataSource, 1, 1) },
      getTextArea2('NoPassReason', '不通过原因', 2, 1),
      { ...getRadio2("IsAppMatchmaker", "是否平台红娘", matchmaker.isAppMatchmakerDataSource, 3, 1, 0), buttonWidth: 157 }
    ])
  }
}

function getTextArea2(name, label, x, y) {
  return {
    ...getTextBox(name, label, 'TextArea', x, y, '当审核不通过时，需输入不通过原因，其他状态无需输入', 500),
    isFormItem: true,
    colSpan: 22,
    labelCol: 6,
    wrapperCol: 18,
    isEdit: true
  }
}

function getRadio2(name, label, dataSource, x, y, defaultValue) {
  return {
    ...getRadio(name, label, dataSource, x, y, defaultValue),
    isFormItem: true,
    colSpan: 22,
    labelCol: 6,
    wrapperCol: 18,
    isEdit: true
  }
}

function getEditSelect3(name, label, dataSource, x, y, defaultValue) {
  return {
    ...getSelect(name, label, dataSource, x, y, defaultValue),
    isFormItem: true,
    colSpan: 22,
    labelCol: 6,
    wrapperCol: 18,
    isEdit: true,
    isNullable: false,
  }
}