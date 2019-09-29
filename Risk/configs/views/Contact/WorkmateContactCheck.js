const WorkmateContactCheck = require("../../entities/WorkmateContactCheck");

const { AssignProporties, GetTextBox, GetButton, GetDatePicker } = require("../../Common");

var DataActionTypes = {}

module.exports = (actionTypes) => {
    DataActionTypes = actionTypes;

    return {
        Name: "WorkmateContactCheck",
        Type: "View",
        Properties: AssignProporties({ Name: "WorkmateContactCheck" }, [GetInfoView(), GetRightButtonView()])
    }
}

function GetInfoView() {
    return {
        Name: "WorkmateContactCheck2",
        Type: "RowsColsView",
        IsForm: true,
        LabelAlign: "left",
        Title: "同事联系人核实",
        Style: { marginTop: 8 },
        Entity: WorkmateContactCheck,
        EventActionName: "GetWorkmateContactCheck",
        GetEntityDataActionType: DataActionTypes.GetWorkmateContactCheck,
        SaveEntityDataActionType: DataActionTypes.SaveWorkmateContactCheck,
        Properties: AssignProporties(WorkmateContactCheck, GetProperties())
    }
}

function GetRightButtonView() {
    return {
        Name: "WorkmateContactCheckButtonView",
        Type: "View",
        ClassName: "DivRightButton",
        IsDiv: true,
        Properties: AssignProporties({ Name: "WorkmateContactCheck" }, GetRightButtonProperties())
    }
}

function GetRightButtonProperties() {
    return [{ ...GetButton("ClearEdit", "清空", ""), IsDisabled: true, ConfirmTip: "确认要清空问题内容吗？", EventActionName: "WorkmateContactCheckClearEdit", Style: { marginRight: 10 } },
    { ...GetButton("SaveWorkmateContactCheck", "保存", "primary"), Text2: "修改", EventActionName: "SaveWorkmateContactCheck", Style: { marginRight: 36, width: 84 } }]
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
        GetTextArea("Question1", "问题一", 6, 1, "：单位名称、单位地址", "请输入备注"),
        GetTextArea("Question2", "问题二", 7, 1, "：单位联系人职务", "请输入备注"),
        GetTextArea("Question3", "问题三", 8, 1, "：主营业务及经营情况", "请输入备注"),
        GetTextArea("Question4", "问题四", 9, 1, "：上下游客户情况", "请输入备注"),
        GetTextArea("Question5", "问题五", 10, 1, "：淡旺季情况", "请输入备注"),
        GetTextArea("Question6", "问题六", 11, 1, "：员工情况/作息时间/工资发放情况/是否五险一金", "请输入备注"),
        GetTextArea("Question7", "问题七", 12, 1, "：其他情况", "请输入备注")
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
        ReadRightName: "WorkmateContactCheckButtonView",
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
        ReadRightName: "WorkmateContactCheckButtonView",
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
        ReadRightName: "WorkmateContactCheckButtonView",
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