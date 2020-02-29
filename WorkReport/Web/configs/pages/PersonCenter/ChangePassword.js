const { AssignProporties, GetTextBox, GetButton } = require("../../Common");

//修改密码 4100-4199
const DataActionTypes = {
    //获取实体数据
    ChangePassword: 4100
}

module.exports = {
    Name: "ChangePasswordView",
    Type: "View",
    EventActions: GetEventActions(),
    Properties: AssignProporties({ Name: "ChangePassword" }, [GeEditView()])
}

function GetButtonProperties() {
    return [{
        Name: "LeftSpace1",
        Type: "WhiteSpace",
        ClassName: "ant-col ant-col-8 ant-form-item-label"
    },
    { ...GetButton("SaveEntityData", "保存", "primary"), EventActionName: "SaveEntityData", Style: { width: 84 } }]
}

function GeEditView() {
    return {
        Name: "ChangePasswordView2",
        Type: "RowsColsView",
        IsForm: true,
        IsClear: true,
        SuccessTip: "修改成功",
        SaveEntityDataActionType: DataActionTypes.ChangePassword,
        Properties: AssignProporties({ Name: "ChangePassword" }, GetProperties())
    }
}

function GetProperties() {
    return [
        { ...GetTextBox2("OldPassword", "原密码", 1, 1, "", "请输入原密码", 50, false), ControlType: "password" },
        { ...GetTextBox2("NewPassword", "新密码", 2, 1, "", "请输入新密码", 50, false), ControlType: "password" },
        { ...GetTextBox2("AgainNewPassword", "确认密码", 3, 1, "", "请输入确认密码", 50, false), ControlType: "password" },
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
        Properties: AssignProporties({ Name: "ChangePassword" }, GetButtonProperties())
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
        Name: "SaveEntityData",
        Type: "EntityEdit/SaveEntityData",
        EditView: "ChangePasswordView2"
    }]
}