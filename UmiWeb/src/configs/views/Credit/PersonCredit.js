import { AssignProporties, GetTextBox, GetButton } from "../../pages/Common";

export default {
    Name: "PersonCredit",
    Type: "View",
    Properties: AssignProporties({}, [GetInfoView(), GetRightButtonView()])
}

function GetInfoView() {
    return {
        Name: "PersonCredit2",
        Type: "RowsColsView",
        IsForm: true,
        LabelAlign: "left",
        Title: "个人类征信",
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
    return [{ ...GetButton("SavePersonCredit", "保存", "primary"), EventActionName: "SavePersonCredit", Style: { marginRight: 36, width: 84 } }]
}

function GetProperties() {
    return [
        GetTextBox3("kinsfolkContactName", "个人当前抵押+质押贷款负债余额（非等额本息）", 2, 1, "decimal", "请输入", 20, false, "元"),
        GetTextBox3("kinsfolkContactMobile", "个人当前抵押+质押贷款负债余额（等额本息）", 2, 2, "decimal", "请输入", 20, false, "元"),
        GetTextBox3("kinsfolkContactRelation", "个人信用贷款负债余额（非等额本息）", 2, 3, "decimal", "请输入", 20, false, "元"),
        GetTextBox3("kinsfolkContactAddr", "个人信用贷款负债余额（等额本息）", 3, 1, "decimal", "请输入", 20, false, "元"),
        GetTextBox3("kinsfolkContactAddr", "个人贷款平均还款金额（近6个月）", 3, 2, "decimal", "请输入", 20, false, "元"),
        GetTextBox3("kinsfolkContactAddr", "个人贷记卡总授信额度", 3, 4, "decimal", "请输入", 20, false, "元"),
        GetTextBox3("kinsfolkContactAddr", "个人贷记卡已使用额度", 4, 1, "decimal", "请输入", 20, false, "元"),
        GetTextBox3("kinsfolkContactAddr", "个人贷记卡平均使用额度（近6个月）", 4, 1, "decimal", "请输入", 20, false, "元")
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