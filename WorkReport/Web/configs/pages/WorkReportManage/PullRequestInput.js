const PullRequest = require("../../entities/PullRequest");
const { AssignProporties, GetTextBox, GetButton, GetSelect, GetDatePicker } = require("../../Common");

//WorkReportManage/PullRequestEdit 1000-1099
const DataActionTypes = {
  //Get Entity Data
  GetEntityData: 1000,
  //Save Entity Data
  SaveEntityData: 1001
}

const Entity = { Name: PullRequest.Name, PrimaryKey: PullRequest.PrimaryKey }

module.exports = {
  Name: "PullRequestEdit",
  Type: "View",
  EventActions: GetEventActions(),
  Properties: AssignProporties({ Name: "PullRequestEdit" }, [GeEditView()])
}

function GeEditView() {
  return {
    Name: "PullRequestEdit2",
    Type: "RowsColsView",
    Entity: Entity,
    IsForm: true,
    EventActionName: "GetEntityData",
    IsClear: true,
    SaveEntityDataActionType: DataActionTypes.SaveEntityData,
    GetEntityDataActionType: DataActionTypes.GetEntityData,
    Properties: AssignProporties(PullRequest, GetProperties())
  }
}

function GetButtonProperties() {
  return [{
    Name: "LeftSpace1",
    Type: "WhiteSpace",
    ClassName: "ant-col ant-col-8 ant-form-item-label"
  },
  { ...GetButton("SaveEntityData", "Save", "primary"), EventActionName: "SaveEntityData", Style: { width: 84 } },
  { ...GetButton("BackToLast", "Back", ""), EventActionName: "BackToLast", Style: { marginLeft: 10 } }]
}

function GetProperties() {
  return [
    GetEditSelect("StoryId", "Story", PullRequest.StoryDataSource, 1, 1, false, "Please select story"),
    { ...GetTextArea("PullRequestTitle", "Pull Request Title", 2, 1, 'Please input pull request title'), IsNullable: false, MaxLength: 500 },
    GetTextBox2("PullRequestUrl", "PullRequest url", 3, 1, "", "Please input pull request url", 200, false),
    { ...GetTextBox2("TestCases", "Test Cases", 4, 1, "", "Please input test cases", 10, false), DataType: "int" },
    { ...GetTextBox2("Comments", "Comments", 5, 1, "", "Please input comments", 10, false), DataType: "int" },
    GetDatePicker2("StartDate", "Start Date", 6, 1, true, ""),
    GetDatePicker2("EndDate", "End Date", 7, 1, true, ""),
    GetTextArea("Remark", "Remark", 8, 1),
    GetButtonView()
  ]
}

function GetDatePicker2(Name, Label, X, Y, IsNullable, PlaceHolder, DefaultValue) {
  return {
    ...GetDatePicker(Name, Label, X, Y, DefaultValue),
    IsFormItem: true, ColSpan: 24,
    LabelCol: 8,
    WrapperCol: 8,
    IsNullable: IsNullable,
    PlaceHolder: PlaceHolder,
    IsEdit: true
  }
}

function GetEditSelect(Name, Label, DataSource, X, Y, IsNullable, PlaceHolder, DefaultValue) {
  return {
    ...GetSelect(Name, Label, null, X, Y, DefaultValue),
    IsFormItem: true,
    ColSpan: 24,
    LabelCol: 8,
    WrapperCol: 8,
    IsNullable,
    IsEdit: true,
    AllowClear: true, IsSearch: true,
    ServiceDataSource: DataSource,
    PlaceHolder: PlaceHolder
  }
}

function GetTextBox2(Name, Label, X, Y, ContorlType, PlaceHolder, MaxLength, IsNullable, IsVisible, ValidateNames, ValidateTipMessage) {
  return {
    ...GetTextBox(Name, Label, ContorlType, X, Y, PlaceHolder, MaxLength || 50),
    ValidateNames, ValidateTipMessage,
    IsFormItem: true,
    ColSpan: 24,
    LabelCol: 8,
    WrapperCol: 8,
    IsNullable,
    IsVisible,
    IsEdit: true
  }
}

function GetButtonView() {
  return {
    Name: "ButtonView",
    Type: "View",
    ClassName: "DivCenterButton",
    IsDiv: true,
    IsFormItem: true,
    ColSpan: 24,
    X: 9,
    Y: 1,
    Properties: AssignProporties({ Name: "PullRequestEdit" }, GetButtonProperties())
  }
}

function GetTextArea(Name, Label, X, Y, PlaceHolder) {
  return {
    ...GetTextBox(Name, Label, "TextArea", X, Y),
    IsFormItem: true,
    IsNullable: true,
    IsEdit: true,
    ColSpan: 24,
    Rows: 3,
    PlaceHolder,
    LabelCol: 8,
    WrapperCol: 8
  }
}

function GetEventActions() {
  return [{
    Name: "BackToLast",
    Type: "Page/ToPage",
    PageUrl: "/WorkReportManage/PullRequestList",
    ExpandSetPageUrl: "ExpandSetPageUrl"
  },
  {
    Name: "SaveEntityData",
    Type: "EntityEdit/SaveEntityData",
    EditView: "PullRequestEdit2",
    ExpandSetEntityData: "ExpandSetEntityData"
  },
  {
    Name: "GetEntityData",
    Type: "EntityEdit/GetEntityData",
    EditView: "PullRequestEdit2"
  }]
}