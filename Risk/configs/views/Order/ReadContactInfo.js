const ContactInfo = require("../../entities/ContactInfo");

const { AssignProporties, GetTextBox, GetButton } = require("../../Common");

var DataActionTypes = {}

module.exports = (actionTypes) => {
    DataActionTypes = actionTypes;

    return {
        Name: "ContactInfo",
        Type: "View",
        Properties: AssignProporties({ Name: "ContactInfo" }, [GetInfoView(), GetRightButtonView()])
    }
}

function GetInfoView() {
    return {
        Name: "ContactInfo2",
        Type: "RowsColsView",
        Entity: ContactInfo,
        IsForm: true,
        LabelAlign: "left",
        Title: "联系人信息",
        Style: { marginTop: 8 },
        PropertyName: "ContactInfo",
        DefaultEditData: { ViewName: "ContactInfo" },
        SaveEntityDataActionType: DataActionTypes.SaveApprovalOrderDetail,
        Properties: AssignProporties(ContactInfo, GetProperties())
    }
}

function GetRightButtonView() {
    return {
        Name: "ContactInfoButtonView",
        Type: "View",
        ClassName: "DivRightButton",
        IsDiv: true,
        Properties: AssignProporties({ Name: "ContactInfo" }, GetRightButtonProperties())
    }
}

function GetRightButtonProperties() {
    return [{ ...GetButton("SaveContactInfo", "保存", "primary"), Text2: "修改", EventActionName: "SaveContactInfoEntityData", Style: { marginRight: 36, width: 84 } }]
}

function GetProperties() {
    return [
        GetSpanText("Contact1Info", "亲属联系人", "SpanTitle", 1, 1),
        GetReadOnlyTextBox("kinsfolkContactName", "姓名", 2, 1),
        GetReadOnlyTextBox("kinsfolkContactMobile", "手机号", 2, 2),
        GetReadOnlyTextBox("kinsfolkContactRelationName", "关系", 2, 3),
        GetReadOnlyTextBox("kinsfolkContactAddr", "现居住地址", 3, 1),

        GetSpanText("Contact3Info", "单位联系人", "SpanTitle", 4, 1),
        GetReadOnlyTextBox("companyContactName", "姓名", 5, 1),
        GetReadOnlyTextBox("companyContactMobile", "手机号", 5, 2),
        GetReadOnlyTextBox("companyContactRelationName", "关系", 5, 3),
        GetReadOnlyTextBox("companyContactAddr", "现居住地址", 6, 1),

        GetSpanText("Contact2Info", "紧急联系人", "SpanTitle", 7, 1),
        GetReadOnlyTextBox("urgencyContactName", "姓名", 8, 1),
        GetReadOnlyTextBox("urgencyContactMobile", "手机号", 8, 2),
        GetReadOnlyTextBox("urgencyContactRelationName", "关系", 8, 3),
        GetReadOnlyTextBox("urgencyContactAddr", "现居住地址", 9, 1),

        { Name: "WhiteSpace1", Type: "WhiteSpace", ClassName: "WhiteSpace1", Style: { marginBottom: 20 }, X: 10, Y: 1, ColSpan: 24 },
        GetTextArea("ApprovalRemark", "备注", 11, 1, "请输入备注")
    ]
}

function GetSpanText(name, text, className, x, y) {
    return { Name: name, Type: "SpanText", Text: text, IsEdit: false, ClassName: className, X: x, Y: y }
}

function GetTextArea(Name, Label, X, Y, PlaceHolder) {
    return {
        ...GetTextBox(Name, Label, "TextArea", X, Y, PlaceHolder),
        IsFormItem: true,
        IsNullable: true,
        IsColon: false,
        IsAddOptional: true,
        IsEdit: true,
        ReadRightName: "ContactInfoButtonView",
        ColSpan: 24,
        Rows: 4,
        LabelCol: 10,
        WrapperCol: 23,
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