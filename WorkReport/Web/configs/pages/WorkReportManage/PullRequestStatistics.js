const PullRequest = require("../../entities/PullRequest");
const { GetButton, AssignProporties, GetTextBox, GetSelect } = require("../../Common");

//WorkReportManage/PullRequestStatistics 1300-1399
const DataActionTypes = {
  //搜索查询
  SearchQuery: 1300,
  //Excel导出
  ExcelExport: 1301
};

const Entity = { Name: PullRequest.Name, PrimaryKey: PullRequest.PrimaryKey, ViewName: "ViewPullRequest", }

module.exports = {
  Name: "PullRequestStatistics",
  Type: "View",
  EventActions: GetEventActions(),
  Properties: AssignProporties({ Name: "PullRequestStatistics" }, [GetSearchOperationView(), GetDataGridView()])
}

function GetSearchOperationView() {
  return {
    Name: "SearchOperationView1",
    Entity: Entity,
    Type: "RowsColsView",
    ClassName: "DivSerachView",
    Properties: AssignProporties({ Name: "PullRequestStatistics" }, [
      GetEditSelect("StoryId", "Story", PullRequest.StoryDataSource, 1, 1),
      GetEditSelect("CreateUser", "User", PullRequest.UserDataSource, 1, 2),
      {
        ...GetTextBox2("Keyword", "Keyword", 1, 3, "", "Pull Request Title/Remark"), PropertyName: "PullRequestTitle,Remark",
        OperateLogic: "like", PressEnterEventActionName: "SearchQuery"
      },
      { ...GetButton("Search", "Query", "primary", 1, 4), IsFormItem: true, Icon: "search", EventActionName: "SearchQuery", PressEnterEventActionName: "SearchQuery" },
      { ...GetButton("ClearQuery", "Clear", "default", 1, 5), IsFormItem: true, EventActionName: "ClearQuery" },
      { EventActionName: "ExcelExport", ...GetButton("ExcelExport", "Excel Export", "primary", 3, 1), Icon: "download", Style: { marginLeft: 16, marginBottom: 16 } }
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
    SetColumnsEventActionName: "SetShowColumns",
    IsPartPaging: true,
    IsGroupByQuery: true,
    Properties: AssignProporties(PullRequest, ["CreateUserName", "StoryName", "PullRequestTitle", { Name: "CreateDate", OrderByType: "desc", IsVisible: false },
      GetExpression("TestCases"), GetExpression("Comments")])
  }
}

function GetExpression(Name) {
  return {
    Name,
    GroupByExpression: `sum(${Name})`
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
    Name: "SetShowColumns",
    Type: "DataGrid/SetDataGridShowColumns",
    DataGridView: "DataGridView1"
  }]
}
