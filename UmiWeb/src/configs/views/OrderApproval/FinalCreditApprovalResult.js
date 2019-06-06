import ApprovalOpinion from "../../entities/ApprovalOpinion";
import { AssignProporties, GetTextBox, GetSelect, GetButton } from "../../pages/Common";

var DataActionTypes = {}

export default (actionTypes) => {
    DataActionTypes = actionTypes;

    return {
        Name: "FinalCreditApprovalResult",
        Type: "View",
        Properties: AssignProporties({}, [GetInfoView(), GetRightButtonView()])
    }
}

function GetInfoView() {
    return {
        Name: "FinalCreditApprovalResult2",
        Type: "RowsColsView",
        IsForm: true,
        LabelAlign: "left",
        Title: "终审授信结论",
        Style: { marginTop: 8 },
        Entity: ApprovalOpinion,
        EventActionName: "GetApprovalOpinion",
        GetEntityDataActionType: DataActionTypes.GetApprovalOpinion,
        SaveEntityDataActionType: DataActionTypes.SaveApprovalOpinion,
        Properties: AssignProporties({}, GetProperties())
    }
}

function GetRightButtonView() {
    return {
        Name: "ApprovalLeftRightButtonView",
        Type: "View",
        ClassName: "DivRightButton",
        IsDiv: true,
        Properties: AssignProporties({}, GetRightButtonProperties())
    }
}

function GetRightButtonProperties() {
    return [
        { ...GetButton("SaveFinalCreditApprovalResult", "保存", "primary"), EventActionName: "SaveFinalCreditApprovalResult", Style: { marginRight: 36, width: 84 } }]
}

function GetProperties() {
    return [
        GetSpanText("Contact1Info", "授信信息", "SpanTitle", 1, 1),
        GetTextBox3("kinsfolkContactRelation", "批复借款金额", 2, 1, "float", "请输入批复借款金额", 20, false, "元"),
        GetEditSelect("mortgage", "批复借款期限", GetApproveLoanPeriodDataSource(), 2, 2, false, "请选择批复借款期限"),
        GetTextBox3("kinsfolkContactRelation", "批复借款年化利率", 2, 3, "float", "请输入批复借款年化利率", 6, false, "元"),
        GetSpanText("Contact2Info", "还款方式", "SpanTitle", 3, 1),
        GetEditSelect("mortgage", "还款方式", GetBackMethodDataSource(), 4, 1, false, "请选择还款方式"),
        GetTextBox2("BorrowerUser", "分期方式", 4, 2, "", "请输入分期方式", false),
        GetTextBox2("BorrowerDate", "年化计算方式", 4, 3, "", "请输入年化计算方式", 50, false),
        GetSpanText("Contact1Info", "信息管理费率", "SpanTitle", 5, 1),
        GetEditSelect("Borrowers", "信息管理费率", GetInfoManageDataSource(), 6, 1, false, "请选择信息管理费率"),
        GetTextBox2("BorrowerUser", "收取类型", 6, 2, "", "请输入收取类型", 50, false),
        GetTextBox2("BorrowerDate", "收取方式", 6, 3, "", "请输入收取方式", 50, false),
        GetSpanText("Contact1Info", "信息服务费率", "SpanTitle", 7, 1),
        GetEditSelect("Borrowers", "信息服务费率", GetInfoServiceDataSource(), 8, 1, false, "请选择信息服务费率"),
        GetTextBox2("BorrowerUser", "收取类型", 8, 2, "", "请输入收取类型", 50, false),
        GetTextBox2("BorrowerDate", "收取方式", 8, 3, "", "请输入收取方式", 50, false),
        GetSpanText("Contact1Info", "罚息费率", "SpanTitle", 9, 1),
        GetEditSelect("Borrowers", "罚息费率", GetFineRateDataSource(), 10, 1, false, "请选择罚息费率")
    ]
}


function GetEditSelect(Name, Label, DataSource, X, Y, IsNullable, PlaceHolder, DefaultValue) {
    return {
        ...GetSelect(Name, Label, DataSource, X, Y, DefaultValue),
        IsColon: false,
        IsFormItem: true, ColSpan: 8,
        LabelCol: 10,
        WrapperCol: 20,
        IsNullable: IsNullable,
        IsAddOptional: !!IsNullable,
        PlaceHolder: PlaceHolder,
        IsEdit: true,
        Style: {
            display: "flex",
            flexDirection: "column",
            marginBottom: 10
        }
    }
}

function GetTextBox2(Name, Label, X, Y, ContorlType, PlaceHolder, MaxLength, IsNullable, addonAfter) {
    return {
        ...GetTextBox(Name, Label, ContorlType, X, Y, PlaceHolder, MaxLength),
        IsColon: false,
        IsFormItem: true, ColSpan: 8,
        LabelCol: 20,
        WrapperCol: 20,
        AddonAfter: addonAfter,
        IsNullable: IsNullable,
        IsEdit: true,
        Style: {
            display: "flex",
            flexDirection: "column",
            marginBottom: 10
        }
    }
}

function GetTextBox3(Name, Label, X, Y, DataType, PlaceHolder, MaxLength, IsNullable, addonAfter) {
    return {
        ...GetTextBox2(Name, Label, X, Y, "", PlaceHolder, MaxLength, IsNullable, addonAfter),
        DataType
    }
}

function GetSpanText(name, text, className, x, y) {
    return { Name: name, Type: "SpanText", Text: text, IsEdit: false, ClassName: className, X: x, Y: y }
}

function GetApproveLoanPeriodDataSource() {
    return [{ Value: "OrderCode", Text: "工单编号" }, { Value: "Borrowers", Text: "借款主体" }, { Value: "MainLoanUser", Text: "主借人" }]
}

function GetBackMethodDataSource() {
    return [{ Value: "OrderCode", Text: "工单编号" }, { Value: "Borrowers", Text: "借款主体" }, { Value: "MainLoanUser", Text: "主借人" }]
}

function GetInfoManageDataSource() {
    return [{ Value: "OrderCode", Text: "工单编号" }, { Value: "Borrowers", Text: "借款主体" }, { Value: "MainLoanUser", Text: "主借人" }]
}

function GetInfoServiceDataSource() {
    return [{ Value: "OrderCode", Text: "工单编号" }, { Value: "Borrowers", Text: "借款主体" }, { Value: "MainLoanUser", Text: "主借人" }]
}

function GetFineRateDataSource() {
    return [{ Value: "OrderCode", Text: "工单编号" }, { Value: "Borrowers", Text: "借款主体" }, { Value: "MainLoanUser", Text: "主借人" }]
}