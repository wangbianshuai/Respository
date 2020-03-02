const Story = require("../../entities/Story");
const { AssignProporties, GetTextBox, GetButton, GetDatePicker } = require("../../Common");

//WorkReportManage/StoryEdit 600-699
const DataActionTypes = {
  //Get Entity Data
  GetEntityData: 600,
  //Save Entity Data
  SaveEntityData: 601
}

const Entity = { Name: Story.Name, PrimaryKey: Story.PrimaryKey }

module.exports = {
  Name: "StoryEdit",
  Type: "View",
  EventActions: GetEventActions(),
  Properties: AssignProporties({ Name: "StoryEdit" }, [GeEditView()])
}

function GeEditView() {
  return {
    Name: "StoryEdit2",
    Type: "RowsColsView",
    Entity: Entity,
    IsForm: true,
    EventActionName: "GetEntityData",
    IsClear: true,
    SaveEntityDataActionType: DataActionTypes.SaveEntityData,
    GetEntityDataActionType: DataActionTypes.GetEntityData,
    Properties: AssignProporties(Story, GetProperties())
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
    { ...GetTextBox2("StoryId", "Story Id", 1, 1, "", "Please input story id", 10, false), DataType: "int" },
    { ...GetTextArea("StoryTitle", "Story Title", 2, 1, 'Please input story title'), IsNullable: false, MaxLength: 1000 },
    GetTextBox2("StoryUrl", "Story url", 3, 1, "", "Please input story url", 200, false),
    GetDatePicker2("StartDate", "Start Date", 4, 1, true, ""),
    GetDatePicker2("EndDate", "End Date", 5, 1, true, ""),
    GetTextArea("Remark", "Remark", 6, 1),
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
    X: 7,
    Y: 1,
    Properties: AssignProporties({ Name: "StoryEdit" }, GetButtonProperties())
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
    PageUrl: "/WorkReportManage/StoryList",
    ExpandSetPageUrl: "ExpandSetPageUrl"
  },
  {
    Name: "SaveEntityData",
    Type: "EntityEdit/SaveEntityData",
    EditView: "StoryEdit2",
    ExpandSetEntityData: "ExpandSetEntityData"
  },
  {
    Name: "GetEntityData",
    Type: "EntityEdit/GetEntityData",
    EditView: "StoryEdit2"
  }]
}