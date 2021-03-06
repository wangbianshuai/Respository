const ContactInfo = require("../../entities/ContactInfo");

const { AssignProporties, GetTextBox, GetButton, RegExpress, GetSelect } = require("../../Common");

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
        SaveEntityDataActionType: DataActionTypes.SaveOrderDetailEntityData,
        Properties: AssignProporties(ContactInfo, GetProperties())
    }
}

function GetRightButtonView() {
    return {
        Name: "ContactInfoRightButtonView",
        Type: "View",
        ClassName: "DivRightButton",
        IsDiv: true,
        Properties: AssignProporties({ Name: "ContactInfo" }, GetRightButtonProperties())
    }
}

function GetRightButtonProperties() {
    return [{ ...GetButton("SaveContactInfo", "保存", "primary"), Text2: "修改", IsDisabled: true, EventActionName: "SaveContactInfoEntityData", Style: { marginRight: 36, width: 84 } }]
}

function GetProperties() {
    return [
        GetSpanText("Contact1Info", "亲属联系人", "SpanTitle", 1, 1),
        GetTextBox2("kinsfolkContactName", "姓名", 2, 1, "", "请填写联系人姓名"),
        GetNumberTextBox("kinsfolkContactMobile", "手机号", 2, 2, "请填写联系人手机号", 11, ["ValidateMobile"], "亲属联系人手机号格式不正确！"),
        GetEditSelect("kinsfolkContactRelation", "关系", ContactInfo.KinsfolkContactDataSource, 2, 3, false, "请选择与联系人关系"),
        GetTextBox2("kinsfolkContactAddr", "现居住地址", 3, 1, "", "请填写联系人现居住地址"),

        GetSpanText("Contact3Info", "单位联系人", "SpanTitle", 4, 1),
        GetTextBox2("companyContactName", "姓名", 5, 1, "", "请填写联系人姓名"),
        GetNumberTextBox("companyContactMobile", "手机号", 5, 2, "请填写联系人手机号", 11, ["ValidateMobile"], "单位联系人手机号格式不正确！"),
        GetEditSelect("companyContactRelation", "关系", ContactInfo.CompanyContactDataSource, 5, 3, false, "请选择与联系人关系"),
        GetTextBox2("companyContactAddr", "现居住地址", 6, 1, "", "请填写联系人现居住地址"),

        GetSpanText("Contact2Info", "紧急联系人", "SpanTitle", 7, 1),
        GetTextBox2("urgencyContactName", "姓名", 8, 1, "", "请填写联系人姓名"),
        GetNumberTextBox("urgencyContactMobile", "手机号", 8, 2, "请填写联系人手机号", 11, ["ValidateMobile"], "紧急联系人手机号格式不正确！"),
        GetEditSelect("urgencyContactRelation", "关系", ContactInfo.UrgencyContactDataSource, 8, 3, false, "请选择与联系人关系"),
        GetTextBox2("urgencyContactAddr", "现居住地址", 9, 1, "", "请填写联系人现居住地址")
    ]
}

function GetEditSelect(Name, Label, DataSource, X, Y, IsNullable, PlaceHolder, DefaultValue) {
    return {
        ...GetSelect(Name, Label, DataSource, X, Y, DefaultValue),
        IsColon: false,
        IsFormItem: true, ColSpan: 8,
        LabelCol: 10,
        WrapperCol: 21,
        IsNullable: IsNullable,
        IsAddOptional: !!IsNullable,
        PlaceHolder: PlaceHolder,
        IsEdit: true,
        ReadRightName: "ContactInfoRightButtonView",
        Style: {
            display: "flex",
            flexDirection: "column",
            marginBottom: 10
        }
    }
}

function GetNumberTextBox(Name, Label, X, Y, PlaceHolder, MaxLength, ValidateNames, ValidateTipMessage) {
    return {
        ...GetTextBox2(Name, Label, X, Y, "", PlaceHolder, MaxLength, ValidateNames, ValidateTipMessage),
        RegExp: RegExpress.NoNumber,
        KeyPressRegExp: RegExpress.InputNumber
    }
}

function GetTextBox2(Name, Label, X, Y, ContorlType, PlaceHolder, MaxLength, ValidateNames, ValidateTipMessage) {
    return {
        ...GetTextBox(Name, Label, ContorlType, X, Y, PlaceHolder, MaxLength || 50),
        ValidateNames, ValidateTipMessage,
        IsColon: false,
        IsFormItem: true, ColSpan: 8,
        LabelCol: 10,
        WrapperCol: 21,
        IsNullable: false,
        IsEdit: true,
        ReadRightName: "ContactInfoRightButtonView",
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