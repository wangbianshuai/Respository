const PullRequest = require("../../entities/PullRequest");
const { GetButton, AssignProporties, GetTextBox, GetSelect } = require("../../Common");

//WorkReportManage/PullRequestList 900-999
const DataActionTypes = {
  //Search Query
  SearchQuery: 900,
  //Delete Entity Data
  DeleteEntityData: 901,
  //Excel Export
  ExcelExport: 902
};

const Entity = { Name: PullRequest.Name, PrimaryKey: PullRequest.PrimaryKey, ViewName: "ViewPullRequest", IsGroupByInfo: true };

module.exports = {
  Name: "PullRequestList",
  Type: "View",
  EventActions: GetEventActions(),
  Properties: AssignProporties({ Name: "PullRequestList" }, [GetSearchOperationView(), GetDataGridView()])
}

function GetSearchOperationView() {
  return {
    Name: "SearchOperationView1",
    Entity: Entity,
    Type: "RowsColsView",
    ClassName: "DivSerachView",
    Properties: AssignProporties({ Name: "PullRequestList" }, [
      GetEditSelect("StoryId", "Story", PullRequest.StoryDataSource, 1, 1),
      GetEditSelect("CreateUser", "User", PullRequest.UserDataSource, 1, 2),
      {
        ...GetTextBox2("Keyword", "Keyword", 1, 3, "", "Pull Request Title/Remark"), PropertyName: "PullRequestTitle,Remark",
        OperateLogic: "like", PressEnterEventActionName: "SearchQuery"
      },
      { ...GetButton("Search", "Search", "primary", 1, 4), IsFormItem: true, Icon: "search", EventActionName: "SearchQuery", PressEnterEventActionName: "SearchQuery" },
      { ...GetButton("ClearQuery", "Clear", "default", 1, 5), IsFormItem: true, EventActionName: "ClearQuery" },
      { EventActionName: "ToEditPage", ...GetButton("ToEditPage", "Add", "primary", 2, 1), Style: { marginLeft: 16, marginBottom: 16 } },
      { EventActionName: "ExcelExport", ...GetButton("ExcelExport", "Excel Export", "default", 2, 2), Icon: "download", ColStyle: { paddingLeft: 0 } }
    ])
  }
}

function GetEditSelect(Name, Label, DataSource, X, Y, DefaultValue) {
  return {
    ...GetSelect(Name, Label, null, X, Y, DefaultValue),
    IsFormItem: true,
    ColSpan: 6,
    LabelCol: 8,
    WrapperCol: 15,
    OperateLogic: "=",
    ServiceDataSource: DataSource,
    IsNullable: true,
    AllowClear: true,
    IsCondition: true
  }
}

function GetTextBox2(Name, Label, X, Y, ContorlType, PlaceHolder, MaxLength) {
  return {
    ...GetTextBox(Name, Label, ContorlType, X, Y, PlaceHolder, MaxLength || 50),
    IsFormItem: true,
    ColSpan: 6,
    LabelCol: 8,
    WrapperCol: 15,
    IsNullable: true,
    IsCondition: true
  }
}

function GetDataGridView() {
  return {
    Name: "DataGridView1",
    Entity: Entity,
    Type: "DataGridView",
    EntitySearchQuery: DataActionTypes.SearchQuery,
    EntityExcelExport: DataActionTypes.ExcelExport,
    EventActionName: "SearchQuery",
    IsDiv: true,
    ClassName: "DivInfoView3",
    GroupByInfoHtml: GetGroupByInfoHtml(),
    Properties: AssignProporties(PullRequest, ["CreateUserName", GetStory(), GetPullRequestTitle(), "TestCases", "Comments", "StartDate", "EndDate", "Remark", { Name: "StoryUrl", IsVisible: false },
      { Name: "CreateDate", OrderByType: "desc" }, { Name: "PullRequestUrl", IsVisible: false }, { Name: "RowVersion", IsVisible: false },
      { Name: "CreateUser", IsVisible: false }, GetOperation()])
  }
}

function GetGroupByInfoHtml() {
  var html = [];

  html.push("Total Test Cases：<span style=\"color:#1890ff;\">{TotalTestCases}</span>，");
  html.push("Total Comments：<span  style=\"color:#1890ff;\">{TotalComments}</span>");

  return html.join("");
}

function GetStory() {
  return {
    Name: "StoryName",
    IsOpenPage: true,
    IsHttp: true,
    PageUrl: "#{StoryUrl}"
  }
}

function GetPullRequestTitle() {
  return {
    Name: "PullRequestTitle",
    IsOpenPage: true,
    IsHttp: true,
    PageUrl: "#{PullRequestUrl}"
  }
}

function GetOperation() {
  return {
    Name: "Operation",
    Label: "Operation",
    IsData: false,
    SelfPropertyName: "CreateUser",
    ActionList: AssignProporties(PullRequest, [GetEditAction(), GetDeleteAction()])
  }
}

function GetEditAction() {
  return {
    Name: "EditPullRequest",
    Label: "Edit",
    EventActionName: "EditPullRequest",
    IsSelfOperation: true,
    Type: "AButton"
  }
}

function GetDeleteAction() {
  return {
    Name: "DeletePullRequest",
    Label: "Delete",
    Type: "Popconfirm",
    EventActionName: "DeletePullRequest",
    IsSelfOperation: true,
    DataActionType: DataActionTypes.DeleteEntityData,
    SuccessTip: "Delete Succeed!",
    Title: "Please confirm whether to delete the current PullRequest?"
  }
}
function GetEventActions() {
  return [{
    Name: "SearchQuery",
    Type: "DataGridView/SearchQuery",
    SearchView: "SearchOperationView1",
    SearchButton: "Search",
    DataGridView: "DataGridView1"
  },
  {
    Name: "ClearQuery",
    Type: "DataGridView/SearchQuery",
    SearchView: "SearchOperationView1",
    SearchButton: "ClearQuery",
    DataGridView: "DataGridView1",
    IsClearQuery: true
  },
  {
    Name: "ExcelExport",
    Type: "DataGridView/ExcelExport",
    DataGridView: "DataGridView1"
  },
  {
    Name: "EditPullRequest",
    Type: "DataGridView/SelectRowToPage",
    DataGridView: "DataGridView1",
    AlertMessage: "AlertMessage",
    PageUrl: "/WorkReportManage/PullRequestInput?Id=#{Id}",
    ExpandSetPageUrl: "ExpandSetPageUrl"
  },
  {
    Name: "ToEditPage",
    Type: "Page/ToPage",
    PageUrl: "/WorkReportManage/PullRequestInput",
    ExpandSetPageUrl: "ExpandSetPageUrl"
  },
  {
    Name: "DeletePullRequest",
    Type: "DataGrid/BatchUpdateRowDataList",
    DataGridView: "DataGridView1"
  }]
}
