import { AssignProporties, GetTextBox, GetButton } from "../../pages/Common";

export default {
    Name: "LoanReviewApprovalOpinion",
    Type: "View",
    Properties: AssignProporties({}, [GetInfoView(), GetRightButtonView()])
}

function GetInfoView() {
    return {
        Name: "IndeedApprova2",
        Type: "RowsColsView",
        IsForm: true,
        Title: "审核意见",
        Style: { marginTop: 8 },
        Properties: AssignProporties({}, GetProperties())
    }
}

function GetRightButtonView() {
    return {
        Name: "RightButtonView",
        Type: "View",
        ClassName: "DivLeftRightButton",
        IsDiv: true,
        Properties: AssignProporties({}, GetRightButtonProperties())
    }
}

function GetRightButtonProperties() {
    return [GetRadio("ApproveStatus", "", GetApprovalStatusDataSource()),
    { ...GetButton("SaveLoanReviewApprovalOpinion", "提交", "primary"), EventActionName: "SaveLoanReviewApprovalOpinion", Style: { marginRight: 36, width: 84 } }]
}

export function GetRadio(Name, Label, DataSource) {
    return { Name, Label, Type: "Radio", DataSource, Style: { marginLeft: 16 } }
}

function GetProperties() {
    return [
        {
            Name: "RightButtonView",
            Type: "View",
            ClassName: "DivInfoView3",
            IsDiv: true,
            X: 1, Y: 1,
            IsFormItem: true,
            IsAddOptional: true,
            ColSpan: 24,
            LabelCol: 3,
            WrapperCol: 21,
            Label: "附件",
            Style: {
                marginBottom: 10
            },
            Properties: AssignProporties({}, GetAttementProperties())
        },
        GetTextArea("BorrowerAmount", "基本情况", 2, 1, false),
        GetTextArea("BorrowerAmount", "核心问题", 3, 1, false),
        GetTextArea("BorrowerAmount", "建议措施", 4, 1, true)
    ]
}

function GetAttementProperties() {
    return [
         { ...GetButton("ToAttachPage", "附件操作", ""), Icon: "upload", EventActionName: "ToAttachPage", Style: {marginRight: 20 } },
        { Name: "LeftRemark2", Type: "SpanText", ClassName: "SpanLabel2", Text: "", Label: "备注：跳转至影像平台进行上传或下载" },
    ]
}

function GetTextArea(Name, Label, X, Y, IsNullable) {
    return {
        ...GetTextBox(Name, Label, "TextArea", X, Y),
        IsFormItem: true,
        IsAddOptional: !!IsNullable,
        ColSpan: 24,
        Rows: 4,
        LabelCol: 3,
        WrapperCol: 21,
        PlaceHolder: "请输入备注",
        Style: {
            marginBottom: 10
        }
    }
}

function GetApprovalStatusDataSource() {
    return [{ Value: 1, Text: "同意" }, { Value: 2, Text: "拒绝" }, { Value: 3, Text: "退回至终审重做" }]
}
