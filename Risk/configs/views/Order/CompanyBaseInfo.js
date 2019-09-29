const CompanyBaseInfo = require("../../entities/CompanyBaseInfo");

const { AssignProporties, GetTextBox, GetDatePicker, GetSelect, GetButton, RegExpress } = require("../../Common");

var DataActionTypes = {}

module.exports = (actionTypes) => {
    DataActionTypes = actionTypes;

    return {
        Name: "CompanyBaseInfo",
        Type: "View",
        Properties: AssignProporties({ Name: "CompanyBaseInfo" }, [GetInfoView(), GetRightButtonView()])
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
        PropertyName: "enterprise",
        DefaultEditData: { ViewName: "enterprise" },
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
        Properties: AssignProporties({ Name: "CompanyBaseInfo" }, GetRightButtonProperties())
    }
}

function GetRightButtonProperties() {
    return [{ ...GetButton("SaveCompanyBaseInfo", "保存", "primary"), Text2: "修改", IsDisabled: true, EventActionName: "SaveCompanyBaseInfoEntityData", Style: { marginRight: 36, width: 84 } }]
}

function GetProperties() {
    return [
        GetReadOnlyTextBox("CompanyName", "企业名称", 1, 1),
        GetReadOnlyTextBox("CompanyIdNumber", "统一社会信用代码", 1, 2),
        { ...GetReadOnlyTextBox("businessLicenseUrl", "营业执照", 1, 3, "查看"), IsAddonAfterOpenUrl: true },
        GetReadOnlyTextBox("LegalPersonName", "法人姓名", 2, 1),
        GetReadOnlyTextBox("LegalPersonIdNumber", "法人身份证号", 2, 2),
        GetNumberTextBox("LegalPersonPhone", "法人手机号", 2, 3, "请输入法人手机号", 11, false, "", ["ValidateMobile"], "法人手机号格式不正确！"),
        GetDatePicker2("RegisterDate", "成立时间", 3, 1, "", false, "请选择成立时间"),
        GetTextBox3("RegisterAmount", "注册资金", 3, 2, "float", "请输入注册资金", 20, false, "万元"),
        GetTextBox3("ManageYears", "经营年限", 3, 3, "int", "请输入经营年限", 2, false, "年"),
        GetTextBox2("CompanyAddress", "单位地址", 4, 1, "", "请输入单位地址", 100, false),
        GetTextBox2("CompanyTelephone", "单位电话", 4, 2, "", "请输入单位电话", 20, false, "", ["ValidateHomePhone", "ValidateMobile"], "单位电话格式不正确！"),
        GetTextBox2("CompanyEmail", "单位邮箱", 4, 3, "", "请输入单位邮箱", 100, false, "", ["ValidateEmail"], "单位邮箱格式不正确！"),
        GetReadOnlyTextBox("Industry1", "行业门类", 5, 1),
        GetReadOnlyTextBox("Industry2", "行业大类", 5, 2),
        GetReadOnlyTextBox("Industry3", "行业中类", 5, 3),
        GetReadOnlyTextBox("Industry4", "行业小类", 6, 1),
        {
            ...GetEditSelect("CompanyHouseStatus", "办公地是否租赁", CompanyBaseInfo.HouseStatusDataSource, 6, 2, false, "请选择办公地是否租赁"),
            ValueDisabledProperties: { "02": ["CompanyHousePeriod"] },
            IsLoadValue: true
        },
        GetBetweenDate("CompanyHousePeriod", "leaseStartPeriod", "leaseEndPeriod", "租赁有效期限", 6, 3, false, "请选择租赁有效期限", true),
        GetTextBox2("CompanyElectricityCode", "办公地电费单号", 7, 1, "", "请输入办公地电费单号", 20, false)
    ]
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