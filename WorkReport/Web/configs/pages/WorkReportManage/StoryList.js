const Story = require("../../entities/Story");
const { GetButton, AssignProporties, GetTextBox } = require("../../Common");

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
      {
        ...GetTextBox2("StoryId", "Story Id", 1, 1, "", "Story Id"), DataType: "int",
        OperateLogic: "=", PressEnterEventActionName: "SearchQuery"
      },
      {
        ...GetTextBox2("Keyword", "Keyword", 1, 2, "", "Story Title/Story Url/Remark"), PropertyName: "StoryTitle,StoryUrl,Remark",
        OperateLogic: "like", PressEnterEventActionName: "SearchQuery"
      },
      { ...GetButton("Search", "Search", "primary", 1, 4), IsFormItem: true, Icon: "search", EventActionName: "SearchQuery", PressEnterEventActionName: "SearchQuery" },
      { ...GetButton("ClearQuery", "Clear", "default", 1, 5), IsFormItem: true, EventActionName: "ClearQuery" },
      { EventActionName: "ToEditPage", ...GetButton("ToEditPage", "Add", "primary", 2, 1), Style: { marginLeft: 16, marginBottom: 16 } },
      { EventActionName: "ExcelExport", ...GetButton("ExcelExport", "Excel Export", "default", 2, 2), Icon: "download", ColStyle: { paddingLeft: 0 } }
    ])
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
    Properties: AssignProporties(Story, ["StoryId", GetStoryTitle(), "Remark", { Name: "StoryUrl", IsVisible: false },
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
