const WorkingHours = require("../../entities/WorkingHours");
const { GetButton, AssignProporties, GetTextBox, GetSelect } = require("../../Common");

//WorkReportManage/WorkingHoursList 700-799
const DataActionTypes = {
  //Search Query
  SearchQuery: 700,
  //Delete Entity Data
  DeleteEntityData: 701,
  //Excel Export
  ExcelExport: 702
};

const Entity = { Name: WorkingHours.Name, PrimaryKey: WorkingHours.PrimaryKey, ViewName: "ViewWorkingHours" };

module.exports = {
  Name: "WorkingHoursList",
  Type: "View",
  EventActions: GetEventActions(),
  Properties: AssignProporties({ Name: "WorkingHoursList" }, [GetSearchOperationView(), GetDataGridView()])
}

function GetSearchOperationView() {
  return {
    Name: "SearchOperationView1",
    Entity: Entity,
    Type: "RowsColsView",
    ClassName: "DivSerachView",
    Properties: AssignProporties({ Name: "WorkingHoursList" }, [
      GetEditSelect("WeekId", "Week", WorkingHours.WeekDataSource, 1, 1),
      GetEditSelect("StoryId", "Story", WorkingHours.StoryDataSource, 1, 2),
      GetEditSelect("CreateUser", "User", WorkingHours.UserDataSource, 2, 1),
      {
        ...GetTextBox2("Keyword", "Keyword", 2, 2, "", "Story Id/Story Title/Remark"), PropertyName: "StoryName,Remark",
        OperateLogic: "like", PressEnterEventActionName: "SearchQuery"
      },
      { ...GetButton("Search", "Search", "primary", 2, 4), IsFormItem: true, Icon: "search", EventActionName: "SearchQuery", PressEnterEventActionName: "SearchQuery" },
      { ...GetButton("ClearQuery", "Clear", "default", 2, 5), IsFormItem: true, EventActionName: "ClearQuery" },
      { EventActionName: "ToEditPage", ...GetButton("ToEditPage", "Add", "primary", 3, 1), Style: { marginLeft: 16, marginBottom: 16 } },
      { EventActionName: "ExcelExport", ...GetButton("ExcelExport", "Excel Export", "default", 3, 2), Icon: "download", ColStyle: { paddingLeft: 0 } }
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
    Properties: AssignProporties(WorkingHours, ["CreateUserName", "WeekName", "WeekWorkingHours", GetStory(), "Content", "HourCount", "Remark", { Name: "StoryUrl", IsVisible: false },
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
    ActionList: AssignProporties(WorkingHours, [GetEditAction(), GetDeleteAction()])
  }
}

function GetEditAction() {
  return {
    Name: "EditWorkingHours",
    Label: "Edit",
    EventActionName: "EditWorkingHours",
    IsSelfOperation: true,
    Type: "AButton"
  }
}

function GetDeleteAction() {
  return {
    Name: "DeleteWorkingHours",
    Label: "Delete",
    Type: "Popconfirm",
    EventActionName: "DeleteWorkingHours",
    IsSelfOperation: true,
    DataActionType: DataActionTypes.DeleteEntityData,
    SuccessTip: "Delete Succeed!",
    Title: "Please confirm whether to delete the current WorkingHours?"
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
    Name: "EditWorkingHours",
    Type: "DataGridView/SelectRowToPage",
    DataGridView: "DataGridView1",
    AlertMessage: "AlertMessage",
    PageUrl: "/WorkReportManage/WorkingHoursEdit?Id=#{Id}&MenuName=" + escape("Edit"),
    ExpandSetPageUrl: "ExpandSetPageUrl"
  },
  {
    Name: "ToEditPage",
    Type: "Page/ToPage",
    PageUrl: "/WorkReportManage/WorkingHoursEdit",
    ExpandSetPageUrl: "ExpandSetPageUrl"
  },
  {
    Name: "DeleteWorkingHours",
    Type: "DataGrid/BatchUpdateRowDataList",
    DataGridView: "DataGridView1"
  }]
}
