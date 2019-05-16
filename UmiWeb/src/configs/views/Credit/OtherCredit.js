import { AssignProporties, GetTextBox, GetButton } from "../../pages/Common";

export default {
    Name: "OtherCredit",
    Type: "View",
    Properties: AssignProporties({}, [GetInfoView(), GetRightButtonView()])
}

function GetInfoView() {
    return {
        Name: "OtherCredit2",
        Type: "RowsColsView",
        IsForm: true,
        LabelAlign: "left",
        Title: "其他数据",
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
    return [{ ...GetButton("SaveOtherCredit", "保存", "primary"), EventActionName: "SaveOtherCredit", Style: { marginRight: 36, width: 84 } }]
}

function GetProperties() {
    return [
        GetTextBox3("kinsfolkContactName", "企业+个人当前对外担保金额", 2, 1, "decimal", "请输入", 20, false, "元"),
        GetTextBox3("kinsfolkContactMobile", "企业+个人当前对外担保笔数", 2, 2, "int", "请输入", 10, false, "笔数"),
        GetTextBox3("kinsfolkContactRelation", "查询次数（最近1个月内）", 2, 3, "int", "请输入", 10, false, "次"),
        GetTextBox3("kinsfolkContactAddr", "查询次数（最近2个月内）", 3, 1, "decimal", "请输入", 10, false, "次")
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