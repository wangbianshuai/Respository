import Blacklist from "../../entities/Blacklist";
import { AssignProporties, GetTextBox, GetRadio, GetButton } from "../Common";

//客户管理/黑名单编辑 3500-3599
const DataActionTypes = {
    //获取实体数据
    GetEntityData: 3500,
    //保存实体数据
    SaveEntityData: 3501
}

export default {
    Name: "BlacklistEdit",
    GetEntityData: DataActionTypes.GetEntityData,
    EventActions: GetEventActions(),
    Properties: AssignProporties({}, [GeEditView()])
}

function GeEditView() {
    return {
        Name: "BlacklistEdit2",
        Type: "RowsColsView",
        Entity: Blacklist,
        IsForm: true,
        EventActionName: "GetEntityData",
        SaveEntityDataActionType: DataActionTypes.SaveEntityData,
        GetEntityDataActionType: DataActionTypes.GetEntityData,
        Properties: AssignProporties({}, GetProperties())
    }
}

function GetButtonProperties() {
    return [{
        Name: "LeftSpace1",
        Type: "WhiteSpace",
        ClassName: "ant-col ant-col-8 ant-form-item-label"
    },
    { ...GetButton("SaveEntityData", "提交", "primary"), EventActionName: "SaveEntityData", Style: { width: 84 } },
    { ...GetButton("BackToLast", "返回", ""), EventActionName: "BackToLast", Style: { marginLeft: 10 } }]
}

function GetProperties() {
    return [
        GetUserType(),
        GetTextBox2("Name", "姓名", 2, 1, "", "请输入姓名", 50, false),
        GetTextBox2("IdNumber", "身份证号", 3, 1, "", "请输入身份证号", 20, false),
        GetTextBox2("CompanyName", "企业名称", 2, 1, "", "请输入公司名称", 50, false, false),
        GetTextBox2("CompanyIdNumber", "统一社会信用代码", 3, 1, "", "请输入统一社会信用代码", 20, false, false),
        GetTextBox3("Phone", "手机号码", 4, 1, "int", "请输入手机号码", 11, false),
        GetTextArea("Remark", "备注", 5, 1),
        GetButtonView()
    ]
}

function GetButtonView() {
    return {
        Name: "ButtonView",
        Type: "View",
        ClassName: "DivCenterButton",
        IsDiv: true,
        IsFormItem: true,
        ColSpan: 24,
        Properties: AssignProporties({}, GetButtonProperties())
    }
}

function GetTextArea(Name, Label, X, Y) {
    return {
        ...GetTextBox(Name, Label, "TextArea", X, Y),
        IsFormItem: true,
        IsNullable: true,
        IsEdit: true,
        ColSpan: 24,
        Rows: 3,
        LabelCol: 8,
        WrapperCol: 8
    }
}

function GetUserType() {
    return {
        ...GetRadio("UserType", "用户类型", GetUserTypeDataSource(), 1, 1, "1", 160),
        IsFormItem: true,
        ColSpan: 24,
        IsLoadValue: true,
        LabelCol: 8,
        WrapperCol: 8,
        ValueVisibleProperties: { "1": ["Name", "IdNumber"], "2": ["CompanyName", "CompanyIdNumber"] },
        IsEdit: true
    }
}

function GetTextBox2(Name, Label, X, Y, ContorlType, PlaceHolder, MaxLength, IsNullable, IsVisible) {
    return {
        ...GetTextBox(Name, Label, ContorlType, X, Y, PlaceHolder, MaxLength || 50),
        IsFormItem: true,
        ColSpan: 24,
        LabelCol: 8,
        WrapperCol: 8,
        IsNullable,
        IsVisible,
        IsEdit: true
    }
}

function GetEventActions() {
    return [{
        Name: "BackToLast",
        Type: "Page/ToPage",
        PageUrl: "/Customer/BlacklistManage"
    },
    {
        Name: "SaveEntityData",
        Type: "EntityEdit/SaveEntityData",
        EditView: "BlacklistEdit2"
    },
    {
        Name: "GetEntityData",
        Type: "EntityEdit/GetEntityData",
        EditView: "BlacklistEdit2"
    }]
}

function GetUserTypeDataSource() {
    return [{ Value: "1", Text: "个人" }, { Value: "2", Text: "企业" }]
}

function GetTextBox3(Name, Label, X, Y, DataType, PlaceHolder, MaxLength, IsNullable, addonAfter) {
    return {
        ...GetTextBox2(Name, Label, X, Y, "", PlaceHolder, MaxLength, IsNullable, addonAfter),
        DataType
    }
}