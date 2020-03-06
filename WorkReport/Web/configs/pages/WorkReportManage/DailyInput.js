const Daily = require("../../entities/Daily");
const { AssignProporties, GetTextBox, GetButton, GetSelect, GetDatePicker } = require("../../Common");

//WorkReportManage/DailyEdit 1200-1299
const DataActionTypes = {
  //Get Entity Data
  GetEntityData: 1200,
  //Save Entity Data
  SaveEntityData: 1201
}

const Entity = { Name: Daily.Name, PrimaryKey: Daily.PrimaryKey }

module.exports = {
  Name: "DailyEdit",
  Type: "View",
  EventActions: GetEventActions(),
  Properties: AssignProporties({ Name: "DailyEdit" }, [GeEditView()])
}

function GeEditView() {
  return {
    Name: "DailyEdit2",
    Type: "RowsColsView",
    Entity: Entity,
    IsForm: true,
    EventActionName: "GetEntityData",
    IsClear: true,
    SaveEntityDataActionType: DataActionTypes.SaveEntityData,
    GetEntityDataActionType: DataActionTypes.GetEntityData,
    Properties: AssignProporties(Daily, GetProperties())
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
    GetEditSelect("StoryId", "Story", Daily.StoryDataSource, 1, 1, true, "Please select story or input content"),
    { ...GetTextArea("Content", "Content", 2, 1, 'Please select story or input content'), MaxLength: 500, IsNullable: false },
    { ...GetTextBox2("HoursCount", "Hours", 3, 1, "", "Please input hours", 4, false), DataType: "float" },
    GetDatePicker2("WorkingDate", "Working Date", 4, 1, false, "Please select a date"),
    GetTextArea("Remark", "Remark", 5, 1),
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
    IsEdit: true,
    IsCurrentDay: true
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
    Properties: AssignProporties({ Name: "DailyEdit" }, GetButtonProperties())
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
    PageUrl: "/WorkReportManage/DailyList",
    ExpandSetPageUrl: "ExpandSetPageUrl"
  },
  {
    Name: "SaveEntityData",
    Type: "EntityEdit/SaveEntityData",
    EditView: "DailyEdit2",
    ExpandSetEntityData: "ExpandSetEntityData"
  },
  {
    Name: "GetEntityData",
    Type: "EntityEdit/GetEntityData",
    EditView: "DailyEdit2"
  }]
}