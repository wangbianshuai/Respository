import { AssignProporties, GetTextBox, GetButton } from "../../pages/Common";

export default {
    Name: "CreditCalculate",
    Type: "View",
    Properties: AssignProporties({}, [GetInfoView(), GetRightButtonView()])
}

function GetInfoView() {
    return {
        Name: "CreditCalculate2",
        Type: "RowsColsView",
        IsForm: true,
        LabelAlign: "left",
        Title: "测算结果",
        Style: { marginTop: 8 },
        Properties: AssignProporties({}, GetProperties())
    }
}

function GetRightButtonView() {
    return {
        Name: "RightButtonView",
        Type: "View",
        ClassName: "DivLeftRightButton",
        IsDiv: true,
        Properties: AssignProporties({}, GetRightButtonProperties())
    }
}

function GetRightButtonProperties() {
    return [{ Name: "InfoTip", Type: "SpanText", ClassName: "RedSpanTip", Text: "重要提醒：测算结果仅供初审阶段参考！" },
    { ...GetButton("ExceCompute", "执行测算", "primary"), EventActionName: "ExceCompute", Style: { marginRight: 36, width: 100 } }]
}

function GetProperties() {
    return [
        GetTextBox3("kinsfolkContactName", "测算借款额度", 1, 1, "decimal", "请输入", 20, false, "元"),
    ]
}

function GetTextBox2(Name, Label, X, Y, ContorlType, PlaceHolder, MaxLength, IsNullable, addonAfter) {
    return {
        ...GetTextBox(Name, Label, ContorlType, X, Y, PlaceHolder, MaxLength),
        IsColon: false,
        IsFormItem: true, ColSpan: 8,
        LabelCol: 20,
        WrapperCol: 20,
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