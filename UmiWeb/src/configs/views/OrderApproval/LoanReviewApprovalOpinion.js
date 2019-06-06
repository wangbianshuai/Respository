import ApprovalOpinion from "../../entities/ApprovalOpinion";

import { AssignProporties, GetTextBox, GetButton } from "../../pages/Common";

var DataActionTypes = {}

export default (actionTypes) => {
    DataActionTypes = actionTypes;

    return {
        Name: "LoanReviewApprovalOpinion",
        Type: "View",
        Properties: AssignProporties({}, [GetInfoView(), GetRightButtonView()])
    }
}

function GetInfoView() {
    return {
        Name: "IndeedApprova2",
        Type: "RowsColsView",
        IsForm: true,
        LabelAlign: "left",
        Title: "审核意见",
        Style: { marginTop: 8 },
        Entity: ApprovalOpinion,
        EventActionName: "GetApprovalOpinion",
        GetEntityDataActionType: DataActionTypes.GetApprovalOpinion,
        SaveEntityDataActionType: DataActionTypes.SaveApprovalOpinion,
        Properties: AssignProporties({}, GetProperties())
    }
}

function GetRightButtonView() {
    return {
        Name: "ApprovalLeftRightButtonView",
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
    return { Name, Label, Type: "Radio", DataSource, Style: { marginLeft: 16 } , IsEdit: true, NullTipMessage: "请选择审批状态！", IsNullable: false }
}

function GetProperties() {
    return [
        {
            Name: "DivInfoView3",
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
        GetTextArea("BaseInfo", "基本情况", 2, 1, false),
        GetTextArea("CoreProblem", "核心问题", 3, 1, false),
        GetTextArea("Recommended", "建议措施", 4, 1, true)
    ]
}

function GetAttementProperties() {
    return [
        { ...GetButton("ToAttachPage", "附件操作", ""), Icon: "upload", EventActionName: "ToAttachPage", Style: { marginRight: 20 } },
        { Name: "LeftRemark2", Type: "SpanText", ClassName: "SpanLabel2", Text: "", Label: "备注：跳转至影像平台进行上传或下载" },
    ]
}

function GetTextArea(Name, Label, X, Y) {
    return {
        ...GetTextBox(Name, Label, "TextArea", X, Y),
        IsFormItem: true,
        IsNullable: true,
        IsColon: false,
        IsAddOptional: true,
        IsEdit: true,
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

function GetApprovalStatusDataSource() {
    return [{ Value: 1, Text: "同意" }, { Value: 2, Text: "拒绝" }, { Value: 3, Text: "退回至终审重做" }]
}
