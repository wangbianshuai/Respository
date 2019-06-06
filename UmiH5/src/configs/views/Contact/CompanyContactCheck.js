import CompanyContactCheck from "../../entities/CompanyContactCheck";

import { AssignProporties, GetTextBox, GetButton, GetDatePicker } from "../../pages/Common";

var DataActionTypes = {}

export default (actionTypes) => {
    DataActionTypes = actionTypes;

    return {
        Name: "CompanyContactCheck",
        Type: "View",
        Properties: AssignProporties({}, [GetInfoView(), GetRightButtonView()])
    }
}

function GetInfoView() {
    return {
        Name: "CompanyContactCheck2",
        Type: "RowsColsView",
        IsForm: true,
        LabelAlign: "left",
        Title: "单位相关信息核实",
        Style: { marginTop: 8 },
        GetEntityDataActionType: DataActionTypes.GetCompanyContactCheck,
        SaveEntityDataActionType: DataActionTypes.SaveCompanyContactCheck,
        Properties: AssignProporties(CompanyContactCheck, GetProperties())
    }
}

function GetRightButtonView() {
    return {
        Name: "CompanyContactCheckButtonView",
        Type: "View",
        ClassName: "DivRightButton",
        IsDiv: true,
        Properties: AssignProporties({}, GetRightButtonProperties())
    }
}

function GetRightButtonProperties() {
    return [{ ...GetButton("CompanyContactCheckClearEdit", "清空", ""), IsDisabled: true, ConfirmTip: "确认要清空问题内容吗？", EventActionName: "CompanyContactCheckClearEdit", Style: { marginRight: 10 } },
    { ...GetButton("SaveCompanyContactCheck", "保存", "primary"), IsDisabled: true, EventActionName: "SaveCompanyContactCheck", Style: { marginRight: 36, width: 84 } }]
}

function GetProperties() {
    return [
        { Name: "TopRemark", Type: "SpanText", ClassName: "SpanLabel3", X: 1, Y: 1, Text: "核实描述：", Label: "通过与借款企业员工的沟通，较为客观的了解客户企业的经营情况及业务情况，以备核实客户陈述企业信息的真伪。" },
        { Name: "WhiteSpace2", Type: "WhiteSpace", ClassName: "WhiteSpace2", X: 2, Y: 1, ColSpan: 24 },
        GetTextBox2("CompanyPhone", "单位电话", 3, 1, "", "请输入单位电话", 20, false, "", ["ValidateHomePhone", "ValidateMobile"], "单位电话格式不正确！"),
        GetDatePicker2("FirstCallDate", "选择第一次拨打时间", 4, 1, "", false, "请选择第一次拨打时间"),
        GetDatePicker2("SecondCallDate", "选择第二次拨打时间", 4, 2, "", true, ""),
        GetDatePicker2("ThirdCallDate", "选择第三次拨打时间", 4, 3, "", true, ""),
        { Name: "QuestionTitle", Type: "SpanText", ClassName: "SpanTitle", X: 5, Y: 1, Text: "问题清单" },
        GetTextArea("Question1", "问题一", 6, 1, "：公司名称、地址", "请输入备注"),
        GetTextArea("Question2", "问题二", 7, 1, "：主要申请人在公司职务", "请输入备注"),
        GetTextArea("Question3", "问题三", 8, 1, "：公司主营业务及品牌", "请输入备注"),
        GetTextArea("Question4", "问题四", 9, 1, "：上下游客户情况", "请输入备注"),
        GetTextArea("Question5", "问题五", 10, 1, "：淡旺季情况", "请输入备注"),
        GetTextArea("Question6", "问题六", 11, 1, "：员工情况/作息时间/工资发放情况/是否五险一金", "请输入备注"),
        GetTextArea("Question7", "问题七", 12, 1, "：主要申请人联系方式", "请输入备注"),
        GetTextArea("Question8", "问题八", 13, 1, "：其他情况", "请输入备注")
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
        ReadRightName: "CompanyContactCheckButtonView", 
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
        ReadRightName: "CompanyContactCheckButtonView", 
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
        LabelCol: 10,
        WrapperCol: 23,
        IsColon: false,
        IsClear: true,
        IsEdit: true,
        ReadRightName: "CompanyContactCheckButtonView", 
        ExLabel,
        Style: {
            display: "flex",
            flexDirection: "column",
            marginBottom: 10
        }
    }
}