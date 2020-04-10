// eslint-disable-next-line import/no-commonjs
const Daily = require('../../entities/daily');
// eslint-disable-next-line import/no-commonjs
const { assignProporties } = require('../../Common');

//WorkReportManage/DailyList 1000-1199
const DataActionTypes = {
  //Search Query
  searchQuery: 1100,
  //Delete Entity Data
  deleteEntityData: 1101,
  //Excel Export
  excelExport: 1102
};

const entity = { name: Daily.name, primaryKey: Daily.primaryKey, viewName: "ViewDaily" };

// eslint-disable-next-line import/no-commonjs
module.exports = {
  name: "DailyList",
  type: "View",
  eventActions: getEventActions(),
  properties: assignProporties({ name: "DailyList" }, [getNavBar(), {
    name: 'ActivityIndicator1',
    type: 'ActivityIndicator'
  }, getSearchOperationView(), getDataGridView()])
}

function getNavBar() {
  return {
    title: 'Daily List',
    fixed: true,
    type: 'NavBar',
    name: 'NavBar1',
    rightFirstIconType: 'add',
    rightFirstEventActionName: 'toEditPage',
  };
}

function getSearchOperationView() {
  return {
    name: "SearchOperationView1",
    entity,
    type: "View",
    className: "DivSerachView",
    properties: assignProporties({ name: "DailyList" }, [
      {
        name: 'Keyword', placeholder: 'Story Id/Title/Content/Remark', propertyName: 'StoryName,Content,Remark', operateLogic: 'like',
        label: 'Keyword', type: 'SearchBar', eventActionName: "searchQuery", maxLength: 50, isCondition: true, isNullable: true,
      }
    ])
  }
}

function getDataGridView() {
  return {
    name: "DataGridView1",
    entity,
    type: "DataGridView",
    entitySearchQuery: DataActionTypes.searchQuery,
    entityExcelExport: DataActionTypes.excelExport,
    editEventActionName: 'editDaily',
    deleteEventActionName: 'deleteDaily',
    eventActionName: "searchQuery",
    activityIndicatorName: 'ActivityIndicator1',
    properties: assignProporties(Daily, ["CreateUserName", 'StoryName', "Content", "HoursCount", "WorkingDate", "Remark", { name: "StoryUrl", isVisible: false },
      { name: "CreateDate", orderByType: "desc" }, { name: "RowVersion", isVisible: false }, { name: "CreateUser", isVisible: false }])
  }
}

function getEventActions() {
  return [{
    name: "searchQuery",
    type: "DataGridView/searchQuery",
    searchView: "SearchOperationView1",
    searchButton: "Keyword",
    dataGridView: "DataGridView1"
  },
  {
    name: "editDaily",
    type: "DataGridView/selectRowToPage",
    pageUrl: "/pages/work/dailyInput?Id=#{Id}",
    isSelfOperation: true,
    selfPropertyName: "CreateUser",
  },
  {
    name: "toEditPage",
    type: "Page/toPage",
    pageUrl: "/pages/work/dailyInput",
  },
  {
    name: "deleteDaily",
    type: "DataGridView/deleteEntityData",
    isSelfOperation: true,
    selfPropertyName: "CreateUser",
    dataActionType: DataActionTypes.deleteEntityData,
    successTip: "Delete Succeed!",
    confirmTip: "Please confirm whether to delete the current Daily?"
  }]
}
