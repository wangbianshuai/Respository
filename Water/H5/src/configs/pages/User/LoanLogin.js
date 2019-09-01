import {AssignProporties, RegExpress} from "../Common";

//用户注册 100-199
const DataActionTypes = {
	//登录
	Login: 1900
};

export default {
	Name: "LoanLogin",
	Type: "View",
	SaveEntityDataActionType: DataActionTypes.Login,
	Properties: AssignProporties({}, GetProperties())
}

function GetProperties() {
	const list = [];
	let p = null;
	//手机号
	p = GetTextBox2("UserName", 100, "请输入用户名", "TextBox");
	list.push(p);
	
	//密码
	p = GetTextBox2("Password", 16, "请输入登录密码", "TextBox2", "DivTextBox2");
	p.RegExp = RegExpress.NoNumberChar;
	p.KeyPressRegExp = RegExpress.InputNumberChar;
	p.Type = "PasswordByEye";
	p.IsEdit = true;
	p.NullTipMessage = "请输入登录密码";
	list.push(p);
	
	return list;
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
	return {Name, Label, MaxLength, IsNullable, Type: "TextBox"}
}


