import Contact from "../../entities/Contact";

import {AssignProporties, GetTextBox, GetButton, CreateGuid, ToRem} from "../Common";

//借款人联系人信息 400-499
const DataActionTypes = {
    //获取实体数据
    GetEntityData: 400,
    //保存实体数据
    SaveEntityData: 499
}

export default {
    Name: "ContactInfo",
    Type: "View",
    Entity: Contact,
    EventActionName: "GetEntityData",
    SaveEntityDataActionType: DataActionTypes.SaveEntityData,
    GetEntityDataActionType: DataActionTypes.GetEntityData,
    EventActions: GetEventActions(),
    Properties: AssignProporties({}, [GetContactInfoView(),
        {
            ...GetButton("SaveContact", "保存", "primary"),
            EventActionName: "SaveEntityData",
            Style: {marginTop: ToRem(40), marginBottom: ToRem(40)}
        },
    ])
}

function GetContactInfoView() {
    return {
        Name: "ContactInfoList",
        Type: "DataListView",
        Title: "联系人信息",
        DefaultValue: [{Id: CreateGuid()}],
        PrimaryKey: "Id",
        Properties: AssignProporties({}, GetContactItemProperties())
    }
}

function GetContactItemProperties() {
    return [
        GetTitleView('亲属联系人'),
        GetTextBox2("FamilyContactName", "姓名", "", "请输入姓名", 50, true),
        GetTextBox2("FamilyContactPhoneNumber", "手机号", "", "请输入手机号码", 11, true),
        GetSelect("FamilyKinship", "关系", GetMarriageStatusDataSource() ),
        GetTitleView('单位联系人'),
        GetTextBox2("CompanyContactName", "姓名", "", "请输入姓名", 50, true),
        GetTextBox2("CompanyContactPhoneNumber", "手机号", "", "请输入手机号码", 11, true),
        GetSelect("CompanyContactKinship", "关系", GetMarriageStatusDataSource() ),
        GetTitleView('紧急联系人'),
        GetTextBox2("FamilyName", "姓名", "", "请输入姓名", 50, true),
        GetTextBox2("FamilyPhoneNumber", "手机号", "", "请输入手机号码", 11, true),
        GetSelect("FamilyKinship", "关系", GetMarriageStatusDataSource() )
    ]
}


function GetTitleView(Value) {
    return {
        Name: "Title",
        Type: "View",
        IsDiv:true,
        ClassName: "ContactListViewTitle",
        Properties: [{ Name: "Title", Type: "SpanText", ClassName: "SpanLabel",Value:Value}]
    }
}


function GetTextBox2(Name, Label, ContorlType, PlaceHolder, MaxLength, IsNullable, Extra) {
    return {
        ...GetTextBox(Name, Label, ContorlType, PlaceHolder, MaxLength),
        Extra,
        IsNullable: IsNullable,
        IsEdit: true,
    }
}


function GetSelect(name, label, dataSource) {
    return {
        Label: label,
        Name: name,
        Type: "Select",
        IsNullable: false,
        IsListItem: false,
        ClassName: "SelectItem1",
        DataSource: dataSource
    }
}


function GetMarriageStatusDataSource() {
    return [{Value: 0, Text: "未婚"},
        {Value: 1, Text: "已婚"}]
}

function GetEventActions() {
    return [
        {
            Name: "SaveEntityData",
            Type: "EntityEdit/SaveEntityData",
            EditView: "ContactInfo"
        },
        {
            Name: "GetEntityData",
            Type: "EntityEdit/GetEntityData",
            EditView: "ContactInfo"
        }]
}
