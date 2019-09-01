import { AssignProporties, RegExpress, CreateGuid } from "../Common";

//用户注册 100-199
const DataActionTypes = {
    //注册
    RegisterUser: 100,
    //检查手机号唯一性
    CheckPhoneUnique: 101,
    //发送验证码
    SendVerifyCode: 102
}

export default {
    Name: "Register",
    Type: "View",
    DialogViews: GetDialogViews(),
    EventActions: GetEventActions(),
    SaveEntityDataActionType: DataActionTypes.RegisterUser,
	SuccessTip:'注册成功',
    Properties: AssignProporties({}, GetProperties())
}

function GetProperties() {
    const list = [];
    let p = null;

    p = { Name: "UserType", Type: "SegmentedControl", IsEdit: true, DataSource: GetUserTypeDataSource(), ClassName: "UserTypeSegmented" };
    list.push(p);

    //企业名称
    p = GetTextBox2("CompanyName", 100, "请输入公司全称", "TextBox");
    p.IsEdit = true;
    p.IsNullable = true;
    list.push(p);

    //手机号
    p = GetTextBox2("Phone", 11, "请输入您的手机号", "TextBox");
    p.RegExp = RegExpress.NoNumber;
    p.KeyPressRegExp = RegExpress.InputNumber;
    p.IsEdit = true;
    list.push(p);

    //验证码
    p = GetTextBox2("VerifyCode", 4, "请输入验证码", "TextBox", "DivTextBox2");
    p.Type = "SmsVerifyCode";
    p.EventActionName = "CheckPhoneUnique";
    p.IsEdit = true;
    list.push(p);

    //密码
    p = GetTextBox2("Password", 16, "请输入(6-16位字母+数字)", "TextBox2", "DivTextBox2");
    p.RegExp = RegExpress.NoNumberChar;
    p.KeyPressRegExp = RegExpress.InputNumberChar;
    p.Type = "PasswordByEye";
    p.IsEdit = true;
    p.NullTipMessage = "请设置登录密码";
    list.push(p);

    //同意协议
    p = GetCheckBox("Agreement", "我已阅读并同意");
    p.DefaultValue = true;
    p.IsAgree = true;
    p.IsEdit = true;
    p.ClassName = "CheckBox";
    list.push(p);

    list.push(GetButton());

    return list;
}

function GetButton() {
    return { Name: "RegButton", Type: "PressButton", EventActionName: "RegisterUser", Text: "注 册", DivClassName: "RegButton", PressClassName: "RegPre", NoPressClassName: "RegNor", };
}

function GetTextBox2(name, maxLength, placeholder, className, divClassName) {
    const p = GetTextBox(name, "", maxLength, false);
    p.DivClassName = divClassName;
    p.PlaceHolder = placeholder;
    p.ClassName = className;
    p.NullTipMessage = placeholder;
    return p;
}

function GetTextBox(Name, Label, MaxLength, IsNullable) {
    return { Name, Label, MaxLength, IsNullable, Type: "TextBox" }
}

function GetCheckBox(Name, Label) {
    return { Name, Label, Type: "CheckBox" }
}

function GetEventActions() {
    return [{
        Name: "RegisterUser",
        Type: "EntityEdit/SaveEntityData",
        EditView: "Register"
    },
    {
        Name: "SendVerifyCode",
        Type: "EntityEdit/SaveEntityData"
    },
    {
        Name: "ShowVerifyCode",
        Type: "Dialog/ShowEntityEdit",
        DialogView: "VerifyCodeView"
    }]
}

function GetDialogViews() {
    return [{
        Id: CreateGuid(),
        DialogId: CreateGuid(),
        Name: "VerifyCodeView",
        Entity: { PrimaryKey: "Id" },
        Type: "View",
        DialogTitle: "请输入验证码",
        OkEventActionName: "SendVerifyCode",//点击确认事件行为
        SaveEntityDataActionType: DataActionTypes.SendVerifyCode,//对应具体业务 数据行为类型 102:发送验证码
        Properties: AssignProporties({}, [GetImageVerifyCode()])
    }]
}

function GetImageVerifyCode() {
    const p = GetTextBox2("ImageVerifyCode", 4, "输入验证码", "VerifyCode", "phoneCode");
    p.Type = "ImageVerifyCode";
    p.IsEdit = true;
    p.IsNullable = false;
    p.NullTipMessage = "请输入图片验证码";
    return p;
}

function GetUserTypeDataSource() {
    return [{ Value: 3, Text: "企业" }, { Value: 1, Text: "个人" }, ]
}