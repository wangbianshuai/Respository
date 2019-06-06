import { AssignProporties, GetTextBox, GetButton } from "../../pages/Common";

var DataActionTypes = {}

export default (actionTypes) => {
    DataActionTypes = actionTypes;

    return {
        Name: "FinalCreditCalculate",
        Type: "View",
        Properties: AssignProporties({}, [GetInfoView(), GetRightButtonView()])
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
        GetEntityDataActionType: DataActionTypes.GetFinalCreditCalculate,
        SaveEntityDataActionType: DataActionTypes.SaveFinalCreditCalculate,
        Properties: AssignProporties({}, GetProperties())
    }
}

function GetRightButtonView() {
    return {
        Name: "FinalCreditCalculateButtonView",
        Type: "View",
        ClassName: "DivRightButton",
        IsDiv: true,
        Properties: AssignProporties({}, GetRightButtonProperties())
    }
}

function GetRightButtonProperties() {
    return [{ ...GetButton("ExceCompute", "执行测算", "primary"), IsDisabled: true, EventActionName: "SaveFinalCreditCalculate", Style: { marginRight: 36, width: 100 } }]
}

function GetProperties() {
    return [
        GetTextBox3("kinsfolkContactName", "可认定流水", 1, 1, "float", "入参请输入", 20, false, "元"),
        GetTextBox3("kinsfolkContactName", "批复借款期限", 1, 2, "int", "入参请输入", 3, false, "月"),
        { Name: "WhiteSpace1", Type: "WhiteSpace", ClassName: "WhiteSpace1", X: 2, Y: 1, ColSpan: 24 },
        GetTextBox3("kinsfolkContactName", "测算借款额度", 3, 1, "float", "请输入", 20, false, "元"),
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