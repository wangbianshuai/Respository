const User = require("../../entities/User");
const { AssignProporties, GetTextBox, GetButton } = require("../../Common");

//配置管理/用户编辑 700-799
const DataActionTypes = {
    //获取实体数据
    GetEntityData: 700,
    //保存实体数据
    SaveEntityData: 701
}

const Entity = { Name: User.Name, PrimaryKey: User.PropertyPrimaryKey || User.PrimaryKey }

module.exports = {
    Name: "UserEdit",
    Type: "View",
    EventActions: GetEventActions(),
    Properties: AssignProporties({ Name: "UserEdit" }, [GeEditView()])
}

function GeEditView() {
    return {
        Name: "UserEdit2",
        Type: "RowsColsView",
        Entity: Entity,
        IsForm: true,
        EventActionName: "GetEntityData",
        IsClear: true,
        SaveEntityDataActionType: DataActionTypes.SaveEntityData,
        GetEntityDataActionType: DataActionTypes.GetEntityData,
        Properties: AssignProporties(User, GetProperties())
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
        GetTextBox2("LoginName", "登录名", 1, 1, "", "请输入登录名", 50, false),
        GetTextBox2("UserName", "用户名", 2, 1, "", "请输入用户名", 50, false),
        { ...GetTextBox2("LoginPassword", "登录密码", 3, 1, "", "请输入登录密码", 50, false), IsJudgeNullable: false, ControlType: "password" },
        { ...GetTextBox2("LoginAgainPassword", "确认确认", 4, 1, "", "请输入确认确认", 50, false), IsJudgeNullable: false, ControlType: "password" },
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
        Properties: AssignProporties({ Name: "UserEdit" }, GetButtonProperties())
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
        PageUrl: "/SystemManage/UserList"
    },
    {
        Name: "SaveEntityData",
        Type: "EntityEdit/SaveEntityData",
        EditView: "UserEdit2",
        ExpandSetEntityData: "ExpandSetUserData"
    },
    {
        Name: "GetEntityData",
        Type: "EntityEdit/GetEntityData",
        EditView: "UserEdit2"
    }]
}