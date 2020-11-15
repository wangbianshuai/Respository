const marriageArrange = require("../../entities/marriageArrange");
const { getButton, assignProporties, getTextBox, getSelect, getSelect2, getRadio, createGuid } = require("../../Common");

//marriageManage/marriageArrangeList 1100-1199
const dataActionTypes = {
  //搜索查询
  searchQuery: 1100,
  //删除实体数据
  deleteEntityData: 1101,
  //Excel导出
  excelExport: 1102,
  //审核
  updateStatus: 1103,
  //获取实体数据
  getViewEntityData: 1104,
  //获取实体数据
  updateFee: 1105,
  //获取相亲费用
  getMarriageFee: 1106
};

const { name, primaryKey, viewName } = marriageArrange;
const entity = { name, primaryKey, viewName };

module.exports = {
  name: "marriageArrangeList",
  type: "View",
  dialogViews: getDialogViews(),
  eventActions: getEventActions(),
  properties: assignProporties({ name: "marriageArrangeList" }, [getSearchOperationView(), getDataGridView()])
}

function getSearchOperationView() {
  return {
    name: "searchOperationView1",
    entity: entity,
    type: "RowsColsView",
    className: "divSerachView",
    properties: assignProporties({ name: "marriageArrangeList" }, [
      getEditSelect2("MatchmakerId", "男方红娘", marriageArrange.matchmakerDataSource, 1, 1),
      getEditSelect2("MatchmakerId", "女方红娘", marriageArrange.matchmakerDataSource, 1, 2),
      getEditSelect2("MatchmakerId", "平台红娘", marriageArrange.matchmakerDataSource, 1, 3),
      getEditSelect("Status", "状态", marriageArrange.statusDataSource, 2, 1),
      getEditSelect("SourceType", "来源类型", marriageArrange.sourceTypeDataSource, 2, 2),
      {
        ...getTextBox2("keyword", "关键字", 2, 3, "", "编号/男方/女方/红娘"), propertyName: "ArrangeId,ManUserName,WomanName,ManMatchmakerName,WomanMatchmakerName,AppMatchmakerName",
        operateLogic: "like", pressEnterEventActionName: "searchQuery", pressEnterEventPropertyName: "search",
      },
      { ...getButton("search", "搜索", "primary", 2, 4), isFormItem: true, icon: "search", eventActionName: "searchQuery", pressEnterEventActionName: "searchQuery" },
      { ...getButton("clearQuery", "清空", "default", 2, 5), isFormItem: true, eventActionName: "clearQuery" },
      { eventActionName: "toEditPage", ...getButton("toEditPage", "新增", "primary", 3, 1), style: { marginLeft: 16, marginBottom: 16 } },
      {
        eventActionName: "editMarriageArrange",
        colStyle: { paddingLeft: 0 }, ...getButton("editMarriageArrange", "修改", "default", 3, 2)
      },
      {
        eventActionName: "deleteMarriageArrange",
        colStyle: { paddingLeft: 0 },
        dataActionType: dataActionTypes.deleteEntityData,
        successTip: "删除成功！",
        confirmTip: "请确认是否删除当前相亲安排？",
        ...getButton("deleteMarriageArrange", "删除", "default", 3, 3)
      },
      { eventActionName: "updateStatus", ...getButton("updateStatus", "设置状态", "primary", 3, 4), icon: 'check' },
      { eventActionName: "updateFee", ...getButton("updateFee", "中介费", "ghost", 3, 5) }
    ])
  }
}

function getEditSelect2(name, label, serviceDataource, x, y, defaultValue) {
  return {
    ...getSelect2(name, label, serviceDataource, x, y, defaultValue),
    isFormItem: true,
    colSpan: 6,
    labelCol: 8,
    wrapperCol: 16,
    operateLogic: "=",
    isNullable: true,
    allowClear: true,
    isCondition: true
  }
}

function getEditSelect(name, label, dataSource, x, y, defaultValue) {
  return {
    ...getSelect(name, label, dataSource, x, y, defaultValue),
    isFormItem: true,
    colSpan: 6,
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
    colSpan: 6,
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
    properties: assignProporties(marriageArrange, ["ArrangeId", "ManUserName", "WomanUserName", "ManMatchmakerName", "WomanMatchmakerName", "AppMatchmakerName", 'MarriageDate',
      'MarriageAddress', 'SourceTypeName', 'Amount',
      "StatusName", { name: "Status", isVisible: false }, { name: "RowVersion", isVisible: false }, { name: "CancelReason", isVisible: false },
      { name: "IsManAgree", isVisible: false }, { name: "NoManAgreeRemark", isVisible: false }, { name: "IsWomanAgree", isVisible: false },
      { name: "NoWomanAgreeRemark", isVisible: false }, { name: "BookMarryDate", isVisible: false }, { name: "MarryDate", isVisible: false },
      { name: "BreakUpDate", isVisible: false }, { name: "BreakUpReason", isVisible: false },
      { name: "CreateDate", OrderByType: "desc" }, getOperation()])
  }
}

function getOperation() {
  return {
    name: "operation",
    label: "操作",
    isData: false,
    actionList: assignProporties(marriageArrange, [lookDetail()])
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
    name: "toEditPage",
    type: "page/toPage",
    pageUrl: "/marriageManage/marriageArrangeEdit"
  },
  {
    name: "editMarriageManage",
    type: "dataGridView/selectRowToPage",
    dataGridView: "dataGridView1",
    pageUrl: "/marriageManage/marriageArrangeEdit?MarriageArrangeId=#{MarriageArrangeId}&menuName=" + encodeURIComponent("修改")
  },
  {
    name: "deleteMarriageManage",
    type: "dataGrid/batchUpdateRowDataList",
    dataGridView: "dataGridView1"
  },
  {
    name: "updateStatus",
    type: "dialog/selectViewDataToList",
    dialogView: "updateApprovalView",
    dataProperties: ["Status", "IsManAgree", 'NoManAgreeRemark', 'IsWomanAgree', 'NoWomanAgreeRemark', 'CancelReason',
      'BookMarryDate', 'MarryDate', 'BreakUpDate', 'BreakUpReason'],
    dataGridView: "dataGridView1"
  }]
}

function getDialogViews() {
  return [
    getAddUserTagView(),
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
    dialogTitle: "相亲安排详情",
    dialogWidth: 860,
    className: "divView2",
    eventActionName: "getViewEntityData",
    getEntityDataActionType: dataActionTypes.getViewEntityData,
    dialogStyle: { height: 620, overflow: "auto" },
    properties: assignProporties(marriageArrange, [
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

function getAddUserTagView() {
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
    dialogStyle: { height: 360, overflow: "auto" },
    properties: assignProporties(entity, [
      { ...getEditSelect3("Status", "状态", marriageArrange.statusDataSource, 1, 1) },
      getTextArea2('NoPassReason', '不通过原因', 2, 1),
      { ...getRadio2("IsManAgree", "男生是否同意", marriageArrange.agreeDataSource, 3, 1, 0), buttonWidth: 157 }
    ])
  }
}

function getTextArea2(name, label, x, y, placeHolder) {
  return {
    ...getTextBox(name, label, 'TextArea', x, y, placeHolder, 500),
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