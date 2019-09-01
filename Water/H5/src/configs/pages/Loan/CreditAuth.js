
import {AssignProporties, GetTextBox, CreateGuid} from "../Common";

const DataActionTypes = {
	//查询授权
	QueryCreditAuthorize: 1700,
	
	sendCreditAuthorizeSms:1701,
	//确认授权
	creditAuthorize: 1799,
}

export default {
	Name: "CreditAuth",
	Type: "View",
	DialogViews: GetDialogViews(),
	EventActions: GetEventActions(),
	EventActionName: 'QueryCreditAuthorize',
	GetEntityDataActionType: DataActionTypes.QueryCreditAuthorize,
	Properties: {}
}


function GetDialogViews() {
	return [{
		Id: CreateGuid(),
		DialogId: CreateGuid(),
		Name: "VerifyCodeView",
		Entity: { PrimaryKey: "Id" },
		Type: "View",
		DialogTitle: "请输入验证码",
		OkEventActionName: "OkConfirmCreditAuth",//点击确认事件行为
		SaveEntityDataActionType: DataActionTypes.creditAuthorize,//对应具体业务 数据行为类型 102:发送验证码
		Properties: AssignProporties({}, [GetSmsVerifyCode()])
	}]
}

function GetTextBox2(name, maxLength, placeholder, className, divClassName) {
	const p = GetTextBox(name, "", maxLength, false);
	p.DivClassName = divClassName;
	p.PlaceHolder = placeholder;
	p.ClassName = className;
	p.NullTipMessage = placeholder;
	return p;
}

function GetSmsVerifyCode() {
	const p = GetTextBox2("smsVerificationCode", 4, "请输入验证码", "TextBox", "DivTextBox2 CreditAuthCodeBox");
	p.Type = "SmsCode";
	p.EventActionName = "SendVerifyCode";
	p.IsEdit = true;
	p.IsNullable = false;
	p.NullTipMessage = "请输入验证码";
	return p;
}

function GetEventActions() {
	return [
		{
			Name: "ShowVerifyCode",
			Type: "Dialog/ShowEntityEdit",
			DialogView: "VerifyCodeView"
		}]
}