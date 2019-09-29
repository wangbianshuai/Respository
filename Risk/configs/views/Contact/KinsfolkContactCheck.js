const KinsfolkContactCheck = require("../../entities/KinsfolkContactCheck");

const { AssignProporties, GetTextBox, GetButton, GetDatePicker } = require("../../Common");

var DataActionTypes = {}

module.exports = (actionTypes) => {
    DataActionTypes = actionTypes;

    return {
        Name: "KinsfolkContactCheck",
        Type: "View",
        Properties: AssignProporties({ Name: "KinsfolkContactCheck" }, [GetInfoView(), GetRightButtonView()])
    }
}

function GetInfoView() {
    return {
        Name: "KinsfolkContactCheck2",
        Type: "RowsColsView",
        IsForm: true,
        LabelAlign: "left",
        Title: "亲属联系人核实",
        Style: { marginTop: 8 },
        Entity: KinsfolkContactCheck,
        EventActionName: "GetKinsfolkContactCheck",
        GetEntityDataActionType: DataActionTypes.GetKinsfolkContactCheck,
        SaveEntityDataActionType: DataActionTypes.SaveKinsfolkContactCheck,
        Properties: AssignProporties(KinsfolkContactCheck, GetProperties())
    }
}

function GetRightButtonView() {
    return {
        Name: "KinsfolkContactCheckButtonView",
        Type: "View",
        ClassName: "DivRightButton",
        IsDiv: true,
        Properties: AssignProporties({ Name: "KinsfolkContactCheck" }, GetRightButtonProperties())
    }
}

function GetRightButtonProperties() {
    return [{ ...GetButton("KinsfolkContactCheckClearEdit", "清空", ""), IsDisabled: true, ConfirmTip: "确认要清空问题内容吗？", EventActionName: "KinsfolkContactCheckClearEdit", Style: { marginRight: 10 } },
    { ...GetButton("SaveKinsfolkContactCheck", "保存", "primary"), Text2: "修改", IsDisabled: true, EventActionName: "SaveKinsfolkContactCheck", Style: { marginRight: 36, width: 84 } }]
}

function GetProperties() {
    return [
        { Name: "TopRemark", Type: "SpanText", ClassName: "SpanLabel3", X: 1, Y: 1, Text: "核实描述：", Label: "以第三方公司的名义核实客户所留信息以及客户所陈述信息的真实性，联系人可能为客户的同事/亲属/股东/合作伙伴/其他朋友，根据不同情况核实信息。" },
        { Name: "WhiteSpace2", Type: "WhiteSpace", ClassName: "WhiteSpace2", X: 2, Y: 1, ColSpan: 24 },
        GetTextBox2("ContactPhone", "联系人电话", 3, 1, "", "请输入联系人电话", 20, false, "", ["ValidateHomePhone", "ValidateMobile"], "联系人电话格式不正确！"),
        GetReadOnlyTextBox("ContactName", "联系人姓名", 3, 2),
        GetReadOnlyTextBox("Relationship", "关系", 3, 3),
        GetDatePicker2("FirstCallDate", "选择第一次拨打时间", 4, 1, "", false, "请选择第一次拨打时间"),
        GetDatePicker2("SecondCallDate", "选择第二次拨打时间", 4, 2, "", true, ""),
        GetDatePicker2("ThirdCallDate", "选择第三次拨打时间", 4, 3, "", true, ""),
        { Name: "QuestionTitle", Type: "SpanText", ClassName: "SpanTitle", X: 5, Y: 1, Text: "问题清单" },
        GetTextArea("Question1", "问题一", 6, 1, "：主要申请人身份信息", "请输入备注"),
        GetTextArea("Question2", "问题二", 7, 1, "：单位名称、单位地址", "请输入备注"),
        GetTextArea("Question3", "问题三", 8, 1, "：主要申请人住宅地址", "请输入备注"),
        GetTextArea("Question4", "问题四", 9, 1, "：主要申请人资产情况", "请输入备注"),
        GetTextArea("Question5", "问题五", 10, 1, "：主要申请人负债情况", "请输入备注"),
        GetTextArea("Question6", "问题六", 11, 1, "：主要申请人其他联系方式", "请输入备注"),
        GetTextArea("Question7", "问题七", 12, 1, "：主要申请人其他公司", "请输入备注"),
        GetTextArea("Question8", "问题八", 13, 1, "：主要申请人投资偏好/不良嗜好/是否购买保险以及家庭成员健康情况", "请输入备注"),
        GetTextArea("Question9", "问题九", 14, 1, "：主要申请人婚姻状况、子女情况", "请输入备注"),
        GetTextArea("Question10", "问题十", 15, 1, "：其他情况", "请输入备注")
    ]
}


function GetTextBox2(Name, Label, X, Y, ContorlType, PlaceHolder, MaxLength, IsNullable, addonAfter, ValidateNames, ValidateTipMessage) {
    return {
        ...GetTextBox(Name, Label, ContorlType, X, Y, PlaceHolder, MaxLength),
        ValidateNames, ValidateTipMessage,
        IsColon: false,
        IsFormItem: true, ColSpan: 8,
        LabelCol: 20,
        WrapperCol: 21,
        AddonAfter: addonAfter,
        IsNullable: IsNullable,
        IsEdit: true,
        ReadRightName: "KinsfolkContactCheckButtonView",
        Style: {
            display: "flex",
            flexDirection: "column",
            marginBottom: 10
        }
    }
}

function GetDatePicker2(Name, Label, X, Y, ControlType, IsNullable, PlaceHolder, DefaultValue) {
    return {
        ...GetDatePicker(Name, Label, X, Y, DefaultValue),
        IsColon: false,
        IsFormItem: true, ColSpan: 8,
        LabelCol: 20,
        WrapperCol: 21,
        IsNullable: IsNullable,
        PlaceHolder: PlaceHolder,
        ControlType: ControlType,
        IsShowTime: true,
        IsEdit: true,
        ReadRightName: "KinsfolkContactCheckButtonView",
        Style: {
            display: "flex",
            flexDirection: "column",
            marginBottom: 10
        }
    }
}

function GetTextArea(Name, Label, X, Y, ExLabel, PlaceHolder) {
    return {
        ...GetTextBox(Name, Label, "TextArea", X, Y),
        IsFormItem: true,
        IsNullable: true,
        IsAddOptional: true,
        ColSpan: 24,
        PlaceHolder,
        Rows: 4,
        LabelCol: 16,
        WrapperCol: 23,
        IsColon: false,
        IsClear: true,
        IsEdit: true,
        ReadRightName: "KinsfolkContactCheckButtonView",
        ExLabel,
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