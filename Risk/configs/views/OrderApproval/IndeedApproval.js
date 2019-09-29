const ApprovalOpinion =require( "../../entities/ApprovalOpinion");
const { AssignProporties, GetTextBox, GetButton } =require( "../../Common");

var DataActionTypes = {}

module.exports= (actionTypes) => {
    DataActionTypes = actionTypes;

    return {
        Name: "IndeedApprovalOpinion",
        Type: "View",
        Entity: ApprovalOpinion,
        EventActionName: "GetApprovalOpinion",
        GetEntityDataActionType: DataActionTypes.GetApprovalOpinion,
        Properties: AssignProporties({Name:"IndeedApprovalOpinion"}, [GetInfoView(), GetRightButtonView()])
    }
}

function GetInfoView() {
    return {
        Name: "IndeedApprovalOpinion2",
        Type: "RowsColsView",
        IsForm: true,
        LabelAlign: "left",
        Title: "实地审核",
        Style: { marginTop: 8 },
        SaveEntityDataActionType: DataActionTypes.SaveApprovalOpinion,
        Properties: AssignProporties(ApprovalOpinion, GetProperties())
    }
}

function GetRightButtonView() {
    return {
        Name: "ApprovalLeftRightButtonView",
        Type: "View",
        ClassName: "DivRightButton",
        IsDiv: true,
        Properties: AssignProporties({Name:"IndeedApprovalOpinion"}, GetRightButtonProperties())
    }
}

function GetRightButtonProperties() {
    return [{ ...GetButton("SaveApprovalOpinion", "提交", "primary"), IsDisabled: true, ConfirmTip: "请确认是否提交？", EventActionName: "SaveApprovalOpinion", Style: { marginRight: 36, width: 84 } }]
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
            Properties: AssignProporties({Name:"IndeedApprovalOpinion"}, GetAttementProperties())
        },
        GetTextArea("OpinionRemark", "备注", 5, 1),
    ]
}

function GetAttementProperties() {
    return [
        { Name: "LeftRemark", Type: "SpanText", ClassName: "SpanLabel2", Text: "附件", Label: "（选填）:" },
        { ...GetButton("ToAttachPage", "附件操作", ""), Icon: "upload", EventActionName: "ToAttachPage3", Style: { marginLeft: 8, marginRight: 20 } },
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
        ReadRightName: "SaveApprovalOpinion",
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