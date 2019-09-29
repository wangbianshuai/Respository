const ApprovalOpinion =require( "../../entities/ApprovalOpinion");
const { AssignProporties, GetTextBox, GetButton } =require( "../../Common");

var DataActionTypes = {}

module.exports= (actionTypes) => {
    DataActionTypes = actionTypes;

    return {
        Name: "FinalReviewApprovalOpinion",
        Type: "View",
        Entity: ApprovalOpinion,
        EventActionName: "GetApprovalOpinion",
        GetEntityDataActionType: DataActionTypes.GetApprovalOpinion,
        Properties: AssignProporties({Name:"FinalReviewApprovalOpinion"}, [GetInfoView(), GetRightButtonView()])
    }
}

function GetInfoView() {
    return {
        Name: "FinalReviewApprovalOpinion2",
        Type: "RowsColsView",
        IsForm: true,
        LabelAlign: "left",
        Title: "审核意见",
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
    { ...GetButton("SaveApprovalOpinion", "提交", "primary"),   IsDisabled: true, ConfirmTip: "请确认是否提交？",EventActionName: "SaveApprovalOpinion", Style: { marginRight: 36, width: 84 } }]
}

function GetRadio(Name, Label, DataSource) {
    return { Name, Label, Type: "Radio", DataSource, Style: { marginLeft: 16 } , IsEdit: true, ReadRightName: "SaveApprovalOpinion", NullTipMessage: "请选择审批状态！", IsNullable: false }
}

function GetProperties() {
    return [
        GetTextArea("OpinionRemark", "备注", 1, 1),
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

/*终审复核：01 审批通过  06退回终审重做*/
function GetApprovalStatusDataSource() {
    return [{ Value: "01", Text: "同意" }, { Value: "06", Text: "回退至终审重审" }]
}
