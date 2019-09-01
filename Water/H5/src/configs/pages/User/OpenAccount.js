import {AssignProporties, GetTextBox} from "../Common";

const DataActionTypes = {
	//用户实名认证
	UserRealName: 1100,
	//获取已开户用户帐户信息
	GetUserAccount: 1101,
	//获取富友跳转
	GetFuyouJump: 1102,
	//用户信息获取是否已开户
	UserInfo:1103
}

export default {
    Name: "OpenAccount",
    Type: "View",
    EventActions: GetEventActions(),
    SaveEntityDataActionType: DataActionTypes.UserOpenAccount,
    Properties: AssignProporties({}, GetProperties())
}

function GetProperties() {
    return [
        GetTextBox2("realName", "姓名", "", "请输入姓名", 50, true, true, '' ,""),
        GetTextBox2("idCardNumber", "身份证号", " ", "请输入身份证号", 18, true, true),
        GetCheckBox("Agreement", "我已阅读并同意", true, true, true, "OpenAccountCheckBox"),
        // GetCheckBoxView(),
        GetButton()

    ]
}

function GetButton() {
    return {Name: "userOpenAccountButton", Type: "Button", EventActionName: "UserOpenAccount", Text: "前往开户", ButtonType:"primary",};
}

function GetTextBox2(Name, Label, ContorlType, PlaceHolder, MaxLength, IsNullable, IsEdit,Extra, ClassName) {
    return {
        ...GetTextBox(Name, Label, ContorlType, PlaceHolder, MaxLength),
        Extra,
        IsNullable: IsNullable,
        NullTipMessage:PlaceHolder,
        IsEdit,
        ClassName,

    }
}

function GetCheckBox(Name, Label, DefaultValue, IsAgree, IsEdit, ClassName) {
    return {
    	Name, Label, Type: "CheckBox",DefaultValue, IsAgree, IsEdit, ClassName,
		ValueChangeEventActionName:'AgreementValueChange'
    }
}
//
// function GetCheckBoxView() {
//     return {
//         Name: "CheckBoxView",
//         Type: "View",
//         ClassName:"OpenAccountCheckBoxView",
//         IsFlex: true,
//         FlexProps: { direction: "row", align: "between" },
//         Properties: AssignProporties({}, GetCheckBoxViewProperties())
//     }
// }

// function GetCheckBoxViewProperties() {
//     return [
//         { ...GetCheckBox("Agreement", "我已阅读并同意", true, true, true, "OpenAccountCheckBox")},
//         { Name: "Title", Type: "ASpanText", ClassName: "SpanLabel",  Text: "《用户授权协议》", Href:'/modal/licensingAgreement' }
//     ]
// }

function GetEventActions() {
    return [
        {
            Name: "UserOpenAccount",
            Type: "EntityEdit/SaveEntityData",
            EditView: "OpenAccount"
        }
    ]
}


