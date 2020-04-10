// eslint-disable-next-line import/no-commonjs
const Week = require('../../entities/week');
// eslint-disable-next-line import/no-commonjs
const { assignProporties } = require('../../Common');

//WorkReportManage/WeekList 200-299
const DataActionTypes = {
  //Search Query
  searchQuery: 200,
  //Delete Entity Data
  deleteEntityData: 201,
  //Excel Export
  excelExport: 202
};

const entity = { name: Week.name, primaryKey: Week.primaryKey, viewName: "ViewWeek" };

// eslint-disable-next-line import/no-commonjs
module.exports = {
  name: "WeekList",
  type: "View",
  eventActions: getEventActions(),
  properties: assignProporties({ name: "WeekList" }, [getNavBar(), {
    name: 'ActivityIndicator1',
    type: 'ActivityIndicator'
  }, getSearchOperationView(), getDataGridView()])
}

function getNavBar() {
  return {
    title: 'Week List',
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
    properties: assignProporties({ name: "WeekList" }, [
      {
        name: 'Keyword', placeholder: 'Date/Remark', propertyName: 'Date,Remark', operateLogic: 'like',
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
    editEventActionName: 'editWeek',
    deleteEventActionName: 'deleteWeek',
    eventActionName: "searchQuery",
    activityIndicatorName: 'ActivityIndicator1',
    properties: assignProporties(Week, ["CreateUserName", 'StartDate', "EndDate", "Remark", 'WorkingHours',
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
    name: "editWeek",
    type: "DataGridView/selectRowToPage",
    pageUrl: "/pages/config/weekEdit?Id=#{Id}",
  },
  {
    name: "toEditPage",
    type: "Page/toPage",
    pageUrl: "/pages/config/weekEdit",
  },
  {
    name: "deleteWeek",
    type: "DataGridView/deleteEntityData",
    dataActionType: DataActionTypes.deleteEntityData,
    successTip: "Delete Succeed!",
    confirmTip: "Please confirm whether to delete the current Week?"
  }]
}
