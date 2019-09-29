const { AssignProporties, GetTextBox, GetButton } =require( "../../Common");

var DataActionTypes = {}

module.exports= (actionTypes) => {
    DataActionTypes = actionTypes;

    return {
        Name: "CreditCalculate",
        Type: "View",
        Properties: AssignProporties({Name:"CreditCalculate"}, [GetInfoView(), GetRightButtonView()])
    }
}

function GetInfoView() {
    return {
        Name: "CreditCalculate2",
        Type: "RowsColsView",
        IsForm: true,
        LabelAlign: "left",
        Title: "测算结果",
        Style: { marginTop: 8 },
        EventActionName: "GetCreditQuota",
        GetEntityDataActionType: DataActionTypes.GetCreditQuota,
        SaveEntityDataActionType: DataActionTypes.ComputeCreditQuota,
        Properties: AssignProporties({Name:"CreditCalculate"}, GetProperties())
    }
}

function GetRightButtonView() {
    return {
        Name: "CreditCalculateButtonView",
        Type: "View",
        ClassName: "DivLeftRightButton",
        IsDiv: true,
        Properties: AssignProporties({Name:"CreditCalculate"}, GetRightButtonProperties())
    }
}

function GetRightButtonProperties() {
    return [{ Name: "InfoTip", Type: "SpanText", ClassName: "RedSpanTip", Text: "重要提醒：测算结果仅供初审阶段参考！" },
    { ...GetButton("ExceCompute", "执行测算", "primary"), IsDisabled: true, EventActionName: "ExceCompute", Style: { marginRight: 36, width: 100 } }]
}

function GetProperties() {
    return [
        GetTextBox3("LoanQuota", "测算借款额度", 1, 1, "float", "请输入", 20, false, "元"),
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