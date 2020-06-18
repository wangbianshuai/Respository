const DictionaryConfig = require("../../entities/DictionaryConfig");
const { AssignProporties, GetTextBox, GetButton } = require("../../Common");

//SystemManage/DictionaryConfigEdit 700-799
const DataActionTypes = {
  //Get Entity Data
  GetEntityData: 700,
  //Save Entity Data
  SaveEntityData: 701
}

const Entity = { Name: DictionaryConfig.Name, PrimaryKey: DictionaryConfig.PrimaryKey }

module.exports = {
  Name: "DictionaryConfigEdit",
  Type: "View",
  EventActions: GetEventActions(),
  Properties: AssignProporties({ Name: "DictionaryConfigEdit" }, [GeEditView()])
}

function GeEditView() {
  return {
    Name: "DictionaryConfigEdit2",
    Type: "RowsColsView",
    Entity: Entity,
    IsForm: true,
    EventActionName: "GetEntityData",
    IsClear: true,
    SaveEntityDataActionType: DataActionTypes.SaveEntityData,
    GetEntityDataActionType: DataActionTypes.GetEntityData,
    Properties: AssignProporties(DictionaryConfig, GetProperties())
  }
}

function GetButtonProperties() {
  return [{
    Name: "LeftSpace1",
    Type: "WhiteSpace",
    ClassName: "ant-col ant-col-8 ant-form-item-label"
  },
  { ...GetButton("SaveEntityData", "保存", "primary"), EventActionName: "SaveEntityData", Style: { width: 84 } },
  { ...GetButton("BackToLast", "返回", ""), EventActionName: "BackToLast", Style: { marginLeft: 10 } }]
}

function GetProperties() {
  return [
    GetTextBox2("Name", "键名", 1, 1, "", "请输入键名", 50, false),
    { ...GetTextArea("Value", "值", 2, 1, ''), MaxLength: 500 },
    GetTextBox2("TypeName", "类型名", 3, 1, "", "", 50, true),
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

function GetButtonView() {
  return {
    Name: "ButtonView",
    Type: "View",
    ClassName: "DivCenterButton",
    IsDiv: true,
    IsFormItem: true,
    ColSpan: 24,
    X: 5,
    Y: 1,
    Properties: AssignProporties({ Name: "DictionaryConfigEdit" }, GetButtonProperties())
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
    PageUrl: "/SystemManage/DictionaryConfigList",
    ExpandSetPageUrl: "ExpandSetPageUrl"
  },
  {
    Name: "SaveEntityData",
    Type: "EntityEdit/SaveEntityData",
    EditView: "DictionaryConfigEdit2",
    ExpandSetEntityData: "ExpandSetEntityData"
  },
  {
    Name: "GetEntityData",
    Type: "EntityEdit/GetEntityData",
    EditView: "DictionaryConfigEdit2"
  }]
}