import { AssignProporties, GetTextBox, GetButton, GetDatePicker } from "../../pages/Common";

export default {
    Name: "OwnerContactCheck",
    Type: "View",
    Properties: AssignProporties({}, [GetInfoView(), GetRightButtonView()])
}

function GetInfoView() {
    return {
        Name: "OwnerContactCheck2",
        Type: "RowsColsView",
        IsForm: true,
        LabelAlign: "left",
        Title: "借款人本人核实",
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
    { ...GetButton("SaveOwnerContactCheck", "保存", "primary"), EventActionName: "SaveOwnerContactCheck", Style: { marginRight: 36, width: 84 } }]
}

function GetProperties() {
    return [
        { Name: "TopRemark", Type: "SpanText", ClassName: "SpanLabel3", X: 1, Y: 1, Text: "核实描述：", Label: "通过与共同借款人本人进行沟通，可核实客户本人的个人基本信息、企业经营情况以及各种隐性信息；可将通过侧面询问、不同角度询问等多种方式获取信息，并将客户所陈述内容与反欺诈前期获取信息进行比较，并有针对提出疑问并要求客户回答。" },
        { Name: "WhiteSpace2", Type: "WhiteSpace", ClassName: "WhiteSpace2", X: 2, Y: 1, ColSpan: 24 },
        GetTextBox3("kinsfolkContactAddr", "本人电话", 3, 1, "decimal", "请输入", 11, false),
        GetDatePicker2("RegisterDate", "选择第一次拨打时间", 4, 1, "", false, "请选择第一次拨打时间"),
        GetDatePicker2("RegisterDate", "选择第二次拨打时间", 4, 2, "", true, ""),
        GetDatePicker2("RegisterDate", "选择第三次拨打时间", 4, 3, "", true, ""),
        { Name: "QuestionTitle", Type: "SpanText", ClassName: "SpanTitle", X: 5, Y: 1, Text: "问题清单" },
        GetTextArea("Question1", "问题一", 6, 1, "：贷款基本要素核实（获取借贷信息的来源、申请金额、期限、用途（需重视，并尽量交叉检验））", "请输入备注"),
        GetTextArea("Question1", "问题二", 7, 1, "：基本经营情况核实（单名单址、从业经历、主营品牌、淡季旺季、员工情况、上下游、生产周期）", "请输入备注"),
        GetTextArea("Question1", "问题三", 8, 1, "：利润情况（营业额、毛利率、净利率、净利润、工资支出、生活账单、资产折旧、采购成本、税务支出、隐形资产）", "请输入备注"),
        GetTextArea("Question1", "问题四", 9, 1, "：资产负债情况（自有资金、存货价值、固定资产、个人资产、隐形资产、信用卡使用情况、其他小贷公司贷款、还款压力、其他公司贷款申请）", "请输入备注"),
        GetTextArea("Question1", "问题五", 10, 1, "：家庭基本信息（宅址宅电、婚姻状况、子女情况、配偶工作情况、兴趣爱好、其他联系方式）", "请输入备注"),
        GetTextArea("Question1", "问题六", 11, 1, "：其他情况", "请输入备注")
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
        LabelCol: 20,
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