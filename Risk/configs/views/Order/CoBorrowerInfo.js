const CoBorrowerInfo = require("../../entities/CoBorrowerInfo");

const { AssignProporties, GetTextBox, GetButton, GetSelect } = require("../../Common");

var DataActionTypes = {}

module.exports = (actionTypes) => {
    DataActionTypes = actionTypes;

    return {
        Name: "CoBorrowerInfo",
        Type: "View",
        Properties: AssignProporties({ Name: "CoBorrowerInfo" }, [GetInfoView(), GetRightButtonView()])
    }
}

function GetInfoView() {
    return {
        Name: "CoBorrowerInfo2",
        Type: "View",
        Title: "共借人信息",
        Style: { marginTop: 8 },
        Entity: CoBorrowerInfo,
        EventActionName: "GetCoBorrowerInfo",
        SaveEntityDataActionType: DataActionTypes.SaveCoBorrowerInfo,
        GetEntityDataActionType: DataActionTypes.GetCoBorrowerInfo,
        Properties: AssignProporties({ Name: "CoBorrowerInfo" }, [GetCoBorrowerProperties()])
    }
}

function GetCoBorrowerProperties() {
    return {
        Name: "CoBorrowerList",
        Type: "DataListView",
        IsComplexEdit: true,
        IsEdit: true,
        IsFirstDelete: false,
        DeletePropertyName: "DeleteCoBorrower",
        PrimaryKey: "Id",
        Title: "共同借款人",
        IsNullable: false,
        Properties: AssignProporties({ Name: "CoBorrowerInfo" }, [{
            Name: "CoBorrowerItemView",
            Type: "RowsColsView",
            IsForm: true,
            LabelAlign: "left",
            IsDiv: false,
            Properties: AssignProporties(CoBorrowerInfo, GetItemProperties())
        }])
    }
}

function GetRightButtonView() {
    return {
        Name: "CoBorrowerInfoButtonView",
        Type: "View",
        ClassName: "DivRightButton",
        IsDiv: true,
        Properties: AssignProporties({ Name: "CoBorrowerInfo" }, GetRightButtonProperties())
    }
}

function GetRightButtonProperties() {
    return [{ ...GetButton("AddCoBorrower", "新增", ""), EventActionName: "AddCoBorrower", Style: { marginRight: 10 }, Icon: "plus" },
    { ...GetButton("SaveCoBorrowerInfo", "保存", "primary"), Text2: "修改", EventActionName: "SaveCoBorrowerInfo", Style: { marginRight: 36, width: 84 } }]
}

function GetItemProperties() {
    return [
        { Name: "Title", Type: "SpanText", X: 1, Y: 1, ClassName: "SpanTitle", Label: "（选填）" },
        { ...GetButton("DeleteCoBorrower", "删除", "", 1, 2), IsDisabled: true, RightNames: ["CoBorrowerInfoButtonView"], EventActionName: "DeleteCoBorrower", Style: { marginLeft: 20, marginBottom: 10 }, Icon: "delete" },
        {
            ...GetEditSelect("UserType", "用户类型", CoBorrowerInfo.UserTypeDataSource, 2, 1, false, "请选择用户类型"),
            IsLoadValue: true,
            ValueVisibleProperties: { "01": ["Name", "IdNumber"], "02": ["CompanyName", "CompanyIdNumber"] }
        },
        { ...GetTextBox2("Name", "姓名", 2, 2, "", "请输入姓名", 50, false), IsColVisible: true },
        { ...GetTextBox3("IdNumber", "身份证号", 2, 3, "", "请输入身份证号", 50, false), IsColVisible: true },
        { ...GetTextBox2("CompanyName", "企业名称", 2, 2, "", "企业名称", 50, false), IsVisible: false, IsColVisible: true },
        { ...GetTextBox3("CompanyIdNumber", "统一社会信用代码", 2, 3, "", "统一社会信用代码", 50, false), IsVisible: false, IsColVisible: true },
        GetTextBox3("Phone", "联系方式", 3, 1, "", "请输入联系方式", 50, false),
        GetTextBox3("Email", "邮箱", 3, 2, "", "请输入邮箱", 50, false),
        GetEditSelect("CautionerType", "共同借款主体", CoBorrowerInfo.CautionerTypeDataSource, 3, 3, false, "请选择共同借款主体"),
        GetEditSelect("LoanRelation", "与借款主体关系", CoBorrowerInfo.LoanRelationDataSource, 4, 1, false, "请选择与借款主体关系"),
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
        ReadRightName: "CoBorrowerInfoButtonView",
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
        ReadRightName: "CoBorrowerInfoButtonView",
        Style: {
            display: "flex",
            flexDirection: "column",
            marginBottom: 10
        }
    }
}