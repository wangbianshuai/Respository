// import Contact from "../../entities/Contact";

import {AssignProporties, GetTextBox, GetButton, CreateGuid, ToRem} from "../Common";

//借款人联系人信息 400-499
const DataActionTypes = {
	GetContactInfo: 400,
	SaveContactInfo: 499
}

export default {
    Name: "ContactInfo",
    Type: "View",
    EventActionName: "GetContactInfo",
    SaveEntityDataActionType: DataActionTypes.SaveContactInfo,
    GetEntityDataActionType: DataActionTypes.GetContactInfo,
    EventActions: GetEventActions(),
    Properties: AssignProporties({}, GetContactItemProperties())
}

function GetContactItemProperties() {
    return [
        GetTitleView('亲属联系人'),
        GetTextBox2("kinsfolkContactName", "姓名", "", "请输入姓名", 50, true),
        GetTextBox2("kinsfolkContactMobile", "手机号", "", "请输入手机号码", 11, true),
        GetSelect("kinsfolkContactRelation", "关系", GetKinsfolkDataSource() ),
		GetTextBox2("kinsfolkContactAddr", "居住地址", "TextArea", "请具体至门牌号", '', true, '',"TextItem2"),
        GetTitleView('单位联系人'),
        GetTextBox2("companyContactName", "姓名", "", "请输入姓名", 50, true),
        GetTextBox2("companyContactMobile", "手机号", "", "请输入手机号码", 11, true),
        GetSelect("companyContactRelation", "关系", GetCompanyDataSource() ),
		GetTextBox2("companyContactAddr", "居住地址", "TextArea", "请具体至门牌号", '', true, '',"TextItem2"),
        GetTitleView('紧急联系人'),
        GetTextBox2("urgencyContactName", "姓名", "", "请输入姓名", 50, true),
        GetTextBox2("urgencyContactMobile", "手机号", "", "请输入手机号码", 11, true),
        GetSelect("urgencyContactRelation", "关系", GetUrgencyDataSource() ),
		GetTextBox2("urgencyContactAddr", "居住地址", "TextArea", "请具体至门牌号", '', true, '',"TextItem2"),
		{
			...GetButton("SaveContact", "保存", "primary"),
			EventActionName: "SaveContactInfo",
			Style: {marginTop: ToRem(40), marginBottom: ToRem(40)}
		}
    ]
}


function GetTitleView(Value) {
    return {
        Name: "Title",
        Type: "View",
        IsFlex:true,
        ClassName: "ContactListViewTitle",
        FlexProps: { direction: "row", justify: "center", align: "between" },
        Properties: [{ Id: CreateGuid(),Name: "Title", Type: "SpanText", ClassName: "SpanLabel",Value:Value}]
    }
}


function GetTextBox2(Name, Label, ContorlType, PlaceHolder, MaxLength, IsNullable, Extra, ClassName) {
    return {
        ...GetTextBox(Name, Label, ContorlType, PlaceHolder, MaxLength),
        Extra,
        IsNullable: IsNullable,
        IsEdit: true,
		ClassName,
    }
}


function GetSelect(name, label, dataSource) {
    return {
        Label: label,
        Name: name,
        Type: "Select",
        IsNullable: true,
        IsListItem: false,
		IsEdit: true,
        ClassName: "SelectItem1",
        DataSource: dataSource
    }
}


function GetKinsfolkDataSource() {
    return [{Value: '01', Text: "夫妻"},
        {Value: '02', Text: "父母"},
	{Value: '03', Text: "兄弟"}]
}

function GetCompanyDataSource() {
	return [{Value: '01', Text: "上级"},
		{Value: '02', Text: "下级"},
		{Value: '03', Text: "同事"}]
}

function GetUrgencyDataSource() {
	return [{Value: '01', Text: "亲属"},
		{Value: '02', Text: "同事"},
		{Value: '03', Text: "朋友"}]
}

function GetEventActions() {
    return [
        {
            Name: "SaveContactInfo",
            Type: "EntityEdit/SaveEntityData",
            EditView: "ContactInfo"
        },
        {
            Name: "GetContactInfo",
            Type: "EntityEdit/GetEntityData",
            EditView: "ContactInfo"
        }]
}
