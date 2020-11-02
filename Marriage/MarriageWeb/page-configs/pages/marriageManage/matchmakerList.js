const matchmaker = require("../../entities/matchmaker");
const { getButton, assignProporties, getTextBox, getSelect, getSelect2, createGuid } = require("../../Common");

//marriageManage/matchmakerList 800-899
const dataActionTypes = {
  //搜索查询
  searchQuery: 800,
  //删除实体数据
  deleteEntityData: 801,
  //Excel导出
  excelExport: 802,
  //审核
  updateStatus: 803
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
      getEditSelect("IsAppMatchmaker", "是否平台红娘", matchmaker.isAppMatchmakerDataSource, 1, 1),
      {
        ...getTextBox2("keyword", "关键字", 2, 1, "", "昵称/名称/身份证号码/手机号码/地址"), propertyName: "NickName,Name,IdCard,Phone,Address",
        operateLogic: "like", pressEnterEventActionName: "searchQuery", pressEnterEventPropertyName: "search",
      },
      { ...getButton("search", "搜索", "primary", 2, 2), isFormItem: true, icon: "search", eventActionName: "searchQuery", pressEnterEventActionName: "searchQuery" },
      { ...getButton("clearQuery", "清空", "default", 2, 3), isFormItem: true, eventActionName: "clearQuery" },
      { eventActionName: "updateStatus", ...getButton("updateStatus", "审核", "primary", 3, 1), icon: 'check', style: { marginLeft: 16, marginBottom: 16 } },
      {
        eventActionName: "setAttributes", ...getButton("setAttributes", "设置属性", "default", 3, 2), icon: "setting",
        dataActionType: dataActionTypes.setAttributes, colStyle: { paddingLeft: 0 }
      }
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
      "StatusName",
    { name: "CreateDate", OrderByType: "desc" }])
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
    name: "updateStatus",
    type: "dialog/selectViewDataToList",
    dialogView: "updateApprovalView",
    dataGridView: "dataGridView1"
  }]
}


function getDialogViews() {
  return [
    getAddUserTagView()
  ]
}

function getAddUserTagView() {
  return {
    id: createGuid(),
    dialogId: createGuid(),
    name: "updateApprovalView",
    entity,
    type: "RowsColsView",
    dialogTitle: "粉丝用户设置标签",
    dialogWidth: 400,
    successTip: "操作成功",
    className: "divView2",
    setSelectValuesOkActionType: dataActionTypes.setUserTag,
    dialogStyle: { height: 100, overflow: "auto" },
    properties: assignProporties(entity, [
      { ...getEditSelect3("UserTagId", "标签", matchmaker.matchmakerTagDataSource, 1, 2) }
    ])
  }
}

function getEditSelect3(name, label, dataSource, x, y, defaultValue) {
  return {
    ...getSelect2(name, label, dataSource, x, y, defaultValue),
    isFormItem: true,
    colSpan: 22,
    labelCol: 4,
    wrapperCol: 20,
    isEdit: true,
    isNullable: false,
  }
}