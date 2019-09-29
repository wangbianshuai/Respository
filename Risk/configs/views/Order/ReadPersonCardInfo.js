const PersonCardInfo = require("../../entities/PersonCardInfo");

const { AssignProporties, GetTextBox, GetButton } = require("../../Common");

var DataActionTypes = {}

module.exports = (actionTypes) => {
    DataActionTypes = actionTypes;

    return {
        Name: "PersonCardInfo",
        Type: "View",
        Properties: AssignProporties({ Name: "PersonCardInfo" }, [GetInfoView(), GetRightButtonView()])
    }
}

function GetInfoView() {
    return {
        Name: "PersonCardInfo2",
        Type: "RowsColsView",
        Entity: PersonCardInfo,
        IsForm: true,
        LabelAlign: "left",
        Title: "个人证件信息",
        Style: { marginTop: 8 },
        PropertyName: "personalIdentity",
        DefaultEditData: { ViewName: "personalIdentity" },
        SaveEntityDataActionType: DataActionTypes.SaveApprovalOrderDetail,
        Properties: AssignProporties(PersonCardInfo, GetProperties())
    }
}

function GetRightButtonView() {
    return {
        Name: "PersonCardInfoButtonView",
        Type: "View",
        ClassName: "DivRightButton",
        IsDiv: true,
        Properties: AssignProporties({ Name: "PersonCardInfo" }, GetRightButtonProperties())
    }
}

function GetRightButtonProperties() {
    return [{ ...GetButton("SavePersonCardInfo", "保存", "primary"), Text2: "修改", EventActionName: "SavePersonCardInfoEntityData", Style: { marginRight: 36, width: 84 } }]
}

function GetProperties() {
    return [
        GetReadOnlyTextBox("UserName", "姓名", 1, 1),
        GetReadOnlyTextBox("IdNumber", "身份证号", 1, 2),
        GetReadOnlyTextBox("Sex", "性别", 1, 3),
        GetReadOnlyTextBox("Nation", "民族", 2, 1),
        { ...GetReadOnlyTextBox("Birthday", "出生年月", 2, 2), IsDate: true },
        GetReadOnlyTextBox("Address", "身份证地址", 2, 3),
        GetReadOnlyTextBox("SignUnit", "签发机关", 3, 1),
        GetReadOnlyTextBox("Period", "证件有效期", 3, 2),
        { Name: "WhiteSpace1", Type: "WhiteSpace", ClassName: "WhiteSpace1", Style: { marginBottom: 20 }, X: 4, Y: 1, ColSpan: 24 },
        GetTextArea("ApprovalRemark", "备注", 5, 1, "请输入备注")
    ]
}

function GetTextArea(Name, Label, X, Y, PlaceHolder) {
    return {
        ...GetTextBox(Name, Label, "TextArea", X, Y, PlaceHolder),
        IsFormItem: true,
        IsNullable: true,
        IsColon: false,
        IsAddOptional: true,
        IsEdit: true,
        ReadRightName: "PersonCardInfoButtonView",
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