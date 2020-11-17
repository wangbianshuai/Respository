const matchmakerFeeDetail = require("../../entities/matchmakerFeeDetail");
const { getButton, assignProporties, getTextBox, getSelect2, getDatePicker } = require("../../Common");

//marriageManage/matchmakerFeeDetailList 1000-1099
const dataActionTypes = {
  //搜索查询
  searchQuery: 1000,
  //删除实体数据
  deleteEntityData: 1001,
  //Excel导出
  excelExport: 1002,
};

const { name, primaryKey, viewName } = matchmakerFeeDetail;
const entity = { name, primaryKey, viewName, isGroupByInfo: true, };

module.exports = {
  name: "matchmakerFeeDetailList",
  type: "View",
  eventActions: getEventActions(),
  properties: assignProporties({ name: "matchmakerFeeDetailList" }, [getSearchOperationView(), getDataGridView()])
}

function getSearchOperationView() {
  return {
    name: "searchOperationView1",
    entity: entity,
    type: "RowsColsView",
    className: "divSerachView",
    properties: assignProporties({ name: "matchmakerFeeDetailList" }, [
      getEditSelect("MatchmakerId", "红娘", matchmakerFeeDetail.matchmakerDataSource, 1, 1),
      { ...getDatePicker2("StartDate", "开始日期", 1, 2, "大于或等于其值"), propertyName: "FeeDate", operateLogic: ">=" },
      { ...getDatePicker2("EndDate", "至", 1, 3, "小于其值"), propertyName: "FeeDate", operateLogic: "<" },
      {
        ...getTextBox2("keyword", "关键字", 2, 2, "", "相亲安排编号/男方/女方/备注"), propertyName: "ArrangeID,ManName,WomanName,Remark",
        operateLogic: "like", pressEnterEventActionName: "searchQuery", pressEnterEventPropertyName: "search",
      },
      { ...getButton("search", "搜索", "primary", 2, 3), isFormItem: true, icon: "search", eventActionName: "searchQuery", pressEnterEventActionName: "searchQuery" },
      { ...getButton("clearQuery", "清空", "default", 2, 4), isFormItem: true, eventActionName: "clearQuery" }
    ])
  }
}

function getDatePicker2(name, label, x, y, placeHolder, defaultValue) {
  return {
    ...getDatePicker(name, label, x, y, defaultValue),
    isFormItem: true, colSpan: 6,
    isNullable: true,
    placeHolder: placeHolder,
    maxLength: 20,
    labelCol: 8,
    wrapperCol: 16,
    dataType: "DateTime",
    isCondition: true
  }
}

function getEditSelect(name, label, serviceDataSource, x, y, defaultValue) {
  return {
    ...getSelect2(name, label, serviceDataSource, x, y, defaultValue),
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
    groupByInfoHtml: getGroupByInfoHtml(),
    properties: assignProporties(matchmakerFeeDetail, ["ArrangeId", "FeeDate", "ManName", "WomanName", "MatchmakerName", "MatchmakerTypeName", getAmount("Amount"), getAmount("AppAmount"), 'Remark',
      { name: "CreateDate", OrderByType: "desc" }])
  }
}

function getAmount(name) {
  return {
    name,
    scale: 2, isCurrency: true, fontColor: "#1890ff"
  }
}

function getGroupByInfoHtml() {
  var html = [];

  html.push("总中介费：<span style=\"color:#1890ff;\">{TotalAmount}</span>，");
  html.push("红娘总中介费：<span style=\"color:#1890ff;\">{TotalMatchmakerAmount}</span>，");
  html.push("平台红娘中介费：<span style=\"color:#1890ff;\">{TotalAppMatchmakerAmount}</span>，");
  html.push("平台中介费：<span style=\"color:#1890ff;\">{TotalAppAmount}</span>");

  return html.join("");
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
  }]
}