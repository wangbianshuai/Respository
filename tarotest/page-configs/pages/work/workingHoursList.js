// eslint-disable-next-line import/no-commonjs
const WorkingHours = require('../../entities/workingHours');
// eslint-disable-next-line import/no-commonjs
const { assignProporties } = require('../../Common');

//WorkReportManage/WorkingHoursList 700-799
const DataActionTypes = {
  //Search Query
  searchQuery: 700,
  //Delete Entity Data
  deleteEntityData: 701,
  //Excel Export
  excelExport: 702
};

const entity = { name: WorkingHours.name, primaryKey: WorkingHours.primaryKey, viewName: "ViewWorkingHours" };

// eslint-disable-next-line import/no-commonjs
module.exports = {
  name: "WorkingHoursList",
  type: "View",
  eventActions: getEventActions(),
  properties: assignProporties({ name: "WorkingHoursList" }, [getNavBar(), {
    name: 'ActivityIndicator1',
    type: 'ActivityIndicator'
  }, getSearchOperationView(), getDataGridView()])
}

function getNavBar() {
  return {
    title: 'WorkingHours List',
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
    properties: assignProporties({ name: "WorkingHoursList" }, [
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
    editEventActionName: 'editWorkingHours',
    deleteEventActionName: 'deleteWorkingHours',
    eventActionName: "searchQuery",
    activityIndicatorName: 'ActivityIndicator1',
    properties: assignProporties(WorkingHours, ["CreateUserName","WeekName", 'StoryName', "Content", "WeekWorkingHours", "HourCount", "Remark", { name: "StoryUrl", isVisible: false },
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
    name: "editWorkingHours",
    type: "DataGridView/selectRowToPage",
    pageUrl: "/pages/work/workingHoursInput?Id=#{Id}",
    isSelfOperation: true,
    selfPropertyName: "CreateUser",
  },
  {
    name: "toEditPage",
    type: "Page/toPage",
    pageUrl: "/pages/work/workingHoursInput",
  },
  {
    name: "deleteWorkingHours",
    type: "DataGridView/deleteEntityData",
    isSelfOperation: true,
    selfPropertyName: "CreateUser",
    dataActionType: DataActionTypes.deleteEntityData,
    successTip: "Delete Succeed!",
    confirmTip: "Please confirm whether to delete the current Working Hours?"
  }]
}
