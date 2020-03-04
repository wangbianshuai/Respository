const Story = require("../../entities/Story");
const { GetButton, AssignProporties, GetTextBox, GetDatePicker } = require("../../Common");

//WorkReportManage/StoryList 500-599
const DataActionTypes = {
  //Search Query
  SearchQuery: 500,
  //Delete Entity Data
  DeleteEntityData: 501,
  //Excel Export
  ExcelExport: 502
};

const Entity = { Name: Story.Name, PrimaryKey: Story.PrimaryKey, ViewName: "ViewStory" }

module.exports = {
  Name: "StoryList",
  Type: "View",
  EventActions: GetEventActions(),
  Properties: AssignProporties({ Name: "StoryList" }, [GetSearchOperationView(), GetDataGridView()])
}

function GetSearchOperationView() {
  return {
    Name: "SearchOperationView1",
    Entity: Entity,
    Type: "RowsColsView",
    ClassName: "DivSerachView",
    Properties: AssignProporties({ Name: "StoryList" }, [
      { ...GetDatePicker2("StartDate", "Start Date", 1, 1, "Greater than or equal to its value"), PropertyName: "StartDate", OperateLogic: ">=" },
      { ...GetDatePicker2("EndDate", "To", 1, 2, "Less than its value"), PropertyName: "StartDate", OperateLogic: "<" },
      {
        ...GetTextBox2("StoryId", "Story Id", 1, 3, "", "Story Id"), DataType: "int",
        OperateLogic: "=", PressEnterEventActionName: "SearchQuery"
      },
      { ...GetDatePicker2("StartDate2", "End Date", 2, 1, "Greater than or equal to its value"), PropertyName: "EndDate", OperateLogic: ">=" },
      { ...GetDatePicker2("EndDate2", "To", 2, 2, "Less than its value"), PropertyName: "EndDate", OperateLogic: "<" },

      {
        ...GetTextBox2("Keyword", "Keyword", 2, 3, "", "Story Title/Story Url/Remark"), PropertyName: "StoryTitle,StoryUrl,Remark",
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
    Properties: AssignProporties(Story, ["StoryId", GetStoryTitle(), { Name: "StoryUrl", IsVisible: false, IsExcelExport: true },
      "StartDate", "EndDate", { Name: "StartMonth", IsVisible: false, IsExcelExport: true },
      { Name: "EndMonth", IsVisible: false, IsExcelExport: true }, "Remark",
      { Name: "CreateUserName", Label: "User", IsVisible: false, IsExcelExport: true },
      { Name: "CreateDate", OrderByType: "desc" }, { Name: "RowVersion", IsVisible: false }, GetOperation()])
  }
}

function GetStoryTitle() {
  return {
    Name: "StoryTitle",
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
    ActionList: AssignProporties(Story, [GetEditAction(), GetDeleteAction()])
  }
}

function GetEditAction() {
  return {
    Name: "EditStory",
    Label: "Edit",
    EventActionName: "EditStory",
    Type: "AButton"
  }
}

function GetDeleteAction() {
  return {
    Name: "DeleteStory",
    Label: "Delete",
    Type: "Popconfirm",
    EventActionName: "DeleteStory",
    DataActionType: DataActionTypes.DeleteEntityData,
    SuccessTip: "Delete Succeed!",
    Title: "Please confirm whether to delete the current Story?"
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
    Name: "EditStory",
    Type: "DataGridView/SelectRowToPage",
    DataGridView: "DataGridView1",
    AlertMessage: "AlertMessage",
    PageUrl: "/WorkReportManage/StoryEdit?Id=#{Id}&MenuName=" + escape("Edit"),
    ExpandSetPageUrl: "ExpandSetPageUrl"
  },
  {
    Name: "ToEditPage",
    Type: "Page/ToPage",
    PageUrl: "/WorkReportManage/StoryEdit",
    ExpandSetPageUrl: "ExpandSetPageUrl"
  },
  {
    Name: "DeleteStory",
    Type: "DataGrid/BatchUpdateRowDataList",
    DataGridView: "DataGridView1"
  }]
}
