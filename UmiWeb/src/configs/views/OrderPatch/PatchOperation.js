import { AssignProporties, GetTextBox, GetButton } from "../../pages/Common";

export default {
    Name: "PatchOperation",
    Type: "View",
    Properties: AssignProporties({}, [GetInfoView(), GetRightButtonView()])
}

function GetInfoView() {
    return {
        Name: "PatchInfo",
        Type: "RowsColsView",
        IsForm: true,
        Title: "补件操作",
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
    return [{ Name: "InfoTip", Type: "SpanText", ClassName: "RedSpanTip", Text: "重要提醒：剩余可操作时间还有14天3小时28分，到期后补件超时则视为补件失败而被拒单" },
    { ...GetButton("SavePatchInfo", "提交", "primary"), EventActionName: "SavePatchInfo", Style: { marginRight: 36, width: 84 } }]
}

function GetProperties() {
    return [
        GetReadOnlyTextBox("Borrowers", "发起时间", 1, 1),
        GetReadOnlyTextBox("BorrowerUser", "发起方", 1, 2),
        GetReadOnlyTextBox("BorrowerDate", "审核意见", 1, 3),
        GetReadOnlyTextArea("BorrowerAmount", "备注", 2, 1),
        { Name: "WhiteSpace1", Type: "WhiteSpace", ClassName: "WhiteSpace1", X: 3, Y: 1, ColSpan: 24 },
        {
            Name: "RightButtonView",
            Type: "View",
            ClassName: "DivInfoView2",
            IsDiv: true,
            X: 4, Y: 1,
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

function GetReadOnlyTextArea(Name, Label, X, Y) {
    return {
        ...GetTextBox(Name, Label, "TextArea", X, Y),
        IsFormItem: true,
        IsReadOnly: true,
        ColSpan: 24,
        Rows: 4,
        LabelCol: 2,
        WrapperCol: 22,
        Value: "测试数据1" + Label,
        Style: {
            marginBottom: 10
        }
    }
}

function GetReadOnlyTextBox(Name, Label, X, Y, addonAfter) {
    return {
        ...GetTextBox(Name, Label, "", X, Y, "", 200),
        IsFormItem: true, ColSpan: 8,
        IsReadOnly: true,
        AddonAfter: addonAfter,
        Value: "测试数据1" + Label
    }
}