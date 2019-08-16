const RegExp = require("../../entities/RegExp");
const { AssignProporties, GetTextBox, GetButton } = require("../../Common");

//配置管理/正则表达式编辑 500-599
const DataActionTypes = {
    //获取实体数据
    GetEntityData: 500,
    //保存实体数据
    SaveEntityData: 501
}

const Entity = { Name: RegExp.Name, PrimaryKey: RegExp.PropertyPrimaryKey || RegExp.PrimaryKey }

module.exports = {
    Name: "RegExpEdit",
    Type: "View",
    ModelsConfig: RegExp.GetModelsConfig,
    ActonOptions: GetActionOptions(),
    EventActions: GetEventActions(),
    Properties: AssignProporties({ Name: "RegExpEdit" }, [GeEditView()])
}

function GetActionOptions() {
    return { Name: "ConfigManage_RegExpEdit", ServiceName: "RegExpService", MinActionType: 500, MaxActionType: 599, ActionTypes: DataActionTypes }
}

function GeEditView() {
    return {
        Name: "RegExpEdit2",
        Type: "RowsColsView",
        Entity: Entity,
        IsForm: true,
        EventActionName: "GetEntityData",
        IsClear: true,
        SaveEntityDataActionType: DataActionTypes.SaveEntityData,
        GetEntityDataActionType: DataActionTypes.GetEntityData,
        Properties: AssignProporties(RegExp, GetProperties())
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
        GetTextBox2("Connection_String", "表达式", 2, 1, "", "请输入表达式", 1000, true),
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
        Properties: AssignProporties({ Name: "RegExpEdit" }, GetButtonProperties())
    }
}

function GetTextArea(Name, Label, X, Y) {
    return {
        ...GetTextBox(Name, Label, "TextArea", X, Y),
        IsFormItem: true,
        IsNullable: true,
        IsEdit: true,
        ColSpan: 24,
        Rows: 3,
        LabelCol: 8,
        WrapperCol: 8
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

function GetEventActions() {
    return [{
        Name: "BackToLast",
        Type: "Page/ToPage",
        PageUrl: "/ConfigManage/RegExpList"
    },
    {
        Name: "SaveEntityData",
        Type: "EntityEdit/SaveEntityData",
        EditView: "RegExpEdit2"
    },
    {
        Name: "GetEntityData",
        Type: "EntityEdit/GetEntityData",
        EditView: "RegExpEdit2"
    }]
}