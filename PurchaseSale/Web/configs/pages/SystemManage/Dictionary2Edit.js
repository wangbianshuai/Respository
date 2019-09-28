const Dictionary2 = require("../../entities/Dictionary2");
const { AssignProporties, GetTextBox, GetButton } = require("../../Common");

//系统管理/键值配置编辑 100-199
const DataActionTypes = {
    //获取实体数据
    GetEntityData: 100,
    //保存实体数据
    SaveEntityData: 101
}

const Entity = { Name: Dictionary2.Name, PrimaryKey: Dictionary2.PropertyPrimaryKey || Dictionary2.PrimaryKey }

module.exports = {
    Name: "Dictionary2Edit",
    Type: "View",
    EventActions: GetEventActions(),
    Properties: AssignProporties({ Name: "Dictionary2Edit" }, [GeEditView()])
}

function GeEditView() {
    return {
        Name: "Dictionary2Edit2",
        Type: "RowsColsView",
        Entity: Entity,
        IsForm: true,
        EventActionName: "GetEntityData",
        IsClear: true,
        SaveEntityDataActionType: DataActionTypes.SaveEntityData,
        GetEntityDataActionType: DataActionTypes.GetEntityData,
        Properties: AssignProporties(Dictionary2, GetProperties())
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
        GetTextBox2("Name", "名称", 1, 1, "", "请输入名称", 50, false),
        GetTextArea("Value", "值", 2, 1, "请输入值"),
        GetTextArea("Remark", "备注", 3, 1),
        GetButtonView()
    ]
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
        Properties: AssignProporties({ Name: "Dictionary2Edit" }, GetButtonProperties())
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
        WrapperCol: 10
    }
}

function GetTextBox2(Name, Label, X, Y, ContorlType, PlaceHolder, MaxLength, IsNullable, IsVisible, ValidateNames, ValidateTipMessage) {
    return {
        ...GetTextBox(Name, Label, ContorlType, X, Y, PlaceHolder, MaxLength || 50),
        ValidateNames, ValidateTipMessage,
        IsFormItem: true,
        ColSpan: 24,
        LabelCol: 8,
        WrapperCol: 10,
        IsNullable,
        IsVisible,
        IsEdit: true
    }
}

function GetEventActions() {
    return [{
        Name: "BackToLast",
        Type: "Page/ToPage",
        PageUrl: "/SystemManage/Dictionary2List"
    },
    {
        Name: "SaveEntityData",
        Type: "EntityEdit/SaveEntityData",
        EditView: "Dictionary2Edit2"
    },
    {
        Name: "GetEntityData",
        Type: "EntityEdit/GetEntityData",
        EditView: "Dictionary2Edit2"
    }]
}