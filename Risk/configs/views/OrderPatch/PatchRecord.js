const Patch =require( "../../entities/Patch");
const { AssignProporties, GetTextBox } =require( "../../Common");

var DataActionTypes = {}
var _IsFinalApproval = false;

module.exports= (actionTypes, blGet, blFinalApproval) => {
    DataActionTypes = actionTypes;
    _IsFinalApproval = blFinalApproval;

    const view = {
        Name: "PatchRecord",
        Type: "View",
        Title: "补件记录",
        Style: { marginTop: 8 },

        Properties: AssignProporties({Name:"PatchRecord"}, [GetInfoView()])
    }

    if (blGet) {
        view.Entity = Patch;
        view.EventActionName = "GetPatchRecordEntityData";
        view.GetEntityDataActionType = DataActionTypes.GetPatchRecordEntityData;
    }
    else {
        view.PropertyName = "PatchRecord";
    }

    return view;
}

function GetInfoView() {
    return {
        Name: "RecordList",
        Type: "DataListView",
        IsComplexEdit: true,
        PrimaryKey: "Id",
        Properties: AssignProporties({Name:"PatchRecord"}, [{
            Name: "RecordItemView",
            Type: "RowsColsView",
            IsForm: true,
            IsDiv: false,
            LabelAlign: "left",
            Properties: AssignProporties(Patch, GetItemProperties())
        }])
    }
}

function GetItemProperties() {
    return [
        { Name: "Title", Type: "SpanText", X: 1, Y: 1, ClassName: "SpanTitle", Style: { marginBottom: 16 } },
        GetReadOnlyTextBox("CreateDate", "发起时间", 2, 1),
        GetReadOnlyTextBox("CreateUser", "发起方", 2, 2),
        GetReadOnlyTextBox("ApprovalOpinionName", "审核意见", 2, 3),
        GetReadOnlyTextArea("ApprovalRemark", "备注", 3, 1),
        GetReadOnlyTextBox("SubmitDate", "提交时间", 4, 1),
        GetReadOnlyTextBox("ReceiveUser", "接收方", 4, 2),
        GetASpanText("ToAttachPage", "补件附件", "查看", "（跳转至影像平台）", 4, 3),
        GetReadOnlyTextArea("PatchRemark", "备注", 5, 1),
    ]
}

function GetReadOnlyTextArea(Name, Label, X, Y) {
    return {
        ...GetTextBox(Name, Label, "TextArea", X, Y),
        IsFormItem: true,
        IsReadOnly: true,
        IsColon: false,
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

function GetASpanText(Name, Label, Text, ALabel, X, Y) {
    return {
        Name, Text, ALabel, X, Y, Label,
        IsFormItem: true, ColSpan: 8,
        Type: "ASpanText",
        ClassName: "SpanLabel2",
        EventActionName: _IsFinalApproval ? "ToAttachPage5" : "ToAttachPage1",
        Style: { lineHeight: "40px" }
    }
}