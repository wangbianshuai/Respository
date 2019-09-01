import {AssignProporties, RegExpress, GetButton, GetImageProperty} from "../Common";

const DataActionTypes = {
	//银行认证
	AutoCompanyBankAppro: 1200,
	//获取银行信息
	GetBranchInfoByBranchCode: 1201,
	//验证银行卡唯一
	CheckBankNoIsUse: 1202,
	
	EnterpriseOpenAcntProgressQuery:1203,
	
	ManualCompanyBankAppro:1204
}

export default {
	Name: "AccountInfoAuth",
	Type: "View",
	EventActionName: 'GetBranchInfoByBranchCode',
	SaveEntityDataActionType: DataActionTypes.AutoCompanyBankAppro,
	GetEntityDataActionType: DataActionTypes.GetBranchInfoByBranchCode,
	Properties: AssignProporties({}, GetProperties())
}

function GetProperties() {
	const list = [];
	let p = null;
	
	//请输入联行号
	p = GetTextBox2("branchCode", 12, "请输入联行号", "TextBox");
	p.IsEdit = true;
	p.RegExp = RegExpress.NoNumber;
	p.KeyPressRegExp = RegExpress.InputNumber;
	list.push(p);
	
	//请输入基本户或一般户银行卡号
	p = GetTextBox2("comBankNo", 30, "请输入基本户或一般户银行卡号", "TextBox");
	p.IsEdit = true;
	p.RegExp = RegExpress.NoNumber;
	p.KeyPressRegExp = RegExpress.InputNumber;
	list.push(p);
	
	p = GetImageProperty("openAccAppro_pic", "基本户请上传开户许可证，一般户请上传印鉴卡", 'companyBankAuth', false);
	p.IsEdit = true;
	list.push(p);
	
	// 请输入法人身份证号码
	p = GetButton("NextStepButton", "下一步", "primary");
	p.EventActionName = "OnNextStep";
	p.IsEdit = false;
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

