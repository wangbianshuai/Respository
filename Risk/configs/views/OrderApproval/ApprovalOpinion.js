const ApprovalOpinion =require( "../../entities/ApprovalOpinion");
const { AssignProporties, GetTextBox, GetButton } =require( "../../Common");

var DataActionTypes = {}

module.exports= (actionTypes) => {
    DataActionTypes = actionTypes;

    return {
        Name: "ApprovalOpinion",
        Type: "View",
        Entity: ApprovalOpinion,
        EventActionName: "GetApprovalOpinion",
        GetEntityDataActionType: DataActionTypes.GetApprovalOpinion,
        Properties: AssignProporties({Name:"ApprovalOpinion"}, [GetInfoView(), GetRightButtonView()])
    }
}

function GetInfoView() {
    return {
        Name: "ApprovalOpinion2",
        Type: "RowsColsView",
        IsForm: true,
        Title: "审核意见",
        LabelAlign: "left",
        Style: { marginTop: 8 },
        SaveEntityDataActionType: DataActionTypes.SaveApprovalOpinion,
        Properties: AssignProporties(ApprovalOpinion, GetProperties())
    }
}

function GetRightButtonView() {
    return {
        Name: "ApprovalOpinionRightButtonView",
        Type: "View",
        ClassName: "DivLeftRightButton",
        IsDiv: true,
        Properties: AssignProporties(ApprovalOpinion, GetRightButtonProperties())
    }
}

function GetRightButtonProperties() {
    return [GetRadio("ApproveStatus", "", GetApprovalStatusDataSource()),
    { ...GetButton("SaveApprovalOpinion", "提交", "primary"), IsDisabled: true, ConfirmTip: "请确认是否提交？", EventActionName: "SaveApprovalOpinion", Style: { marginRight: 36, width: 84 } }]
}

function GetRadio(Name, Label, DataSource) {
    return { Name, Label, Type: "Radio", DataSource, Style: { marginLeft: 16 }, IsEdit: true, ReadRightName: "SaveApprovalOpinion", NullTipMessage: "请选择审批状态！", IsNullable: false }
}

function GetProperties() {
    return [
        {
            Name: "RightButtonView",
            Type: "View",
            ClassName: "DivInfoView2",
            IsDiv: true,
            X: 1, Y: 1,
            Style: { paddingBottom: 16, paddingTop: 8 },
            Properties: AssignProporties({Name:"FinalApprovalOpinion"}, GetAttementProperties())
        },
        GetTextArea("OpinionRemark", "备注", 2, 1),
    ]
}

function GetAttementProperties() {
    return [
        { Name: "LeftRemark", Type: "SpanText", ClassName: "SpanLabel2", Text: "附件", Label: "（选填）:" },
        { ...GetButton("ToAttachPage", "附件操作", ""), Icon: "upload", EventActionName: "ToAttachPage2", Style: { marginLeft: 8, marginRight: 20 } },
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

/*信贷员确认：01 审批通过  09 退回终审重审*/
function GetApprovalStatusDataSource() {
    return [{ Value: "01", Text: "同意" }, { Value: "09", Text: "发起终审重审" }]
}
