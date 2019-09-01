
import {AssignProporties, GetButton, GetImageProperty} from "../Common";


const DataActionTypes = {
    //企业认证
    AutoCompanyAppro: 900,
    //获取企业信息
    GetCompanyInfo: 901,
	EnterpriseOpenAcntProgressQuery:902
}

export default {
    Name: "EnterpriseAuth",
    Type: "View",
	EventActionName: 'EnterpriseOpenAcntProgressQuery',
    SaveEntityDataActionType: DataActionTypes.AutoCompanyAppro,
    GetEntityDataActionType: DataActionTypes.EnterpriseOpenAcntProgressQuery,
    Properties: AssignProporties({}, GetProperties())
}

function GetProperties() {
    const list = [];
    let p = null;

    //请输入公司全称
    p = GetTextBox2("companyName", 100, "请输入公司全称", "TextBox");
    p.IsEdit = false;
	p.IsView = true;
    // p.Disabled = true;
    list.push(p);

    //统一企业信用代码
    p = GetTextBox2("buslicenseno", 25, "三证合一的统一企业信用代码", "TextBox");
    p.IsEdit = true;
	p.IsView = true;
    list.push(p);

    //营业执照正本或副本
    p = GetImageProperty("buslicense_pic", "营业执照正本或副本",'companyRealnameAppro',false);
	p.IsEdit = true;
	p.IsView = true;
    list.push(p);

    p = GetButton("EnterpriseAuth", "下一步", "primary");
    p.EventActionName = "AutoCompanyAppro";
	p.IsView = false;
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

