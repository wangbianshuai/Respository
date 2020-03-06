const Daily = require("../../entities/Daily");
const { GetButton, AssignProporties, GetTextBox, GetSelect, GetDatePicker } = require("../../Common");

//WorkReportManage/DailyList 1000-1199
const DataActionTypes = {
  //Search Query
  SearchQuery: 1100,
  //Delete Entity Data
  DeleteEntityData: 1101,
  //Excel Export
  ExcelExport: 1102
};

const Entity = { Name: Daily.Name, PrimaryKey: Daily.PrimaryKey, ViewName: "ViewDaily" };

module.exports = {
  Name: "DailyList",
  Type: "View",
  EventActions: GetEventActions(),
  Properties: AssignProporties({ Name: "DailyList" }, [GetSearchOperationView(), GetDataGridView()])
}

function GetSearchOperationView() {
  return {
    Name: "SearchOperationView1",
    Entity: Entity,
    Type: "RowsColsView",
    ClassName: "DivSerachView",
    Properties: AssignProporties({ Name: "DailyList" }, [
      GetEditSelect("StoryId", "Story", Daily.StoryDataSource, 1, 1, true),
      { ...GetDatePicker2("StartDate", "Working Date", 1, 2, "Greater than or equal to its value"), PropertyName: "WorkingDate", OperateLogic: ">=" },
      { ...GetDatePicker2("EndDate", "To", 1, 3, "Less than its value"), PropertyName: "WorkingDate", OperateLogic: "<" },
      GetEditSelect("CreateUser", "User", Daily.UserDataSource, 2, 1),
      {
        ...GetTextBox2("Keyword", "Keyword", 2, 3, "", "Story Id/Story Title/Content/Remark"), PropertyName: "StoryName,Content,Remark",
        OperateLogic: "like", PressEnterEventActionName: "SearchQuery"
      },
      { ...GetButton("Search", "Search", "primary", 2, 4), IsFormItem: true, Icon: "search", EventActionName: "SearchQuery", PressEnterEventActionName: "SearchQuery" },
      { ...GetButton("ClearQuery", "Clear", "default", 2, 5), IsFormItem: true, EventActionName: "ClearQuery" },
      { EventActionName: "ToEditPage", ...GetButton("ToEditPage", "Add", "primary", 3, 1), Style: { marginLeft: 16, marginBottom: 16 } },
      { EventActionName: "ExcelExport", ...GetButton("ExcelExport", "Excel Export", "default", 3, 2), Icon: "download", ColStyle: { paddingLeft: 0 } }
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
    Properties: AssignProporties(Daily, ["CreateUserName", GetStory(), "Content", "HoursCount", "WorkingDate", "Remark", { Name: "StoryUrl", IsVisible: false },
      { Name: "CreateDate", OrderByType: "desc" }, { Name: "RowVersion", IsVisible: false }, { Name: "CreateUser", IsVisible: false }, GetOperation()])
  }
}

function GetStory() {
  return {
    Name: "StoryName",
    IsOpenPage: true,
    IsHttp: true,
    PageUrl: "#{StoryUrl}"
  }
}

function GetOperation() {
  return {
    Name: "Operation",
    Label: "Operation",
    IsData: false,
    SelfPropertyName: "CreateUser",
    ActionList: AssignProporties(Daily, [GetEditAction(), GetDeleteAction()])
  }
}

function GetEditAction() {
  return {
    Name: "EditDaily",
    Label: "Edit",
    EventActionName: "EditDaily",
    IsSelfOperation: true,
    Type: "AButton"
  }
}

function GetDeleteAction() {
  return {
    Name: "DeleteDaily",
    Label: "Delete",
    Type: "Popconfirm",
    EventActionName: "DeleteDaily",
    IsSelfOperation: true,
    DataActionType: DataActionTypes.DeleteEntityData,
    SuccessTip: "Delete Succeed!",
    Title: "Please confirm whether to delete the current Daily?"
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
    Name: "EditDaily",
    Type: "DataGridView/SelectRowToPage",
    DataGridView: "DataGridView1",
    AlertMessage: "AlertMessage",
    PageUrl: "/WorkReportManage/DailyInput?Id=#{Id}",
    ExpandSetPageUrl: "ExpandSetPageUrl"
  },
  {
    Name: "ToEditPage",
    Type: "Page/ToPage",
    PageUrl: "/WorkReportManage/DailyInput",
    ExpandSetPageUrl: "ExpandSetPageUrl"
  },
  {
    Name: "DeleteDaily",
    Type: "DataGrid/BatchUpdateRowDataList",
    DataGridView: "DataGridView1"
  }]
}
