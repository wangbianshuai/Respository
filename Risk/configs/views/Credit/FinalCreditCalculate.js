const FinalCreditCalculate = require("../../entities/FinalCreditCalculate");

const { AssignProporties, GetTextBox, GetButton, GetSelect } = require("../../Common");

var DataActionTypes = {}

module.exports = (actionTypes) => {
    DataActionTypes = actionTypes;

    return {
        Name: "FinalCreditCalculate",
        Type: "View",
        Properties: AssignProporties({ Name: "FinalCreditCalculate" }, [GetInfoView(), GetRightButtonView()])
    }
}

function GetInfoView() {
    return {
        Name: "FinalCreditCalculate2",
        Type: "RowsColsView",
        IsForm: true,
        LabelAlign: "left",
        Title: "测算结果",
        Style: { marginTop: 8 },
        EventActionName: "GetFinalCreditCalculate",
        Entity: FinalCreditCalculate,
        GetEntityDataActionType: DataActionTypes.GetFinalCreditCalculate,
        SaveEntityDataActionType: DataActionTypes.SaveFinalCreditCalculate,
        Properties: AssignProporties(FinalCreditCalculate, GetProperties())
    }
}

function GetRightButtonView() {
    return {
        Name: "FinalCreditCalculateButtonView",
        Type: "View",
        ClassName: "DivRightButton",
        IsDiv: true,
        Properties: AssignProporties({ Name: "FinalCreditCalculate" }, GetRightButtonProperties())
    }
}

function GetRightButtonProperties() {
    return [{ ...GetButton("ExceCompute", "执行测算", "primary"), IsDisabled: true, EventActionName: "SaveFinalCreditCalculate", Style: { marginRight: 36, width: 100 } }]
}

function GetProperties() {
    return [
        { Name: "Title", Type: "SpanText", X: 1, Y: 1, ClassName: "SpanTitle", Text: "计算参数" },
        { ...GetTextBox3("CompanyTotalAmount", "对公认定流水", 2, 1, "float", "入参请输入", 20, true, "元"), IsColVisible: true },
        { ...GetTextBox3("PersonTotalAmount", "对私认定流水", 2, 2, "float", "入参请输入", 20, true, "元"), IsColVisible: true },
        GetTextBox4("CalulateLoanPeriod", "测算借款期限", 2, 3, "int", "入参请输入", 3, true, FinalCreditCalculate.PeriodUnitDataSource, "calcLoanPeriodUnit", "03"),
        { ...GetEditSelect("CreditType", "授信计算类型", [], 3, 1, false, "请选择是否有按揭"), IsDefault: true },
        { Name: "Title", Type: "SpanText", X: 4, Y: 1, ClassName: "SpanTitle", Text: "计算结果", Style: { marginTop: 48 } },
        GetReadOnlyTextBox("FinalCalulateAmout", "最终测算金额", 5, 1, "元"),
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
        ReadRightName: "FinalCreditCalculateButtonView",
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

function GetTextBox2(Name, Label, X, Y, ContorlType, PlaceHolder, MaxLength, IsNullable, addonAfter) {
    return {
        ...GetTextBox(Name, Label, ContorlType, X, Y, PlaceHolder, MaxLength),
        IsColon: false,
        IsFormItem: true, ColSpan: 8,
        LabelCol: 20,
        WrapperCol: 21,
        AddonAfter: addonAfter,
        IsAddOptional: !!IsNullable,
        IsNullable: IsNullable,
        IsEdit: true,
        ReadRightName: "FinalCreditCalculateButtonView",
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

function GetTextBox4(Name, Label, X, Y, DataType, PlaceHolder, MaxLength, IsNullable, addonAfter, PropertyName2, DefaultValue2) {
    return {
        ...GetTextBox2(Name, Label, X, Y, "", PlaceHolder, MaxLength, IsNullable, ""),
        AddonAfterDataSource: addonAfter,
        PropertyName2,
        DefaultValue2,
        DataType,
        SelectStyle: { width: 80 }
    }
}