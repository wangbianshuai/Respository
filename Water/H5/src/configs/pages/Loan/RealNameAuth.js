import {AssignProporties, RegExpress, GetButton, GetImageProperty} from "../Common";

//借款人实名认证 700-799
const DataActionTypes = {
	//借款人实名认证
	DoLoanRealname: 700,
	//借款人实名认证
	DoLoanManualRealname: 702,
	
	DoRealnameStatus:703,
}

export default {
    Name: "LoanRealNameAuth",
    Type: "View",
    // EventActions: GetEventActions(),
    EventActionName: 'EnterpriseOpenAcntProgressQuery',
    SaveEntityDataActionType: DataActionTypes.DoLoanRealname,
    GetEntityDataActionType: DataActionTypes.DoRealnameStatus,
    Properties: AssignProporties({}, GetProperties())
}

function GetProperties() {
    const list = [];
    let p = null;

    //请输入借款人真实姓名
    p = GetTextBox2("realName", 50, "请输入借款人真实姓名", "TextBox");
    p.IsEdit = true;
    list.push(p);

    //请输入借款人身份证号码
    p = GetTextBox2("idCardNumber", 18, "请输入借款人身份证号码", "TextBox");
    p.RegExp = RegExpress.NoNumberChar;
    p.KeyPressRegExp = RegExpress.InputNumberChar;
    p.IsEdit = true;
    list.push(p);
	
	//身份证正面
	p ={...GetImageProperty("positivePicID", "身份证正面",'companyRealnameAppro',false,'USER_AUTHENTICATION'),IsEdit : true}
	list.push(p);
	
	//身份证反面
	p = {...GetImageProperty("negativePicID", "身份证反面",'companyRealnameAppro',false,'USER_AUTHENTICATION'),IsEdit : true}
	list.push(p);


    // 请输入借款人身份证号码
    p = GetButton("LoanRealName", "下一步", "primary");
    p.EventActionName = "DoLoanRealname";
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



// function GetEventActions() {
//     return [
//         {
//             Name: "SetDoLoanRealname",
//             Type: "EntityEdit/SaveEntityData",
//             EditView: "LoanRealNameAuth"
//         }
//     ]
// }