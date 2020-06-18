const AppAccount = require("../../entities/AppAccount");
const { AssignProporties, GetTextBox, GetButton } = require("../../Common");

//SystemManage/AppAccountEdit 200-299
const DataActionTypes = {
    //Get Entity Data
    GetEntityData: 200,
    //Save Entity Data
    SaveEntityData: 201
}

const Entity = { Name: AppAccount.Name, PrimaryKey: AppAccount.PrimaryKey }

module.exports = {
    Name: "AppAccountEdit",
    Type: "View",
    EventActions: GetEventActions(),
    Properties: AssignProporties({ Name: "AppAccountEdit" }, [GeEditView()])
}

function GeEditView() {
    return {
        Name: "AppAccountEdit2",
        Type: "RowsColsView",
        Entity: Entity,
        IsForm: true,
        EventActionName: "GetEntityData",
        IsClear: true,
        SaveEntityDataActionType: DataActionTypes.SaveEntityData,
        GetEntityDataActionType: DataActionTypes.GetEntityData,
        Properties: AssignProporties(AppAccount, GetProperties())
    }
}

function GetButtonProperties() {
    return [{
        Name: "LeftSpace1",
        Type: "WhiteSpace",
        ClassName: "ant-col ant-col-10 ant-form-item-label"
    },
    { ...GetButton("SaveEntityData", "保存", "primary"), EventActionName: "SaveEntityData", Style: { width: 84 } },
    { ...GetButton("BackToLast", "返回", ""), EventActionName: "BackToLast", Style: { marginLeft: 10 } }]
}

function GetProperties() {
    return [
        GetTextBox2("CompanyName", "公司名称", 1, 1, "", "请输入公司名称", 50, false),
        GetTextBox2("AccessPathName", "访问路径名", 1, 2, "", "请输入访问路径名", 50, false),
        GetTextBox2("LogoImageUrl", "公司Logo地址", 2, 1, "", "", 200, true),
        GetTextBox2("Address", "地址", 2, 2, "", "", 200, true),
        GetTextBox2("Linkman", "联系人", 3, 1, "", "", 50, true),
        GetTextBox2("Phone", "手机", 3, 2, "", "", 50, true),
        GetTextBox2("DeveloperWeChat", "开发者微信号", 4, 1, "", "请输入开发者微信号", 50, false),
        GetTextBox2("AppId", "微信AppId", 4, 2, "", "请输入微信AppId", 50, false),
        { ...GetTextArea("Secret", "微信Secret", 5, 1, "请输入微信Secret", 100), IsNullable: false },
        GetTextArea("Remark", "备注", 5, 2, "", 200),
        GetButtonView()
    ]
}
function GetTextBox2(Name, Label, X, Y, ContorlType, PlaceHolder, MaxLength, IsNullable, IsVisible, ValidateNames, ValidateTipMessage) {
    return {
        ...GetTextBox(Name, Label, ContorlType, X, Y, PlaceHolder, MaxLength || 50),
        ValidateNames, ValidateTipMessage,
        IsFormItem: true,
        ColSpan: 11,
        LabelCol: 6,
        WrapperCol: 18,
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
        X: 11,
        Y: 1,
        Properties: AssignProporties({ Name: "AppAccountEdit" }, GetButtonProperties())
    }
}

function GetTextArea(Name, Label, X, Y, PlaceHolder, MaxLength) {
    return {
        ...GetTextBox(Name, Label, "TextArea", X, Y, PlaceHolder, MaxLength),
        IsFormItem: true,
        IsNullable: true,
        IsEdit: true,
        Rows: 3,
        ColSpan: 11,
        LabelCol: 6,
        WrapperCol: 18,
    }
}

function GetEventActions() {
    return [{
        Name: "BackToLast",
        Type: "Page/ToPage",
        PageUrl: "/SystemManage/AppAccountList",
        ExpandSetPageUrl: "ExpandSetPageUrl"
    },
    {
        Name: "SaveEntityData",
        Type: "EntityEdit/SaveEntityData",
        EditView: "AppAccountEdit2",
        ExpandSetEntityData: "ExpandSetEntityData"
    },
    {
        Name: "GetEntityData",
        Type: "EntityEdit/GetEntityData",
        EditView: "AppAccountEdit2"
    }]
}