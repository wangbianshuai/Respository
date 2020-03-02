const WorkingHours = require("../../entities/WorkingHours");
const { GetButton, AssignProporties, GetTextBox, GetSelect } = require("../../Common");

//WorkReportManage/WorkingHoursStatistics 1400-1499
const DataActionTypes = {
  //搜索查询
  SearchQuery: 1400,
  //Excel导出
  ExcelExport: 1401
};

const Entity = { Name: WorkingHours.Name, PrimaryKey: WorkingHours.PrimaryKey, ViewName: "ViewWorkingHours", }

module.exports = {
  Name: "WorkingHoursStatistics",
  Type: "View",
  EventActions: GetEventActions(),
  Properties: AssignProporties({ Name: "WorkingHoursStatistics" }, [GetSearchOperationView(), GetDataGridView()])
}

function GetSearchOperationView() {
  return {
    Name: "SearchOperationView1",
    Entity: Entity,
    Type: "RowsColsView",
    ClassName: "DivSerachView",
    Properties: AssignProporties({ Name: "WorkingHoursStatistics" }, [
      GetEditSelect("WeekId", "Week", WorkingHours.WeekDataSource, 1, 1),
      GetEditSelect("StoryId", "Story", WorkingHours.StoryDataSource, 1, 2),
      GetEditSelect("CreateUser", "User", WorkingHours.UserDataSource, 2, 1),
      {
        ...GetTextBox2("Keyword", "Keyword", 2, 2, "", "Story Id/Story Title/Remark"), PropertyName: "StoryName,Content,Remark",
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
    Properties: AssignProporties(WorkingHours, ["CreateUserName", "WeekName", "WeekWorkingHours", "StoryName", { Name: "CreateDate", OrderByType: "desc", IsVisible: false },
      GetExpression("HourCount")])
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
