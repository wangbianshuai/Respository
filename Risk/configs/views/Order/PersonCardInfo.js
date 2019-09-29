const PersonCardInfo = require("../../entities/PersonCardInfo");

const { AssignProporties, GetTextBox, GetDatePicker, GetButton } = require("../../Common");

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
        SaveEntityDataActionType: DataActionTypes.SaveOrderDetailEntityData,
        Properties: AssignProporties(PersonCardInfo, GetProperties())
    }
}

function GetRightButtonView() {
    return {
        Name: "PersonCardInfoRightButtonView",
        Type: "View",
        ClassName: "DivRightButton",
        IsDiv: true,
        Properties: AssignProporties({ Name: "PersonCardInfo" }, GetRightButtonProperties())
    }
}

function GetRightButtonProperties() {
    return [{ ...GetButton("SavePersonCardInfo", "保存", "primary"), Text2: "修改", IsDisabled: true, EventActionName: "SavePersonCardInfoEntityData", Style: { marginRight: 36, width: 84 } }]
}

function GetProperties() {
    return [
        GetReadOnlyTextBox("UserName", "姓名", 1, 1),
        GetReadOnlyTextBox("IdNumber", "身份证号", 1, 2),
        GetReadOnlyTextBox("Sex", "性别", 1, 3),
        GetReadOnlyTextBox("Nation", "民族", 2, 1),
        { ...GetReadOnlyTextBox("Birthday", "出生年月", 2, 2), IsDate: true },
        GetTextBox2("Address", "身份证地址", 2, 3, "", "请输入身份证地址", 100, false),
        GetTextBox2("SignUnit", "签发机关", 3, 1, "", "请输入签发机关", 100, false),
        GetBetweenDate("Period", "validityStartDate", "validityEndDate", "证件有效期", 3, 2, false, "请选择证件有效期")
    ]
}

function GetBetweenDate(Name, StartDateName, EndDateName, Label, X, Y, IsNullable, PlaceHolder, DefaultValue) {
    return {
        ...GetDatePicker(Name, Label, X, Y, DefaultValue),
        IsColon: false,
        IsFormItem: true, ColSpan: 8,
        LabelCol: 10,
        WrapperCol: 21,
        StartDateName, EndDateName,
        IsNullable: IsNullable,
        PlaceHolder: PlaceHolder,
        ControlType: "RangePicker",
        NullTipMessage: PlaceHolder,
        IsEdit: true,
        ReadRightName: "PersonCardInfoRightButtonView",
        Style: {
            display: "flex",
            flexDirection: "column",
            marginBottom: 10
        }
    }
}

function GetTextBox2(Name, Label, X, Y, ContorlType, PlaceHolder, MaxLength, IsNullable, addonAfter) {
    return {
        ...GetTextBox(Name, Label, ContorlType, X, Y, PlaceHolder, MaxLength),
        IsColon: false,
        IsFormItem: true, ColSpan: 8,
        LabelCol: 10,
        WrapperCol: 21,
        AddonAfter: addonAfter,
        IsNullable: IsNullable,
        IsEdit: true,
        ReadRightName: "PersonCardInfoRightButtonView",
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