import Order from "../../entities/Order";

import { AssignProporties, GetTextBox, GetButton } from "../../pages/Common";

export default {
    Name: "ContactInfo",
    Type: "View",
    Properties: AssignProporties({}, [GetInfoView(), GetRightButtonView()])
}

function GetInfoView() {
    return {
        Name: "ContactInfo2",
        Type: "RowsColsView",
        Entity: Order,
        IsForm: true,
        LabelAlign: "left",
        Title: "联系人信息",
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
    return [{ ...GetButton("SaveContactInfo", "保存", "primary"), EventActionName: "SaveContactInfo", Style: { marginRight: 36, width: 84 } }]
}

function GetProperties() {
    return [
        GetSpanText("Contact1Info", "亲属联系人", "SpanTitle", 1, 1),
        GetTextBox2("kinsfolkContactName", "姓名", 2, 1, "", "请填写联系人姓名"),
        GetTextBox2("kinsfolkContactMobile", "手机号", 2, 2, "int", "请填写联系人手机号", 11),
        GetTextBox2("kinsfolkContactRelation", "关系", 2, 3, "", "请填写与联系人关系"),
        GetTextBox2("kinsfolkContactAddr", "现居住地址", 3, 1, "", "请填写联系人现居住地址"),
        GetSpanText("Contact2Info", "紧急联系人", "SpanTitle", 4, 1),
        GetTextBox2("urgencyContactName", "姓名", 5, 1, "", "请填写联系人姓名"),
        GetTextBox2("urgencyContactMobile", "手机号", 5, 2, "int", "请填写联系人手机号", 11),
        GetTextBox2("urgencyContactRelation", "关系", 5, 3, "", "请填写与联系人关系"),
        GetTextBox2("urgencyContactAddr", "现居住地址", 6, 1, "请填写联系人现居住地址"),
        GetSpanText("Contact3Info", "单位联系人", "SpanTitle", 7, 1),
        GetTextBox2("companyContactName", "姓名", 8, 1, "", "请填写联系人姓名"),
        GetTextBox2("companyContactMobile", "手机号", 8, 2, "int", "请填写联系人手机号", 11),
        GetTextBox2("companyContactRelation", "关系", 8, 3, "", "请填写与联系人关系"),
        GetTextBox2("companyContactAddr", "现居住地址", 9, 1, "", "请填写联系人现居住地址")
    ]
}

function GetTextBox2(Name, Label, X, Y, ContorlType, PlaceHolder, MaxLength) {
    return {
        ...GetTextBox(Name, Label, ContorlType, X, Y, PlaceHolder, MaxLength || 50),
        IsColon: false,
        IsFormItem: true, ColSpan: 8,
        LabelCol: 10,
        WrapperCol: 20,
        IsNullable: false,
        IsEdit: true,
        Style: {
            display: "flex",
            flexDirection: "column",
            marginBottom: 10
        }
    }
}

function GetSpanText(name, text, className, x, y) {
    return { Name: name, Type: "SpanText", Text: text, IsEdit: false, ClassName: className, X: x, Y: y }
}