import Basic from "../../entities/Basic";

import {AssignProporties, GetTextBox, GetButton, CreateGuid, ToRem} from "../Common";

//借款人基本信息 300-399
const DataActionTypes = {
    //获取实体数据
    GetEntityData: 300,
    //保存实体数据
    SaveEntityData: 399
}

export default {
    Name: "BasicInfo",
    Type: "View",
    Entity: Basic,
    EventActionName: "GetEntityData",
    SaveEntityDataActionType: DataActionTypes.SaveEntityData,
    GetEntityDataActionType: DataActionTypes.GetEntityData,
    EventActions: GetEventActions(),
    Style: {marginTop: ToRem(40)},
    Properties: AssignProporties({}, [GetBasicInfoView(),
        {
            ...GetButton("SaveBasic", "保存", "primary"),
            EventActionName: "SaveEntityData",
            Style: {marginTop: ToRem(40), marginBottom: ToRem(40)}
        },
    ])
}

function GetBasicInfoView() {
    return {
        Name: "BasicInfoList",
        Type: "DataListView",
        Title: "基本信息",
        DefaultValue: [{Id: CreateGuid()}],
        PrimaryKey: "Id",
        Properties: AssignProporties({}, GetHouseItemProperties())
    }
}

function GetHouseItemProperties() {
    return [
        GetTextBox1("borrowName", "借款人姓名", "", "请输入借款人姓名", 50, false, false),
        GetTextBox2("borrowIDCard", "身份证号", " ", "请输入借款人身份证号", 18, true),
        GetSelect("nationality", "民族", ""),
        GetTextBox2("borrowCardAdress", "身份证地址", "TextArea", "请输入身份证地址", 100, true, 2),
        GetTextBox2("borrowCardAuthority", "签发机关", "", "请输入身份证签发机关", 100, true),
        GetDateText2("identityValidityLimitStart", "证件有效期开始日期", "", "请选择", 100, true),
        GetDateText2("identityValidityLimitEnd", "证件有效期结束日期", "", "请选择", 100, true),

        GetTextBox1("borrowPhoneNumber", "常用手机号", "InputNumber", "请输入借款人常用手机号", 11, true, true),
        GetTextBox2("borrowEmail", "邮箱地址", "", "请输入邮箱地址", 100, true),
        GetSelect("borrowLevelEducation", "教育程度", "", "请输入借款人常用手机号", 100, true, true),
        GetSelect("borrowIsMarriage", "婚姻状况", GetMarriageStatusDataSource()),
        GetTextBox2("borrowMarriage", "已婚年限", "InputNumber", "请输入已婚年限", 100, true, '年'),
        GetTextBox2("borrowAdress", "现居住地址", "TextArea", "请输入现居住地址", 100, true, 2),
        GetSelect("companyAddrOwnerShip", "居住地是否租赁", GetCompanyHouseDataSource()),
        GetDateText2("companyAddrTimeLimitStart", "租赁有效期开始日期", "", "请选择", 100, true),
        GetDateText2("companyAddrTimeLimitEnd", "租赁有效期结束日期", "", "请选择", 100, true),
        GetTextBox2("borrowElectricityNumber", "居住地电费单号", "", "请输入居住地电费单号", 100, true),
    ]
}

function GetTextBox1(Name, Label, ContorlType, PlaceHolder, MaxLength, IsNullable, IsEdit) {
    return {
        ...GetTextBox(Name, Label, ContorlType, PlaceHolder, MaxLength),
        IsNullable: IsNullable,
        IsEdit: IsEdit,
        ClassName: "textBoxFirst"
    }
}

function GetTextBox2(Name, Label, ContorlType, PlaceHolder, MaxLength, IsNullable, Extra, rows) {
    return {
        ...GetTextBox(Name, Label, ContorlType, PlaceHolder, MaxLength),
        Extra,
        IsNullable: IsNullable,
        IsEdit: true,
        Rows: rows || 2
    }
}
function GetDateText2(name, label) {
    return {
        Label: label, Name: name, Type: "DatePicker", IsNullable: false, IsListItem: false, ClassName: "SelectItem1"
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

function GetCompanyHouseDataSource() {
    return [{Value: 0, Text: "租用"},
        {Value: 1, Text: "自有"}]
}

function GetEventActions() {
    return [
        {
            Name: "SaveEntityData",
            Type: "EntityEdit/SaveEntityData",
            EditView: "BasicInfo"
        },
        {
            Name: "GetEntityData",
            Type: "EntityEdit/GetEntityData",
            EditView: "BasicInfo"
        }]
}
