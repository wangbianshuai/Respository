const marriageUser = require("../../entities/marriageUser");
const { getButton, assignProporties, getTextBox, getSelect, getSelect2, getRadio, createGuid } = require("../../Common");

//marriageManage/marriageUserList 900-999
const dataActionTypes = {
  //搜索查询
  searchQuery: 900,
  //删除实体数据
  deleteEntityData: 901,
  //Excel导出
  excelExport: 902,
  //审核
  updateStatus: 903,
  //获取实体数据
  getViewEntityData: 904
};

const { name, primaryKey, viewName } = marriageUser;
const entity = { name, primaryKey, viewName };

module.exports = {
  name: "marriageUserList",
  type: "View",
  dialogViews: getDialogViews(),
  eventActions: getEventActions(),
  properties: assignProporties({ name: "marriageUserList" }, [getSearchOperationView(), getDataGridView()])
}

function getSearchOperationView() {
  return {
    name: "searchOperationView1",
    entity: entity,
    type: "RowsColsView",
    className: "divSerachView",
    properties: assignProporties({ name: "marriageUserList" }, [
      getEditSelect("Sex", "性别", marriageUser.sexDataSource, 1, 1),
      getEditSelect("Shengxiao", "生消", marriageUser.shengxiaoDataSource, 1, 2),
      getEditSelect2("MatchmakerId", "专属红娘", marriageUser.matchmakerDataSource, 1, 3),
      getEditSelect("Status", "状态", marriageUser.statusDataSource, 2, 1),
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

function getEditSelect2(name, label, serviceDataource, x, y, defaultValue) {
  return {
    ...getSelect2(name, label, serviceDataource, x, y, defaultValue),
    isFormItem: true,
    colSpan: 7,
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
    colSpan: 7,
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
    colSpan: 7,
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
    properties: assignProporties(marriageUser, [{ name: "HeadImgUrl", label: "头像", isImage: true, imageWidth: 75 }, "Name", "NickName", "SexName", "IdCard", "Phone", "Address", 'Birthday',
      'Age', 'Shengxiao', "StatusName", { name: "Status", isVisible: false }, { name: "RowVersion", isVisible: false }, { name: "NoPassReason", isVisible: false },
    { name: "CreateDate", OrderByType: "desc" }, getOperation()])
  }
}

function getOperation() {
  return {
    name: "operation",
    label: "操作",
    isData: false,
    actionList: assignProporties(marriageUser, [lookDetail(), lookPhoto(), lookConditionType(), lookSelectConditionType()])
  }
}

function lookDetail() {
  return {
    name: "lookDetail",
    label: "基本信息",
    eventActionName: "lookDetail",
    type: "AButton"
  }
}


function lookPhoto() {
  return {
    name: "lookPhoto",
    label: "生活照",
    eventActionName: "lookPhoto",
    type: "AButton"
  }
}


function lookConditionType() {
  return {
    name: "lookConditionType",
    label: "条件信息",
    eventActionName: "lookConditionType",
    type: "AButton"
  }
}

function lookSelectConditionType() {
  return {
    name: "lookSelectConditionType",
    label: "择偶标准",
    eventActionName: "lookSelectConditionType",
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
    dataProperties: ["Status", 'NoPassReason'],
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
    dialogTitle: "相亲用户详情",
    dialogWidth: 860,
    className: "divView2",
    eventActionName: "getViewEntityData",
    getEntityDataActionType: dataActionTypes.getViewEntityData,
    dialogStyle: { height: 620, overflow: "auto" },
    properties: assignProporties(marriageUser, [
      getTextBox3("Name", "姓名", 1, 1),
      getTextBox3("NickName", "昵称", 1, 2),
      getTextBox3("SexName", "性别", 2, 1),
      getTextBox3("IdCard", "身份证号码", 2, 2),
      getTextBox3("Phone", "手机号码", 3, 1),
      getTextBox3("Address", "家庭地址", 3, 2),
      getTextBox3("NowAddress", "现居住址", 4, 1),
      getTextBox3("Birthday", "公历生日", 4, 2),
      getTextBox3("BirthTimeName", "出生时辰", 5, 1),
      getTextBox3("LunarBirthday", "农历生日", 5, 2),
      getTextBox3("Age", "年龄", 6, 1),
      getTextBox3("Shengxiao", "生肖", 6, 2),
      getTextBox3("BirthEight", "生辰八字", 7, 2),
      getTextBox3("IsPublicName", "信息公开", 7, 2),
      getTextBox3("Province", "省份", 8, 1),
      getTextBox3("City", "城市", 8, 2),
      getTextBox3("MatchmakerName", "专属红娘", 9, 1),
      getTextBox3("StatusName", "状态", 9, 2),
      getTextBox3("LastLoginDate", "最近登录时间", 10, 1),
      getTextBox3("LoginIp", "登录IP", 10, 2),
      getTextBox3("NoPassReason", "不通过原因", 11, 1, "TextArea"),
      getTextBox3("Remark", "个性签名", 11, 2, "TextArea"),
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
    dialogStyle: { height: 200, overflow: "auto" },
    properties: assignProporties(entity, [
      { ...getEditSelect3("Status", "状态", marriageUser.statusDataSource, 1, 1) },
      getTextArea2('NoPassReason', '不通过原因', 2, 1),
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