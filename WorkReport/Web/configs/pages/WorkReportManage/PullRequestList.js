const PullRequest = require("../../entities/PullRequest");
const { GetButton, AssignProporties, GetTextBox, GetSelect, GetDatePicker } = require("../../Common");

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
      GetEditSelect("StoryId", "Story", PullRequest.StoryDataSource, 1, 1, true),
      GetEditSelect("CreateUser", "User", PullRequest.UserDataSource, 1, 2, false),
      {
        ...GetTextBox2("Keyword", "Keyword", 1, 3, "", "Pull Request Title/Remark"), PropertyName: "PullRequestTitle,Remark",
        OperateLogic: "like", PressEnterEventActionName: "SearchQuery"
      },
      { ...GetDatePicker2("StartDate", "Start Date", 2, 1, "Greater than or equal to its value"), PropertyName: "StartDate", OperateLogic: ">=" },
      { ...GetDatePicker2("EndDate", "To", 2, 2, "Less than its value"), PropertyName: "StartDate", OperateLogic: "<" },
      { ...GetDatePicker2("StartDate2", "End Date", 3, 1, "Greater than or equal to its value"), PropertyName: "EndDate", OperateLogic: ">=" },
      { ...GetDatePicker2("EndDate2", "To", 3, 2, "Less than its value"), PropertyName: "EndDate", OperateLogic: "<" },
      { ...GetButton("Search", "Search", "primary", 3, 4), IsFormItem: true, Icon: "search", EventActionName: "SearchQuery", PressEnterEventActionName: "SearchQuery" },
      { ...GetButton("ClearQuery", "Clear", "default", 3, 5), IsFormItem: true, EventActionName: "ClearQuery" },
      { EventActionName: "ToEditPage", ...GetButton("ToEditPage", "Add", "primary", 4, 1), Style: { marginLeft: 16, marginBottom: 16 } },
      { EventActionName: "ExcelExport", ...GetButton("ExcelExport", "Excel Export", "default", 4, 2), Icon: "download", ColStyle: { paddingLeft: 0 } }
    ])
  }
}

function GetDatePicker2(Name, Label, X, Y, PlaceHolder, DefaultValue) {
  return {
    ...GetDatePicker(Name, Label, X, Y, DefaultValue),
    IsFormItem: true, ColSpan: 6,
    IsNullable: true,
    PlaceHolder: PlaceHolder,
    MaxLength: 20,
    LabelCol: 8,
    WrapperCol: 15,
    DataType: "DateTime",
    IsCondition: true
  }
}

function GetEditSelect(Name, Label, DataSource, X, Y, IsSearch) {
  return {
    ...GetSelect(Name, Label, null, X, Y),
    IsFormItem: true,
    ColSpan: 6,
    LabelCol: 8,
    WrapperCol: 15,
    IsSearch,
    AllowClear: true,
    OperateLogic: "=",
    ServiceDataSource: DataSource,
    IsNullable: true,
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
    Properties: AssignProporties(PullRequest, ["CreateUserName", GetStory(), GetPullRequestTitle(), "TestCases", "Comments", { Name: "StartMonth", IsVisible: false, IsExcelExport: true },
      { Name: "EndMonth", IsVisible: false, IsExcelExport: true }, "StartDate", "EndDate", "Remark", { Name: "StoryUrl", IsVisible: false, IsExcelExport: true },
      { Name: "CreateDate", OrderByType: "desc", IsExcelExport: true }, { Name: "PullRequestUrl", IsVisible: false, IsExcelExport: true }, { Name: "RowVersion", IsVisible: false },
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
