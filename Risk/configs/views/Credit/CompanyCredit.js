const Credit = require("../../entities/Credit");

const { AssignProporties, GetTextBox, GetButton } = require("../../Common");

var DataActionTypes = {}

module.exports = (actionTypes) => {
    DataActionTypes = actionTypes;

    return {
        Name: "CompanyCredit",
        Type: "View",
        Properties: AssignProporties({ Name: "CompanyCredit" }, [GetInfoView(), GetRightButtonView()])
    }
}

function GetInfoView() {
    return {
        Name: "CompanyCredit2",
        Type: "RowsColsView",
        IsForm: true,
        LabelAlign: "left",
        Title: "企业类征信",
        Style: { marginTop: 8 },
        PropertyName: "enterpriseInfo",
        DefaultEditData: { ViewName: "enterpriseInfo" },
        SaveEntityDataActionType: DataActionTypes.SaveCreditInfo,
        Properties: AssignProporties(Credit, GetProperties())
    }
}

function GetRightButtonView() {
    return {
        Name: "CompanyCreditButtonView",
        Type: "View",
        ClassName: "DivRightButton",
        IsDiv: true,
        Properties: AssignProporties({ Name: "CompanyCredit" }, GetRightButtonProperties())
    }
}

function GetRightButtonProperties() {
    return [{ ...GetButton("SaveCompanyCredit", "保存", "primary"), Text2: "修改", IsDisabled: true, EventActionName: "SaveCompanyCredit", Style: { marginRight: 36, width: 84 } }]
}

function GetProperties() {
    return [
        GetTextBox3("CompanyDebtBalanceNoEquals", "企业抵押+质押贷款负债余额（非等额本息）", 2, 1, "float", "请输入", 20, false, "万元"),
        GetTextBox3("CompanyDebtBalance", "企业抵押+质押贷款负债余额（等额本息）", 2, 2, "float", "请输入", 20, false, "万元"),
        GetTextBox3("CompanyCreditBalanceNoEquals", "企业信用贷款负债余额（非等额本息）", 2, 3, "float", "请输入", 20, false, "万元"),
        GetTextBox3("CompanyCreditBalance", "企业信用贷款负债余额（等额本息）", 3, 1, "float", "请输入", 20, false, "万元"),
    ]
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
        IsEdit: true,
        ReadRightName: "CompanyCreditButtonView",
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