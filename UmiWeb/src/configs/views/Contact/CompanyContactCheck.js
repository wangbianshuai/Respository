import { AssignProporties, GetTextBox, GetButton, GetDatePicker } from "../../pages/Common";

export default {
    Name: "CompanyContactCheck",
    Type: "View",
    Properties: AssignProporties({}, [GetInfoView(), GetRightButtonView()])
}

function GetInfoView() {
    return {
        Name: "CompanyContactCheck2",
        Type: "RowsColsView",
        IsForm: true,
        LabelAlign: "left",
        Title: "单位相关信息核实",
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
    return [{ ...GetButton("ClearEdit", "清空", ""), EventActionName: "ClearEdit", Style: { marginRight: 10 } },
    { ...GetButton("SaveCompanyContactCheck", "保存", "primary"), EventActionName: "SaveCompanyContactCheck", Style: { marginRight: 36, width: 84 } }]
}

function GetProperties() {
    return [
        { Name: "TopRemark", Type: "SpanText", ClassName: "SpanLabel3", X: 1, Y: 1, Text: "核实描述：", Label: "通过与借款企业员工的沟通，较为客观的了解客户企业的经营情况及业务情况，以备核实客户陈述企业信息的真伪。" },
        { Name: "WhiteSpace2", Type: "WhiteSpace", ClassName: "WhiteSpace2", X: 2, Y: 1, ColSpan: 24 },
        GetTextBox3("kinsfolkContactAddr", "单位电话", 3, 1, "decimal", "请输入", 11, false),
        GetDatePicker2("RegisterDate", "选择第一次拨打时间", 4, 1, "", false, "请选择第一次拨打时间"),
        GetDatePicker2("RegisterDate", "选择第二次拨打时间", 4, 2, "", true, ""),
        GetDatePicker2("RegisterDate", "选择第三次拨打时间", 4, 3, "", true, ""),
        { Name: "QuestionTitle", Type: "SpanText", ClassName: "SpanTitle", X: 5, Y: 1, Text: "问题清单" },
        GetTextArea("Question1", "问题一", 6, 1, "：公司名称、地址", "请输入备注"),
        GetTextArea("Question1", "问题二", 7, 1, "：主要申请人在公司职务", "请输入备注"),
        GetTextArea("Question1", "问题三", 8, 1, "：公司主营业务及品牌", "请输入备注"),
        GetTextArea("Question1", "问题四", 9, 1, "：上下游客户情况", "请输入备注"),
        GetTextArea("Question1", "问题五", 10, 1, "：淡旺季情况", "请输入备注"),
        GetTextArea("Question1", "问题六", 11, 1, "：员工情况/作息时间/工资发放情况/是否五险一金", "请输入备注"),
        GetTextArea("Question1", "问题七", 12, 1, "：主要申请人联系方式", "请输入备注"),
        GetTextArea("Question1", "问题八", 13, 1, "：其他情况", "请输入备注")
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

function GetDatePicker2(Name, Label, X, Y, ControlType, IsNullable, PlaceHolder, DefaultValue) {
    return {
        ...GetDatePicker(Name, Label, X, Y, DefaultValue),
        IsColon: false,
        IsFormItem: true, ColSpan: 8,
        LabelCol: 10,
        WrapperCol: 20,
        IsNullable: IsNullable,
        PlaceHolder: PlaceHolder,
        ControlType: ControlType,
        IsShowTime: true,
        IsEdit: true,
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
        ExLabel,
        Style: {
            display: "flex",
            flexDirection: "column",
            marginBottom: 10
        }
    }
}