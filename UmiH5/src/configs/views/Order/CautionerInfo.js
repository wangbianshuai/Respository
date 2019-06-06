import CautionerInfo from "../../entities/CautionerInfo";

import { AssignProporties, GetTextBox, GetButton, GetSelect } from "../../pages/Common";

var DataActionTypes = {}

export default (actionTypes) => {
    DataActionTypes = actionTypes;

    return {
        Name: "CautionerInfo",
        Type: "View",
        Properties: AssignProporties({}, [GetInfoView(), GetRightButtonView()])
    }
}

function GetInfoView() {
    return {
        Name: "CautionerInfo2",
        Type: "View",
        Title: "担保人信息",
        Style: { marginTop: 8 },
        Entity: CautionerInfo,
        EventActionName: "GetCautionerInfo",
        SaveEntityDataActionType: DataActionTypes.SaveCautionerInfo,
        GetEntityDataActionType: DataActionTypes.GetCautionerInfo,
        Properties: AssignProporties({}, [GetCautionerProperties()])
    }
}

function GetCautionerProperties() {
    return {
        Name: "CautionerList",
        Type: "DataListView",
        IsComplexEdit: true,
        IsFirstDelete: false,
        DeletePropertyName: "DeleteCautioner",
        PrimaryKey: "Id",
        Title: "担保人",
        Properties: AssignProporties({}, [{
            Name: "CautionerItemView",
            Type: "RowsColsView",
            IsForm: true,
            LabelAlign: "left",
            IsDiv: false,
            Properties: AssignProporties(CautionerInfo, GetItemProperties())
        }])
    }
}

function GetRightButtonView() {
    return {
        Name: "CautionerInfoButtonView",
        Type: "View",
        ClassName: "DivRightButton",
        IsDiv: true,
        Properties: AssignProporties({}, GetRightButtonProperties())
    }
}

function GetRightButtonProperties() {
    return [{ ...GetButton("AddCautioner", "新增", ""), EventActionName: "AddCautioner", Style: { marginRight: 10 }, Icon: "plus" },
    { ...GetButton("SaveCautionerInfo", "保存", "primary"), EventActionName: "SaveCautionerInfo", Style: { marginRight: 36, width: 84 } }]
}

function GetItemProperties() {
    return [
        { Name: "Title", Type: "SpanText", X: 1, Y: 1, ClassName: "SpanTitle" },
        { ...GetButton("DeleteCautioner", "删除", "", 1, 2), EventActionName: "DeleteCautioner", Style: { marginLeft: 20, marginBottom: 10 }, Icon: "delete" },
        GetEditSelect("UserType", "用户类型", CautionerInfo.UserTypeDataSource(), 2, 1, false, "请选择用户类型"),
        GetTextBox2("Name", "姓名/企业名称", 2, 2, "", "请输入姓名/企业名称", 50, false),
        GetTextBox3("IdNumber", "身份证号/统一社会信用代码", 2, 3, "", "请输入身份证号/统一社会信用代码", 50, false),
        GetTextBox3("Phone", "联系方式", 3, 1, "", "请输入联系方式", 50, false),
        GetTextBox3("Email", "邮箱", 3, 2, "", "请输入邮箱", 50, false),
        GetTextBox2("BankCardNo", "银行卡号", 3, 3, "", "请输入银行卡号", 20, false),
        GetTextBox3("OpenBank", "开户行", 4, 1, "", "请输入开户行", 50, false),
        GetTextBox3("BankInfo", "支行信息", 4, 2, "", "请输入支行信息", 50, false),
        GetEditSelect("CautionerType", "担保主体", CautionerInfo.CautionerTypeDataSource(), 4, 3, false, "请选择担保主体"),
        GetEditSelect("LoanRelation", "与借款主体关系", CautionerInfo.LoanRelationDataSource(), 5, 1, false, "请选择与借款主体关系"),
    ]
}

function GetEditSelect(Name, Label, DataSource, X, Y, IsNullable, PlaceHolder, DefaultValue) {
    return {
        ...GetSelect(Name, Label, DataSource, X, Y, DefaultValue),
        IsColon: false,
        IsFormItem: true, ColSpan: 8,
        LabelCol: 20,
        WrapperCol: 21,
        IsNullable: IsNullable,
        IsAddOptional: !!IsNullable,
        PlaceHolder: PlaceHolder,
        IsEdit: true,
        Style: {
            display: "flex",
            flexDirection: "column",
            marginBottom: 10
        }
    }
}

function GetTextBox3(Name, Label, X, Y, DataType, PlaceHolder, MaxLength, IsNullable, addonAfter) {
    return {
        ...GetTextBox2(Name, Label, X, Y, "", PlaceHolder, MaxLength, IsNullable, addonAfter),
        DataType
    }
}

function GetTextBox2(Name, Label, X, Y, ContorlType, PlaceHolder, MaxLength, IsNullable, addonAfter) {
    return {
        ...GetTextBox(Name, Label, ContorlType, X, Y, PlaceHolder, MaxLength),
        IsColon: false,
        IsFormItem: true, ColSpan: 8,
        LabelCol: 20,
        WrapperCol: 21,
        AddonAfter: addonAfter,
        IsNullable: IsNullable,
        IsAddOptional: !!IsNullable,
        IsEdit: true,
        Style: {
            display: "flex",
            flexDirection: "column",
            marginBottom: 10
        }
    }
}