import FinalApprovalResult from "../../entities/FinalApprovalResult";
import { AssignProporties, GetTextBox } from "../../pages/Common";

var DataActionTypes = {}

export default (actionTypes) => {
    DataActionTypes = actionTypes;

    return {
        Name: "FinalApprovalResult",
        Type: "RowsColsView",
        IsForm: true,
        LabelAlign: "left",
        Title: "终审授信结论",
        Entity: FinalApprovalResult,
        Style: { marginTop: 8 },
        EventActionName: "GetFinalApprovalResult",
        GetEntityDataActionType: DataActionTypes.GetFinalApprovalResult,
        Properties: AssignProporties(FinalApprovalResult, GetProperties())
    }
}

function GetProperties() {
    return [
        GetSpanText("SpanInfo1", "授信信息", "SpanTitle", 1, 1),
        GetReadOnlyTextBox("ApprovedLoanAmount", "批复借款金额", 2, 1, "元"),
        GetReadOnlyTextBox("ApprovedLoanPeriod", "批复借款期限", 2, 2),
        GetReadOnlyTextBox("ApprovedLoanRate", "批复借款年化利率", 2, 3, "%"),
        GetSpanText("SpanInfo2", "还款方式", "SpanTitle", 3, 1),
        GetReadOnlyTextBox("BackMethod", "还款方式", 4, 1),
        GetReadOnlyTextBox("StagingMode", "分期方式", 4, 2, "日"),
        GetReadOnlyTextBox("YearRateMode", "年化计算方式", 4, 3),
        GetSpanText("SpanInfo3", "信息管理费率", "SpanTitle", 5, 1),
        GetReadOnlyTextBox("InfoManageRate", "信息管理费率", 6, 1),
        GetReadOnlyTextBox("ManageCollectionType", "收取类型", 6, 2),
        GetReadOnlyTextBox("ManageCollectionMethod", "收取方式", 6, 3),
        GetSpanText("SpanInfo4", "信息服务费率", "SpanTitle", 7, 1),
        GetReadOnlyTextBox("InfoServiceRate", "信息服务费率", 8, 1),
        GetReadOnlyTextBox("ServiceCollectionType", "收取类型", 8, 2),
        GetReadOnlyTextBox("ServiceCollectionMethod", "收取方式", 8, 3)
    ]
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

function GetSpanText(name, text, className, x, y) {
    return { Name: name, Type: "SpanText", Text: text, IsEdit: false, ClassName: className, X: x, Y: y }
}