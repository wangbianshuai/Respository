import RefundOrder from "../../entities/RefundOrder";

import { AssignProporties, GetTextBox } from "../../pages/Common";

var DataActionTypes = {}

export default (actionTypes, blGet) => {
    DataActionTypes = actionTypes;

    const view = {
        Name: "ReadRefundOrder",
        Type: "View",
        Title: "退单信息",
        Style: { marginTop: 8 },
        Properties: AssignProporties({}, [GetInfoView()])
    }

    if (blGet) {
        view.Entity = RefundOrder;
        view.EventActionName = "GetExitOrderInfo";
        view.GetEntityDataActionType = DataActionTypes.GetExitOrderInfo;
    }
    else {
        view.PropertyName = "RefundOrder";
    }

    return view;
}

function GetInfoView() {
    return {
        Name: "RecordList",
        Type: "DataListView",
        IsComplexEdit: true,
        PrimaryKey: "Id",
        Properties: AssignProporties({}, [{
            Name: "RecordItemView",
            Type: "RowsColsView",
            IsForm: true,
            IsDiv: false,
            LabelAlign: "left",
            Properties: AssignProporties(RefundOrder, GetItemProperties())
        }])
    }
}

function GetItemProperties() {
    return [
        { Name: "Title", Type: "SpanText", X: 1, Y: 1, ClassName: "SpanTitle", Style: { marginBottom: 16 } },
        GetReadOnlyTextBox("CreateDate", "发起时间", 2, 1),
        GetReadOnlyTextBox("CreateUser", "发起方", 2, 2),
        GetReadOnlyTextBox("ApprovalOpinion", "审核意见", 2, 3),
        GetReadOnlyTextArea("ApprovalRemark", "备注", 3, 1)
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