import { AssignProporties, GetTextBox, CreateGuid } from "../../pages/Common";

export default {
    Name: "ReadRefundOrder",
    Type: "View",
    Title: "退单信息",
    Style: { marginTop: 8 },
    Properties: AssignProporties({}, [GetInfoView()])
}

function GetInfoView() {
    return {
        Name: "RecordList",
        Type: "DataListView",
        DefaultValue: [{ Id: CreateGuid(), Title: "退单编号：1020320101-001" }, { Id: CreateGuid(), Title: "退单编号：1020320101-002" }],
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
        GetReadOnlyTextArea("BorrowerAmount", "备注", 3, 1)
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