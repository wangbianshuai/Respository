import { AssignProporties, GetTextBox, GetButton } from "../../pages/Common";

export default {
    Name: "FinalApprovalOpinion",
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
    { ...GetButton("SaveFinalApprovalOpinion", "提交", "primary"), EventActionName: "SaveFinalApprovalOpinion", Style: { marginRight: 36, width: 84 } }]
}

export function GetRadio(Name, Label, DataSource) {
    return { Name, Label, Type: "Radio", DataSource, Style: { marginLeft: 16 } }
}

function GetProperties() {
    return [
        {
            Name: "RightButtonView",
            Type: "View",
            ClassName: "DivInfoView2",
            IsDiv: true,
            X: 4, Y: 1,
            Style: { paddingBottom: 16, paddingTop: 8 },
            Properties: AssignProporties({}, GetAttementProperties())
        },
        GetTextArea("BorrowerAmount", "备注", 5, 1),
    ]
}

function GetAttementProperties() {
    return [
        { Name: "LeftRemark", Type: "SpanText", ClassName: "SpanLabel2", Text: "附件", Label: "（选填）:" },
        { ...GetButton("ToAttachPage", "附件操作", ""), Icon: "upload", EventActionName: "ToAttachPage", Style: { marginLeft: 8, marginRight: 20 } },
        { Name: "LeftRemark2", Type: "SpanText", ClassName: "SpanLabel2", Text: "", Label: "备注：跳转至影像平台进行上传或下载" },
    ]
}

function GetTextArea(Name, Label, X, Y) {
    return {
        ...GetTextBox(Name, Label, "TextArea", X, Y),
        IsFormItem: true,
        IsNullable: true,
        IsAddOptional: true,
        ColSpan: 24,
        Rows: 4,
        LabelCol: 2,
        WrapperCol: 22,
        Style: {
            marginBottom: 10
        }
    }
}

function GetApprovalStatusDataSource() {
    return [{ Value: 1, Text: "同意" }, { Value: 2, Text: "拒绝" }, { Value: 3, Text: "返回补件" }, { Value: 4, Text: "退回至初审重做" }, { Value: 5, Text: "退回至实地重做" }]
}
