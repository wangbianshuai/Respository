const Week = require("../../entities/Week");
const { GetButton, AssignProporties, GetDatePicker } = require("../../Common");

//WorkReportManage/WeekList 200-299
const DataActionTypes = {
  //Search Query
  SearchQuery: 200,
  //Delete Entity Data
  DeleteEntityData: 201,
  //Excel Export
  ExcelExport: 202
};

const Entity = { Name: Week.Name, PrimaryKey: Week.PrimaryKey, ViewName: "ViewWeek" }

module.exports = {
  Name: "WeekList",
  Type: "View",
  EventActions: GetEventActions(),
  Properties: AssignProporties({ Name: "WeekList" }, [GetSearchOperationView(), GetDataGridView()])
}

function GetSearchOperationView() {
  return {
    Name: "SearchOperationView1",
    Entity: Entity,
    Type: "RowsColsView",
    ClassName: "DivSerachView",
    Properties: AssignProporties({ Name: "WeekList" }, [
      { ...GetDatePicker2("StartDate", "Start Date", 1, 1, "Greater than or equal to its value"), PropertyName: "StartDate", OperateLogic: ">=" },
      { ...GetDatePicker2("EndDate", "To", 1, 2, "Less than its value"), PropertyName: "StartDate", OperateLogic: "<" },
      { ...GetDatePicker2("StartDate2", "End Date", 2, 1, "Greater than or equal to its value"), PropertyName: "EndDate", OperateLogic: ">=" },
      { ...GetDatePicker2("EndDate2", "To", 2, 2, "Less than its value"), PropertyName: "EndDate", OperateLogic: "<" },
      { ...GetButton("Search", "Search", "primary", 2, 3), IsFormItem: true, Icon: "search", EventActionName: "SearchQuery", PressEnterEventActionName: "SearchQuery" },
      { ...GetButton("ClearQuery", "Clear", "default", 2, 4), IsFormItem: true, EventActionName: "ClearQuery" },
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
    Properties: AssignProporties(Week, ["StartDate", "EndDate", "WorkingHours", "Remark",
      { Name: "CreateDate", OrderByType: "desc" }, { Name: "RowVersion", IsVisible: false }, GetOperation()])
  }
}

function GetOperation() {
  return {
    Name: "Operation",
    Label: "Operation",
    IsData: false,
    ActionList: AssignProporties(Week, [GetEditAction(), GetDeleteAction()])
  }
}

function GetEditAction() {
  return {
    Name: "EditWeek",
    Label: "Edit",
    EventActionName: "EditWeek",
    Type: "AButton"
  }
}

function GetDeleteAction() {
  return {
    Name: "DeleteWeek",
    Label: "Delete",
    Type: "Popconfirm",
    EventActionName: "DeleteWeek",
    DataActionType: DataActionTypes.DeleteEntityData,
    SuccessTip: "Delete Succeed!",
    Title: "Please confirm whether to delete the current Week?"
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
    Name: "EditWeek",
    Type: "DataGridView/SelectRowToPage",
    DataGridView: "DataGridView1",
    AlertMessage: "AlertMessage",
    PageUrl: "/WorkReportManage/WeekEdit?Id=#{Id}&MenuName=" + escape("Edit"),
    ExpandSetPageUrl: "ExpandSetPageUrl"
  },
  {
    Name: "ToEditPage",
    Type: "Page/ToPage",
    PageUrl: "/WorkReportManage/WeekEdit",
    ExpandSetPageUrl: "ExpandSetPageUrl"
  },
  {
    Name: "DeleteWeek",
    Type: "DataGrid/BatchUpdateRowDataList",
    DataGridView: "DataGridView1"
  }]
}
