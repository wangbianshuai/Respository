// eslint-disable-next-line import/no-commonjs
const User = require('../../entities/user');
// eslint-disable-next-line import/no-commonjs
const { assignProporties } = require('../../Common');

//WorkReportManage/UserList 4300-4399
const DataActionTypes = {
  //Search Query
  searchQuery: 4300,
  //Delete Entity Data
  deleteEntityData: 4301,
  //Excel Export
  excelExport: 4302
};

const entity = { name: User.name, primaryKey: User.primaryKey, viewName: "ViewUser" };

// eslint-disable-next-line import/no-commonjs
module.exports = {
  name: "UserList",
  type: "View",
  eventActions: getEventActions(),
  properties: assignProporties({ name: "UserList" }, [getNavBar(), {
    name: 'ActivityIndicator1',
    type: 'ActivityIndicator'
  }, getSearchOperationView(), getDataGridView()])
}

function getNavBar() {
  return {
    title: 'User List',
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
    properties: assignProporties({ name: "UserList" }, [
      {
        name: 'Keyword', placeholder: 'Login Name/User Name', propertyName: 'LoginName,UserName', operateLogic: 'like',
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
    editEventActionName: 'editUser',
    deleteEventActionName: 'deleteUser',
    eventActionName: "searchQuery",
    activityIndicatorName: 'ActivityIndicator1',
    properties: assignProporties(User, ["LoginName", 'UserName', "LastLoginDate",
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
    name: "editUser",
    type: "DataGridView/selectRowToPage",
    pageUrl: "/pages/config/userEdit?UserId=#{UserId}",
  },
  {
    name: "toEditPage",
    type: "Page/toPage",
    pageUrl: "/pages/config/userEdit",
  },
  {
    name: "deleteUser",
    type: "DataGridView/deleteEntityData",
    dataActionType: DataActionTypes.deleteEntityData,
    successTip: "Delete Succeed!",
    confirmTip: "Please confirm whether to delete the current User?"
  }]
}
