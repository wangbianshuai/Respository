// eslint-disable-next-line import/no-commonjs
const PullRequest = require('../../entities/pullRequest');
// eslint-disable-next-line import/no-commonjs
const { assignProporties } = require('../../Common');

//work/PullRequestList 900-999
const DataActionTypes = {
  //Search Query
  searchQuery: 900,
  //Delete Entity Data
  deleteEntityData: 901,
  //Excel Export
  excelExport: 902
};

const entity = { name: PullRequest.name, primaryKey: PullRequest.primaryKey, viewName: "ViewPullRequest" };

// eslint-disable-next-line import/no-commonjs
module.exports = {
  name: "PullRequestList",
  type: "View",
  eventActions: getEventActions(),
  properties: assignProporties({ name: "PullRequestList" }, [getNavBar(), {
    name: 'ActivityIndicator1',
    type: 'ActivityIndicator'
  }, getSearchOperationView(), getDataGridView()])
}

function getNavBar() {
  return {
    title: 'PullRequest List',
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
    properties: assignProporties({ name: "PullRequestList" }, [
      {
        name: 'Keyword', placeholder: 'Story Id/Pull Request Title/Remark', propertyName: 'StoryName,PullRequestTitle,Remark', operateLogic: 'like',
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
    editEventActionName: 'editPullRequest',
    deleteEventActionName: 'deletePullRequest',
    eventActionName: "searchQuery",
    activityIndicatorName: 'ActivityIndicator1',
    properties: assignProporties(PullRequest, ["CreateUserName", 'StoryName', "PullRequestTitle", "TestCases", "Comments", "StartDate", "EndDate", "Remark", { name: "StoryUrl", isVisible: false },
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
    name: "editPullRequest",
    type: "DataGridView/selectRowToPage",
    pageUrl: "/pages/work/pullRequestInput?Id=#{Id}",
    isSelfOperation: true,
    selfPropertyName: "CreateUser",
  },
  {
    name: "toEditPage",
    type: "Page/toPage",
    pageUrl: "/pages/work/pullRequestInput",
  },
  {
    name: "deletePullRequest",
    type: "DataGridView/deleteEntityData",
    isSelfOperation: true,
    selfPropertyName: "CreateUser",
    dataActionType: DataActionTypes.deleteEntityData,
    successTip: "Delete Succeed!",
    confirmTip: "Please confirm whether to delete the current Pull Request?"
  }]
}
