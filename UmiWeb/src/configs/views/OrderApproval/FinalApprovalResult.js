import { AssignProporties, GetTextBox } from "../../pages/Common";

export default {
    Name: "FinalApprovalResult",
    Type: "RowsColsView",
    IsForm: true,
    LabelAlign: "left",
    Title: "终审授信结论",
    Style: { marginTop: 8 },
    Properties: AssignProporties({}, GetProperties())
}

function GetProperties() {
    return [
        GetSpanText("Contact1Info", "授信信息", "SpanTitle", 1, 1),
        GetReadOnlyTextBox("Borrowers", "批复借款金额", 2, 1,"元"),
        GetReadOnlyTextBox("BorrowerUser", "批复借款期限", 2, 2),
        GetReadOnlyTextBox("BorrowerDate", "批复借款年化利率", 2, 3,"%"),
        GetSpanText("Contact1Info", "还款方式", "SpanTitle", 3, 1),
        GetReadOnlyTextBox("Borrowers", "还款方式", 4, 1),
        GetReadOnlyTextBox("BorrowerUser", "分期方式", 4, 2,"日"),
        GetReadOnlyTextBox("BorrowerDate", "年化计算方式", 4, 3),
        GetSpanText("Contact1Info", "信息管理费率", "SpanTitle", 5, 1),
        GetReadOnlyTextBox("Borrowers", "信息管理费率", 6, 1),
        GetReadOnlyTextBox("BorrowerUser", "收取类型", 6, 2),
        GetReadOnlyTextBox("BorrowerDate", "收取方式", 6, 3),
        GetSpanText("Contact1Info", "信息服务费率", "SpanTitle", 7, 1),
        GetReadOnlyTextBox("Borrowers", "信息服务费率", 8, 1),
        GetReadOnlyTextBox("BorrowerUser", "收取类型", 8, 2),
        GetReadOnlyTextBox("BorrowerDate", "收取方式", 8, 3)
    ]
}

function GetReadOnlyTextBox(Name, Label, X, Y, addonAfter) {
    return {
        ...GetTextBox(Name, Label, "", X, Y, "", 200),
        IsColon: false,
        IsFormItem: true, ColSpan: 8,
        LabelCol: 10,
        WrapperCol: 20,
        IsReadOnly: true,
        AddonAfter: addonAfter,
        Value: "测试数据1" + Label,
        Style: {
            display: "flex",
            flexDirection: "column",
            marginBottom: 10
        }
    }
}

function GetSpanText(name, text, className, x, y) {
    return { Name: name, Type: "SpanText", Text: text, IsEdit: false, ClassName: className, X: x, Y: y }
}