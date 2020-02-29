const Week = require("../../entities/Week");
const { AssignProporties, GetTextBox, GetButton, GetDatePicker } = require("../../Common");

//WorkReportManage/WeekEdit 400-299
const DataActionTypes = {
  //Get Entity Data
  GetEntityData: 400,
  //Save Entity Data
  SaveEntityData: 401
}

const Entity = { Name: Week.Name, PrimaryKey: Week.PrimaryKey }

module.exports = {
  Name: "WeekEdit",
  Type: "View",
  EventActions: GetEventActions(),
  Properties: AssignProporties({ Name: "WeekEdit" }, [GeEditView()])
}

function GeEditView() {
  return {
    Name: "WeekEdit2",
    Type: "RowsColsView",
    Entity: Entity,
    IsForm: true,
    EventActionName: "GetEntityData",
    IsClear: true,
    SaveEntityDataActionType: DataActionTypes.SaveEntityData,
    GetEntityDataActionType: DataActionTypes.GetEntityData,
    Properties: AssignProporties(Week, GetProperties())
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
    GetDatePicker2("StartDate", "Start Date", 1, 1, false, "Please select a date"),
    GetDatePicker2("EndDate", "End Date", 2, 1, false, "Please select a date"),
    { ...GetTextBox2("WorkingHours", "Working Hours", 3, 1, "", "Please input working hours", 2, false), DataType: "int" },
    GetTextArea("Remark", "备注", 4, 1),
    GetButtonView()
  ]
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

function GetButtonView() {
  return {
    Name: "ButtonView",
    Type: "View",
    ClassName: "DivCenterButton",
    IsDiv: true,
    IsFormItem: true,
    ColSpan: 24,
    X: 6,
    Y: 1,
    Properties: AssignProporties({ Name: "WeekEdit" }, GetButtonProperties())
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
    PageUrl: "/WorkReportManage/WeekList",
    ExpandSetPageUrl: "ExpandSetPageUrl"
  },
  {
    Name: "SaveEntityData",
    Type: "EntityEdit/SaveEntityData",
    EditView: "WeekEdit2",
    ExpandSetEntityData: "ExpandSetEntityData"
  },
  {
    Name: "GetEntityData",
    Type: "EntityEdit/GetEntityData",
    EditView: "WeekEdit2"
  }]
}