const PullRequest = require("../../entities/PullRequest");
const { GetButton, AssignProporties, GetTextBox, GetSelect, GetDatePicker } = require("../../Common");

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
      { EventActionName: "ExcelExport", ...GetButton("ExcelExport", "Excel Export", "primary", 4, 1), Icon: "download", Style: { marginLeft: 16, marginBottom: 16 } }
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
