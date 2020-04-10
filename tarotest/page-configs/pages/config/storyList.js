// eslint-disable-next-line import/no-commonjs
const Story = require('../../entities/story');
// eslint-disable-next-line import/no-commonjs
const { assignProporties } = require('../../Common');

//WorkReportManage/StoryList 500-599
const DataActionTypes = {
  //Search Query
  searchQuery: 500,
  //Delete Entity Data
  deleteEntityData: 501,
  //Excel Export
  excelExport: 502
};

const entity = { name: Story.name, primaryKey: Story.primaryKey, viewName: "ViewStory" };

// eslint-disable-next-line import/no-commonjs
module.exports = {
  name: "StoryList",
  type: "View",
  eventActions: getEventActions(),
  properties: assignProporties({ name: "StoryList" }, [getNavBar(), {
    name: 'ActivityIndicator1',
    type: 'ActivityIndicator'
  }, getSearchOperationView(), getDataGridView()])
}

function getNavBar() {
  return {
    title: 'Story List',
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
    properties: assignProporties({ name: "StoryList" }, [
      {
        name: 'Keyword', placeholder: 'Story Id/Title/Remark', propertyName: 'StoryId,StoryTitle,Remark', operateLogic: 'like',
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
    editEventActionName: 'editStory',
    deleteEventActionName: 'deleteStory',
    eventActionName: "searchQuery",
    activityIndicatorName: 'ActivityIndicator1',
    properties: assignProporties(Story, ["CreateUserName", 'StoryId', "StoryTitle", "StartDate", "EndDate", "Remark", { name: "StoryUrl", isVisible: false },
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
    name: "editStory",
    type: "DataGridView/selectRowToPage",
    pageUrl: "/pages/config/storyEdit?Id=#{Id}",
    isSelfOperation: true,
    selfPropertyName: "CreateUser",
  },
  {
    name: "toEditPage",
    type: "Page/toPage",
    pageUrl: "/pages/config/storyEdit",
  },
  {
    name: "deleteStory",
    type: "DataGridView/deleteEntityData",
    isSelfOperation: true,
    selfPropertyName: "CreateUser",
    dataActionType: DataActionTypes.deleteEntityData,
    successTip: "Delete Succeed!",
    confirmTip: "Please confirm whether to delete the current Story?"
  }]
}
