const WorkingHours = require("../../entities/WorkingHours");
const { AssignProporties, GetTextBox, GetButton, GetSelect } = require("../../Common");

//WorkReportManage/WorkingHoursEdit 800-899
const DataActionTypes = {
  //Get Entity Data
  GetEntityData: 800,
  //Save Entity Data
  SaveEntityData: 801
}

const Entity = { Name: WorkingHours.Name, PrimaryKey: WorkingHours.PrimaryKey }

module.exports = {
  Name: "WorkingHoursEdit",
  Type: "View",
  EventActions: GetEventActions(),
  Properties: AssignProporties({ Name: "WorkingHoursEdit" }, [GeEditView()])
}

function GeEditView() {
  return {
    Name: "WorkingHoursEdit2",
    Type: "RowsColsView",
    Entity: Entity,
    IsForm: true,
    EventActionName: "GetEntityData",
    IsClear: true,
    SaveEntityDataActionType: DataActionTypes.SaveEntityData,
    GetEntityDataActionType: DataActionTypes.GetEntityData,
    Properties: AssignProporties(WorkingHours, GetProperties())
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
    GetEditSelect("WeekId", "Week", WorkingHours.WeekDataSource, 1, 1, false, "Please select week"),
    GetEditSelect("StoryId", "Story", WorkingHours.StoryDataSource, 2, 1, true, "Please select story or input content"),
    { ...GetTextArea("Content", "Content", 3, 1, 'Please select story or input content'), MaxLength: 500 },
    { ...GetTextBox2("HourCount", "Working Hours", 4, 1, "", "Please input working hours", 2, false), DataType: "int" },
    GetTextArea("Remark", "Remark", 5, 1),
    GetButtonView()
  ]
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
    X: 6,
    Y: 1,
    Properties: AssignProporties({ Name: "WorkingHoursEdit" }, GetButtonProperties())
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
    PageUrl: "/WorkReportManage/WorkingHoursList",
    ExpandSetPageUrl: "ExpandSetPageUrl"
  },
  {
    Name: "SaveEntityData",
    Type: "EntityEdit/SaveEntityData",
    EditView: "WorkingHoursEdit2",
    ExpandSetEntityData: "ExpandSetEntityData"
  },
  {
    Name: "GetEntityData",
    Type: "EntityEdit/GetEntityData",
    EditView: "WorkingHoursEdit2"
  }]
}