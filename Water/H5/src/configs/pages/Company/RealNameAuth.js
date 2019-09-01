import {AssignProporties, RegExpress, GetButton, GetImageProperty} from "../Common";

const DataActionTypes = {
	DoCompanyRealname: 500,
	
	EnterpriseOpenAcntProgressQuery:501,
	userInfoRate:502,
}

export default {
    Name: "CompanyRealNameAuth",
    Type: "View",
    // EventActions: GetEventActions(),
    EventActionName: 'EnterpriseOpenAcntProgressQuery',
    SaveEntityDataActionType: DataActionTypes.DoCompanyRealname,
    GetEntityDataActionType: DataActionTypes.EnterpriseOpenAcntProgressQuery,
    Properties: AssignProporties({}, GetProperties())
}

function GetProperties() {
    const list = [];
    let p = null;

    //请输入法人真实姓名
    p = GetTextBox2("realName", 50, "请输入法人真实姓名", "TextBox");
    p.IsEdit = true;
    list.push(p);

    //请输入法人身份证号码
    p = GetTextBox2("idCardNumber", 18, "请输入法人身份证号码", "TextBox");
    p.RegExp = RegExpress.NoNumberChar;
    p.KeyPressRegExp = RegExpress.InputNumberChar;
    p.IsEdit = true;
    list.push(p);

    //身份证正面
    p ={...GetImageProperty("positivePicID", "身份证正面",'companyRealnameAppro',false),IsEdit : true}
    list.push(p);

     //身份证反面
    p = {...GetImageProperty("negativePicID", "身份证反面",'companyRealnameAppro',false),IsEdit : true}
    list.push(p);


    // 请输入法人身份证号码
    p = GetButton("CompanyRealName", "下一步", "primary");
    p.EventActionName = "DoCompanyRealname";
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
//             Name: "DoCompanyRealname",
//             Type: "EntityEdit/SaveEntityData",
//             EditView: "CompanyRealNameAuth"
//         }
//         {
//             Name: "CompanyRealnameStatus",
//             Type: "EntityEdit/GetEntityData",
//             EditView: "CompanyRealNameAuth"
//         },
//     ]
// }