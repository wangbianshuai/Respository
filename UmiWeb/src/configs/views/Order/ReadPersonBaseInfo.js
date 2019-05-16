import Order from "../../entities/Order";

import { AssignProporties, GetTextBox, GetButton } from "../../pages/Common";

export default {
    Name: "PersonBaseInfo",
    Type: "View",
    Properties: AssignProporties({}, [GetInfoView(), GetRightButtonView()])
}

function GetInfoView() {
    return {
        Name: "PersonBaseInfo2",
        Type: "RowsColsView",
        Entity: Order,
        IsForm: true,
        LabelAlign: "left",
        Title: "个人基本信息",
        Style: { marginTop: 8 },
        Properties: AssignProporties(Order, GetProperties())
    }
}

function GetRightButtonView() {
    return {
        Name: "RightButtonView",
        Type: "View",
        ClassName: "DivRightButton",
        IsDiv: true,
        Properties: AssignProporties(Order, GetRightButtonProperties())
    }
}

function GetRightButtonProperties() {
    return [{ ...GetButton("SavePersonBaseInfo", "保存", "primary"), EventActionName: "SavePersonBaseInfo", Style: { marginRight: 36, width: 84 } }]
}

function GetProperties() {
    return [
        GetReadOnlyTextBox("Phone", "常用手机号", 1, 1),
        GetReadOnlyTextBox("UserType", "用户类型", 1, 2),
        GetReadOnlyTextBox("Email", "邮箱地址", 1, 3),
        GetReadOnlyTextBox("Educational", "教育程度", 2, 1),
        GetReadOnlyTextBox("MaritalStatus", "婚姻状况", 2, 2),
        GetReadOnlyTextBox("MaritalYears", "已婚年限", 2, 3, "年"),
        GetReadOnlyTextBox("NowAddress", "现居住地址", 3, 1),
        GetReadOnlyTextBox("HouseStatus", "居住地是否租赁", 3, 2),
        GetReadOnlyTextBox("HousePeriod", "租赁有效期限", 3, 3),
        GetReadOnlyTextBox("ElectricityCode", "居住地电费单号", 4, 1),
        { Name: "WhiteSpace1", Type: "WhiteSpace", ClassName: "WhiteSpace1", Style: { marginBottom: 20 }, X: 5, Y: 1, ColSpan: 24 },
        GetTextArea("BorrowerAmount", "备注", 6, 1, "请输入备注")
    ]
}

function GetTextArea(Name, Label, X, Y, PlaceHolder) {
    return {
        ...GetTextBox(Name, Label, "TextArea", X, Y),
        IsFormItem: true,
        IsNullable: true,
        IsAddOptional: true,
        ColSpan: 24,
        Rows: 4,
        LabelCol: 2,
        WrapperCol: 22,
        PlaceHolder,
        Style: {
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
        WrapperCol: 20,
        IsReadOnly: true,
        AddonAfter: addonAfter,
        Value: "测试数据1" + Label,
        Style: {
            display: "flex",
            flexDirection: "column",
            marginBottom: 10
        }
    }
}