const Patch =require( "../../entities/Patch");
const { AssignProporties, GetTextBox, GetButton } =require( "../../Common");

var DataActionTypes = {}

module.exports= (actionTypes) => {
    DataActionTypes = actionTypes;

    return {
        Name: "PatchOperation",
        Type: "View",
        Properties: AssignProporties({Name:"PatchOperation"}, [GetInfoView(), GetRightButtonView()])
    }
}

function GetInfoView() {
    return {
        Name: "PatchInfo",
        Type: "RowsColsView",
        IsForm: true,
        Title: "补件操作",
        Style: { marginTop: 8 },
        LabelAlign: "left",
        Entity: Patch,
        EventActionName: "GetPatchInfoEntityData",
        GetEntityDataActionType: DataActionTypes.GetPatchInfoEntityData,
        SaveEntityDataActionType: DataActionTypes.SavePatchInfoEntityData,
        Properties: AssignProporties(Patch, GetProperties())
    }
}

function GetRightButtonView() {
    return {
        Name: "PatchInfoRightButtonView",
        Type: "View",
        ClassName: "DivLeftRightButton",
        IsDiv: true,
        Properties: AssignProporties({Name:"PatchOperation"}, GetRightButtonProperties())
    }
}

function GetRightButtonProperties() {
    return [{ Name: "InfoTip", Type: "SpanText", ClassName: "RedSpanTip" },
    { ...GetButton("SavePatchInfo", "提交", "primary"), ConfirmTip: "请确认是否提交？", IsDisabled: true, EventActionName: "SavePatchInfoEntityData", Style: { marginRight: 36, width: 84 } }]
}

function GetProperties() {
    return [
        GetReadOnlyTextBox("CreateDate", "发起时间", 1, 1),
        GetReadOnlyTextBox("CreateUser", "发起方", 1, 2),
        GetReadOnlyTextBox("ApprovalOpinionName", "审核意见", 1, 3),
        GetReadOnlyTextArea("ApprovalRemark", "备注", 2, 1),
        { Name: "WhiteSpace1", Type: "WhiteSpace", ClassName: "WhiteSpace1", X: 3, Y: 1, ColSpan: 24 },
        {
            Name: "RightButtonView",
            Type: "View",
            ClassName: "DivInfoView2",
            IsDiv: true,
            X: 4, Y: 1,
            Properties: AssignProporties({Name:"PatchOperation"}, GetAttementProperties())
        },
        GetTextArea("PatchRemark", "备注", 5, 1),
    ]
}

function GetAttementProperties() {
    return [
        { Name: "LeftRemark", Type: "SpanText", ClassName: "SpanLabel2", Text: "附件", Label: "（选填）:" },
        { ...GetButton("ToAttachPage", "附件操作", ""), Icon: "upload", EventActionName: "ToAttachPage1", Style: { marginLeft: 8, marginRight: 20 } },
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
        ReadRightName: "PatchInfoRightButtonView",
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