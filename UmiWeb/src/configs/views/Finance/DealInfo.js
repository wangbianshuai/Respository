import { AssignProporties, GetTextBox, GetButton } from "../../pages/Common";

export default {
    Name: "DealInfo",
    Type: "View",
    Properties: AssignProporties({}, [GetInfoView(), GetRightButtonView()])
}

function GetInfoView() {
    return {
        Name: "DealInfo2",
        Type: "RowsColsView",
        IsForm: true,
        LabelAlign: "left",
        Title: "经营信息",
        Style: { marginTop: 8 },
        Properties: AssignProporties({}, GetProperties())
    }
}

function GetRightButtonView() {
    return {
        Name: "RightButtonView",
        Type: "View",
        ClassName: "DivRightButton",
        IsDiv: true,
        Properties: AssignProporties({}, GetRightButtonProperties())
    }
}

function GetRightButtonProperties() {
    return [
        { ...GetButton("SaveDealInfo", "保存", "primary"), EventActionName: "SaveDealInfo", Style: { marginRight: 36, width: 84 } }]
}

function GetProperties() {
    return [
        GetTextBox3("kinsfolkContactMobile", "下游账期", 1, 1, "int", "请输入", 5, false, "天"),
        GetTextBox3("kinsfolkContactMobile", "当前应收账款", 1, 2, "decimal", "请输入", 20, false, "元"),
        GetTextBox3("kinsfolkContactRelation", "当前存货价值", 1, 3, "decimal", "请输入", 20, false, "元"),
        GetTextBox3("kinsfolkContactRelation", "当前应付账款", 2, 1, "int", "请输入", 10, false, "笔"),
        GetTextBox3("kinsfolkContactRelation", "当前其他应付账款", 2, 2, "decimal", "请输入", 20, false, "元"),
        GetTextBox3("kinsfolkContactRelation", "行业利润率", 2, 3, "decimal", "请输入", 6, false, "%")
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