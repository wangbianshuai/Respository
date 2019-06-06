import CompanyBaseInfo from "../../entities/CompanyBaseInfo";

import { AssignProporties, GetTextBox, GetDatePicker, GetSelect, GetButton, RegExpress } from "../../pages/Common";

var DataActionTypes = {}

export default (actionTypes) => {
    DataActionTypes = actionTypes;

    return {
        Name: "CompanyBaseInfo",
        Type: "View",
        Properties: AssignProporties({}, [GetInfoView(), GetRightButtonView()])
    }
}

function GetInfoView() {
    return {
        Name: "CompanyBaseInfo2",
        Type: "RowsColsView",
        Entity: CompanyBaseInfo,
        IsForm: true,
        LabelAlign: "left",
        Title: "公司基本信息",
        Style: { marginTop: 8 },
        PropertyName: "CompanyBaseInfo",
        DefaultEditData: { ViewName: "CompanyBaseInfo" },
        SaveEntityDataActionType: DataActionTypes.SaveOrderDetailEntityData,
        Properties: AssignProporties(CompanyBaseInfo, GetProperties())
    }
}

function GetRightButtonView() {
    return {
        Name: "CompanyBaseInfoRightButtonView",
        Type: "View",
        ClassName: "DivRightButton",
        IsDiv: true,
        Properties: AssignProporties({}, GetRightButtonProperties())
    }
}

function GetRightButtonProperties() {
    return [{ ...GetButton("SaveCompanyBaseInfo", "保存", "primary"), IsDisabled: true, EventActionName: "SaveCompanyBaseInfoEntityData", Style: { marginRight: 36, width: 84 } }]
}

function GetProperties() {
    return [
        GetReadOnlyTextBox("CompanyName", "公司名称", 1, 1),
        GetReadOnlyTextBox("CompanyIdNumber", "统一社会信用代码", 1, 2),
        GetReadOnlyTextBox("LegalPersonName", "法人姓名", 1, 3),
        GetReadOnlyTextBox("LegalPersonIdNumber", "法人身份证号", 2, 1),
        GetNumberTextBox("LegalPersonPhone", "法人手机号", 2, 2, "请输入法人手机号", 11, false, "", ["ValidateMobile"], "法人手机号格式不正确！"),
        GetDatePicker2("RegisterDate", "成立时间", 2, 3, "", false, "请选择成立时间"),
        GetTextBox3("RegisterAmount", "注册资金", 3, 1, "float", "请输入注册资金", 20, false, "万元"),
        GetTextBox3("ManageYears", "经营年限", 3, 2, "int", "请输入经营年限", 2, false, "年"),
        GetTextBox2("CompanyAddress", "单位地址", 3, 3, "", "请输入单位地址", 100, false),
        GetTextBox2("CompanyTelephone", "单位电话", 4, 1, "", "请输入单位电话", 20, false, "", ["ValidateHomePhone", "ValidateMobile"], "单位电话格式不正确！"),
        GetTextBox2("CompanyEmail", "单位邮箱", 4, 2, "", "请输入单位邮箱", 100, false, "", ["ValidateEmail"], "单位邮箱格式不正确！"),
        GetSelect3("Industry1", "行业门类", 4, 3, true, "请选择行业门类", null, null, ["Industry2"]),
        GetSelect3("Industry2", "行业大类", 5, 1, true, "请选择行业大类", "Industry1", "parentId", ["Industry3"]),
        GetSelect3("Industry3", "行业中类", 5, 2, true, "请选择行业中类", "Industry2", "parentId", ["Industry4"]),
        GetSelect3("Industry4", "行业小类", 5, 3, true, "请选择行业小类", "Industry3", "parentId"),
        {
            ...GetEditSelect("CompanyHouseStatus", "办公地是否租赁", CompanyBaseInfo.HouseStatusDataSource, 6, 1, false, "请选择办公地是否租赁"),
            ValueDisabledProperties: { "0": ["CompanyHousePeriod"] },
            IsLoadValue: true
        },
        GetBetweenDate("CompanyHousePeriod", "CompanyHousePeriodStart", "CompanyHousePeriodEnd", "租赁有效期限", 6, 2, false, "请选择租赁有效期限", true),
        GetTextBox2("CompanyElectricityCode", "办公地电费单号", 6, 3, "", "请输入办公地电费单号", 20, false)
    ]
}

function GetSelect3(name, label, x, y, isNullable, placeHolder, parentName, parentPropertyName, childNames) {
    const p = GetEditSelect(name, label, null, x, y, isNullable, placeHolder);
    p.ParentName = parentName;
    p.ParentPropertyName = parentPropertyName;
    p.ChildNames = childNames;
    p.ServiceDataSource = { ValueName: "id", TextName: "categoryName", IsLocal: true }

    return p;
}

function GetBetweenDate(Name, StartDateName, EndDateName, Label, X, Y, IsNullable, PlaceHolder, Disabled, DefaultValue) {
    return {
        ...GetDatePicker(Name, Label, X, Y, DefaultValue),
        IsColon: false,
        IsFormItem: true, ColSpan: 8,
        LabelCol: 10,
        WrapperCol: 21,
        Disabled,
        StartDateName, EndDateName,
        IsNullable: IsNullable,
        PlaceHolder: PlaceHolder,
        ControlType: "RangePicker",
        NullTipMessage: PlaceHolder,
        IsEdit: true,
        ReadRightName: "CompanyBaseInfoRightButtonView",
        Style: {
            display: "flex",
            flexDirection: "column",
            marginBottom: 10
        }
    }
}

function GetNumberTextBox(Name, Label, X, Y, PlaceHolder, MaxLength, IsNullable, addonAfter, ValidateNames, ValidateTipMessage) {
    return {
        ...GetTextBox2(Name, Label, X, Y, "", PlaceHolder, MaxLength, IsNullable, addonAfter, ValidateNames, ValidateTipMessage),
        RegExp: RegExpress.NoNumber,
        KeyPressRegExp: RegExpress.InputNumber
    }
}

function GetTextBox3(Name, Label, X, Y, DataType, PlaceHolder, MaxLength, IsNullable, addonAfter, ValidateNames, ValidateTipMessage) {
    return {
        ...GetTextBox2(Name, Label, X, Y, "", PlaceHolder, MaxLength, IsNullable, addonAfter, ValidateNames, ValidateTipMessage),
        DataType
    }
}

function GetEditSelect(Name, Label, DataSource, X, Y, IsNullable, PlaceHolder, DefaultValue) {
    return {
        ...GetSelect(Name, Label, DataSource, X, Y, DefaultValue),
        IsColon: false,
        IsFormItem: true, ColSpan: 8,
        LabelCol: 10,
        WrapperCol: 21,
        IsNullable: IsNullable,
        IsAddOptional: !!IsNullable,
        PlaceHolder: PlaceHolder,
        IsEdit: true,
        ReadRightName: "CompanyBaseInfoRightButtonView",
        Style: {
            display: "flex",
            flexDirection: "column",
            marginBottom: 10
        }
    }
}

function GetDatePicker2(Name, Label, X, Y, ControlType, IsNullable, PlaceHolder, DefaultValue) {
    return {
        ...GetDatePicker(Name, Label, X, Y, DefaultValue),
        IsColon: false,
        IsFormItem: true, ColSpan: 8,
        LabelCol: 10,
        WrapperCol: 21,
        IsNullable: IsNullable,
        PlaceHolder: PlaceHolder,
        ControlType: ControlType,
        IsEdit: true,
        ReadRightName: "CompanyBaseInfoRightButtonView",
        Style: {
            display: "flex",
            flexDirection: "column",
            marginBottom: 10
        }
    }
}

function GetTextBox2(Name, Label, X, Y, ContorlType, PlaceHolder, MaxLength, IsNullable, addonAfter, ValidateNames, ValidateTipMessage) {
    return {
        ...GetTextBox(Name, Label, ContorlType, X, Y, PlaceHolder, MaxLength),
        ValidateNames, ValidateTipMessage,
        IsColon: false,
        IsFormItem: true, ColSpan: 8,
        LabelCol: 10,
        WrapperCol: 21,
        AddonAfter: addonAfter,
        IsNullable: IsNullable,
        IsEdit: true,
        ReadRightName: "CompanyBaseInfoRightButtonView",
        Style: {
            display: "flex",
            flexDirection: "column",
            marginBottom: 10
        }
    }
}

function GetReadOnlyTextBox(Name, Label, X, Y, addonAfter) {
    return {
        ...GetTextBox(Name, Label, "", X, Y, "", 200),
        IsColon: false,
        IsFormItem: true, ColSpan: 8,
        LabelCol: 10,
        WrapperCol: 21,
        IsReadOnly: true,
        AddonAfter: addonAfter,
        Style: {
            display: "flex",
            flexDirection: "column",
            marginBottom: 10
        }
    }
}