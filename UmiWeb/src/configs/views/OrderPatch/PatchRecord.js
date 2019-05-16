import { AssignProporties, GetTextBox, CreateGuid } from "../../pages/Common";

export default {
    Name: "PatchOperation",
    Type: "View",
    Title: "补件记录",
    Style: { marginTop: 8 },
    Properties: AssignProporties({}, [GetInfoView()])
}

function GetInfoView() {
    return {
        Name: "RecordList",
        Type: "DataListView",
        DefaultValue: [{ Id: CreateGuid(), Title: "补件编号：1020320101-001" }, { Id: CreateGuid(), Title: "补件编号：1020320101-002" }],
        IsComplexEdit: true,
        PrimaryKey: "Id",
        Properties: AssignProporties({}, [{
            Name: "RecordItemView",
            Type: "RowsColsView",
            IsForm: true,
            IsDiv: false,
            Properties: AssignProporties({}, GetItemProperties())
        }])
    }
}

function GetItemProperties() {
    return [
        { Name: "Title", Type: "SpanText", X: 1, Y: 1, ClassName: "SpanTitle", Style: { marginBottom: 16 } },
        GetReadOnlyTextBox("Borrowers", "发起时间", 2, 1),
        GetReadOnlyTextBox("BorrowerUser", "发起方", 2, 2),
        GetReadOnlyTextBox("BorrowerDate", "审核意见", 2, 3),
        GetReadOnlyTextArea("BorrowerAmount", "备注", 3, 1),
        GetReadOnlyTextBox("Borrowers", "提交时间", 4, 1),
        GetReadOnlyTextBox("BorrowerUser", "接收方", 4, 2),
        GetASpanText("BorrowerDate", "补件附件", "查看", "（跳转至影像平台）", 4, 3),
        GetReadOnlyTextArea("BorrowerAmount", "备注", 5, 1),
    ]
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

function GetASpanText(Name, Label, Text, ALabel, X, Y) {
    return {
        Name, Text, ALabel, X, Y, Label,
        IsFormItem: true, ColSpan: 8,
        Type: "ASpanText",
        ClassName: "SpanLabel2",
        Style: { lineHeight: "40px" }
    }
}