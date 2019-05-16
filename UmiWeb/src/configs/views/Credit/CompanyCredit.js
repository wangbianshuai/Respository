import { AssignProporties, GetTextBox, GetButton } from "../../pages/Common";

export default {
    Name: "CompanyCredit",
    Type: "View",
    Properties: AssignProporties({}, [GetInfoView(), GetRightButtonView()])
}

function GetInfoView() {
    return {
        Name: "CompanyCredit2",
        Type: "RowsColsView",
        IsForm: true,
        LabelAlign: "left",
        Title: "企业类征信",
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
    return [{ ...GetButton("SaveCompanyCredit", "保存", "primary"), EventActionName: "SaveCompanyCredit", Style: { marginRight: 36, width: 84 } }]
}

function GetProperties() {
    return [
        GetTextBox3("kinsfolkContactName", "企业抵押+质押贷款负债余额（非等额本息）", 2, 1, "decimal", "请输入", 20, false, "元"),
        GetTextBox3("kinsfolkContactMobile", "企业抵押+质押贷款负债余额（等额本息）", 2, 2, "decimal", "请输入", 20, false, "元"),
        GetTextBox3("kinsfolkContactRelation", "企业信用贷款负债余额（非等额本息）", 2, 3, "decimal", "请输入", 20, false, "元"),
        GetTextBox3("kinsfolkContactAddr", "企业信用贷款负债余额（等额本息）", 3, 1, "decimal", "请输入", 20, false, "元"),
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