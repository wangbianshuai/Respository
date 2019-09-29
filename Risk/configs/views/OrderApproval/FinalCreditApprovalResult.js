const FinalApprovalResult = require("../../entities/FinalApprovalResult");
const { AssignProporties, GetTextBox, GetSelect, GetButton } = require("../../Common");

var DataActionTypes = {}

module.exports = (actionTypes) => {
    DataActionTypes = actionTypes;

    return {
        Name: "FinalCreditApprovalResult",
        Type: "View",
        Properties: AssignProporties({ Name: "FinalCreditApprovalResult" }, [GetInfoView(), GetRightButtonView()])
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
        Entity: FinalApprovalResult,
        EventActionName: "GetFinalCreditApprovalResult",
        GetEntityDataActionType: DataActionTypes.GetFinalCreditApprovalResult,
        SaveEntityDataActionType: DataActionTypes.SaveFinalCreditApprovalResult,
        Properties: AssignProporties(FinalApprovalResult, GetProperties()),
        Properties1: AssignProporties(FinalApprovalResult, GetProperties1())
    }
}

function GetRightButtonView() {
    return {
        Name: "FinalCreditApprovalResultButtonView",
        Type: "View",
        ClassName: "DivRightButton",
        IsDiv: true,
        Properties: AssignProporties({ Name: "FinalCreditApprovalResult" }, GetRightButtonProperties())
    }
}

function GetRightButtonProperties() {
    return [
        { ...GetButton("AddServiceRate2", "新增服务费率", ""), EventActionName: "AddServiceRate2", Style: { marginRight: 10 }, Icon: "plus" },
        { ...GetButton("SaveFinalCreditApprovalResult", "保存", "primary"), Text2: "修改", EventActionName: "SaveFinalCreditApprovalResult", Style: { marginRight: 36, width: 84 } }]
}

function GetProperties() {
    return [
        GetSpanText("SpanInfo1", "授信信息", "SpanTitle", 1, 1),
        GetTextBox3("ApprovedLoanAmount", "批复借款金额", 2, 1, "float", "请输入批复借款金额", 20, false, "元"),
        {
            ...GetEditSelect2("ApprovedLoanPeriodValue", "批复借款期限", GetApprovedLoanPeriodDataSource(), 2, 2, false, "请选择批复借款期限"),
            SelectDataToProperties: ["ApprovedLoanRate"],
            ListName: "loanProductInterestRateList", IsOnlyInit: true,
            ExpandSetDataList: "SetApprovedLoanPeriodDataList",
        },
        { IsReadOnly: true, ...GetTextBox3("ApprovedLoanRate", "批复借款年化利率", 2, 3, "float", "请输入批复借款年化利率", 6, false, "%", 0, 100) },
        GetSpanText("SpanInfo2", "还款方式", "SpanTitle", 3, 1),
        {
            ...GetEditSelect2("BackMethodId", "还款方式模版", FinalApprovalResult.BackMethodDataSource, 4, 1, false, "请选择还款方式"),
            SelectDataToProperties: ["BackMethod", "StagingMode", "YearRateMode"], IsJudgeNullable: false,
            ListName: "repayWayList"
        },
        GetReadOnlyTextBox2("BackMethod", "还款方式", 4, 2, "", FinalApprovalResult.BackMethodDataSource2),
        { IsReadOnly: true, IsEdit: true, ...GetTextBox4("StagingMode", "分期方式", 4, 3, "int", "", 3, true, FinalApprovalResult.PeriodUnitDataSource, "periodWayUnit", "03") },
        GetReadOnlyTextBox2("YearRateMode", "年化计算方式", 5, 1, "", FinalApprovalResult.YearRateMethodDataSource),
        GetSpanText("SpanInfo3", "信息管理费率", "SpanTitle", 6, 1),
        {
            ...GetEditSelect2("InfoManageId", "费率模版", FinalApprovalResult.InfoManageDataSource, 7, 1, false, "请选择信息管理费率"),
            SelectDataToProperties: ["InfoManageRate", "ManageCollectionType", "ManageCollectionMethod"], IsJudgeNullable: false,
            ListName: "loanProductFeeList", ExpandSetDataList: "SetInfoManageRateList"
        },
        GetReadOnlyTextBox2("InfoManageRate", "信息管理费率", 7, 2),
        GetReadOnlyTextBox2("ManageCollectionType", "收取类型", 7, 3, "", FinalApprovalResult.CollectionTypeDataSource),
        GetReadOnlyTextBox2("ManageCollectionMethod", "收取方式", 8, 1, "", FinalApprovalResult.CollectionMethodDataSource),
        GetSpanText("SpanInfo4", "信息服务费率", "SpanTitle", 9, 1),
        {
            ...GetEditSelect2("InfoServiceId", "费率模版", FinalApprovalResult.InfoServiceDataSource, 10, 1, false, "请选择信息服务费率"),
            SelectDataToProperties: ["InfoServiceRate", "ServiceCollectionType", "ServiceCollectionMethod"], IsJudgeNullable: false,
            ListName: "loanProductFeeList", ExpandSetDataList: "SetInfoServiceRateList"
        },
        GetReadOnlyTextBox2("InfoServiceRate", "信息服务费率", 10, 2),
        GetReadOnlyTextBox2("ServiceCollectionType", "收取类型", 10, 3, "", FinalApprovalResult.CollectionTypeDataSource),
        GetReadOnlyTextBox2("ServiceCollectionMethod", "收取方式", 11, 2, "", FinalApprovalResult.CollectionMethodDataSource),
        GetInfoServiceRateView2(12, 1),
        GetSpanText("SpanInfo5", "罚息费率", "SpanTitle", 15, 1),
        {
            ...GetEditSelect2("FineRateId", "罚息费率", FinalApprovalResult.FineRateDataSource, 16, 1, false, "请选择罚息费率"),
            SelectDataToProperties: ["FineRate"], IsJudgeNullable: false,
            ListName: "loanProductFeeList", ExpandSetDataList: "SetFineRateList"
        },
        GetReadOnlyTextBox2("FineRate", "罚息费率", 16, 2),
    ]
}


function GetProperties1() {
    return [
        GetSpanText("SpanInfo1", "授信信息", "SpanTitle", 1, 1),
        GetTextBox3("ApprovedLoanAmount", "批复借款金额", 2, 1, "float", "请输入批复借款金额", 20, false, "元"),
        {
            ...GetEditSelect2("ApprovedLoanPeriodValue", "批复借款期限", GetApprovedLoanPeriodDataSource(), 2, 2, false, "请选择批复借款期限"),
            SelectDataToProperties: ["ApprovedLoanRate"],
            ListName: "loanProductInterestRateList", IsOnlyInit: true,
            ExpandSetDataList: "SetApprovedLoanPeriodDataList",
        },
        { IsReadOnly: true, ...GetTextBox3("ApprovedLoanRate", "批复借款年化利率", 2, 3, "float", "请输入批复借款年化利率", 6, false, "%", 0, 100) },
        GetSpanText("SpanInfo2", "还款方式", "SpanTitle", 3, 1),
        GetReadOnlyTextBox2("BackMethod", "还款方式", 4, 1, "", FinalApprovalResult.BackMethodDataSource2),
        { IsReadOnly: true, IsEdit: true, ...GetTextBox4("StagingMode", "分期方式", 4, 2, "int", "", 3, true, FinalApprovalResult.PeriodUnitDataSource, "periodWayUnit", "03") },
        GetReadOnlyTextBox2("YearRateMode", "年化计算方式", 4, 3, "", FinalApprovalResult.YearRateMethodDataSource),
        GetSpanText("SpanInfo3", "信息管理费率", "SpanTitle", 6, 1),
        GetReadOnlyTextBox2("InfoManageRate", "信息管理费率", 7, 1),
        GetReadOnlyTextBox2("ManageCollectionType", "收取类型", 7, 2, "", FinalApprovalResult.CollectionTypeDataSource),
        GetReadOnlyTextBox2("ManageCollectionMethod", "收取方式", 7, 3, "", FinalApprovalResult.CollectionMethodDataSource),
        GetSpanText("SpanInfo4", "信息服务费率", "SpanTitle", 9, 1),
        GetReadOnlyTextBox2("InfoServiceRate", "信息服务费率", 10, 1),
        GetReadOnlyTextBox2("ServiceCollectionType", "收取类型", 10, 2, "", FinalApprovalResult.CollectionTypeDataSource),
        GetReadOnlyTextBox2("ServiceCollectionMethod", "收取方式", 10, 3, "", FinalApprovalResult.CollectionMethodDataSource),
        GetInfoServiceRateView2Read(12, 1),
        GetSpanText("SpanInfo5", "罚息费率", "SpanTitle", 15, 1),
        GetReadOnlyTextBox2("FineRate", "罚息费率", 16, 2),
    ]
}

function GetInfoServiceRateView2Read(X, Y) {
    return {
        Name: "InfoServiceRateView2",
        Type: "RowsColsView",
        IsEdit: true,
        IsView: true,
        X, Y,
        IsDiv: false,
        ColSpan: 24,
        IsVisible: false,
        IsColVisible: true,
        IsFormView: true,
        IsFormItem: true,
        Properties: AssignProporties({ Name: "FinalCreditApprovalResult" },GetGetInfoServiceRateProperties1())
    }
}

function GetInfoServiceRateView2(X, Y) {
    return {
        Name: "InfoServiceRateView2",
        Type: "RowsColsView",
        IsEdit: true,
        IsView: true,
        X, Y,
        IsDiv: false,
        ColSpan: 24,
        IsVisible: false,
        IsColVisible: true,
        IsFormView: true,
        IsFormItem: true,
        Properties: AssignProporties({ Name: "FinalCreditApprovalResult" },GetGetInfoServiceRateProperties())
    }
}

function GetGetInfoServiceRateProperties1() {
    return [
        GetSpanText("SpanInfo6", "信息服务费率二", "SpanTitle", 12, 1),
        { ...GetButton("DeleteHouse", "删除", "", 12, 2), IsDisabled: true, RightNames: ["FinalCreditApprovalResultButtonView"], EventActionName: "DeleteInfoService2", Style: { marginLeft: 20, marginBottom: 10 }, Icon: "delete" },
        GetReadOnlyTextBox2("InfoServiceRate2", "信息服务费率", 13, 1),
        GetReadOnlyTextBox2("ServiceCollectionType2", "收取类型", 13, 2, "", FinalApprovalResult.CollectionTypeDataSource),
        GetReadOnlyTextBox2("ServiceCollectionMethod2", "收取方式", 13, 3, "", FinalApprovalResult.CollectionMethodDataSource),
    ]
}

function GetGetInfoServiceRateProperties() {
    return [
        GetSpanText("SpanInfo6", "信息服务费率二", "SpanTitle", 12, 1),
        { ...GetButton("DeleteHouse", "删除", "", 12, 2), IsDisabled: true, RightNames: ["FinalCreditApprovalResultButtonView"], EventActionName: "DeleteInfoService2", Style: { marginLeft: 20, marginBottom: 10 }, Icon: "delete" },
        {
            ...GetEditSelect2("InfoServiceId2", "费率模版", FinalApprovalResult.InfoServiceDataSource, 13, 1, false, "请选择信息服务费率"),
            SelectDataToProperties: ["InfoServiceRate2", "ServiceCollectionType2", "ServiceCollectionMethod2"],
            ListName: "loanProductFeeList", ExpandSetDataList: "SetInfoServiceRateList2",
            IsJudgeNullable: false
        },
        GetReadOnlyTextBox2("InfoServiceRate2", "信息服务费率", 13, 2),
        GetReadOnlyTextBox2("ServiceCollectionType2", "收取类型", 13, 3, "", FinalApprovalResult.CollectionTypeDataSource),
        GetReadOnlyTextBox2("ServiceCollectionMethod2", "收取方式", 14, 2, "", FinalApprovalResult.CollectionMethodDataSource),
    ]
}

function GetTextBox4(Name, Label, X, Y, DataType, PlaceHolder, MaxLength, IsNullable, addonAfter, PropertyName2, DefaultValue2) {
    return {
        ...GetTextBox2(Name, Label, X, Y, "", PlaceHolder, MaxLength, IsNullable, ""),
        AddonAfterDataSource: addonAfter,
        PropertyName2,
        DefaultValue2,
        DataType,
        SelectStyle: { width: 80 }
    }
}

function GetReadOnlyTextBox2(Name, Label, X, Y, addonAfter, dataSource) {
    return {
        ...GetTextBox(Name, Label, "", X, Y, "", 200),
        IsColon: false,
        IsFormItem: true, ColSpan: 8,
        LabelCol: 20,
        WrapperCol: 21,
        IsReadOnly: true,
        IsEdit: true,
        AddonAfter: addonAfter,
        DataSource: dataSource,
        Style: {
            display: "flex",
            flexDirection: "column",
            marginBottom: 10
        }
    }
}

function GetEditSelect2(Name, Label, DataSource, X, Y, IsNullable, PlaceHolder, DefaultValue) {
    return {
        ...GetEditSelect(Name, Label, null, X, Y, IsNullable, PlaceHolder, DefaultValue),
        ServiceDataSource: DataSource
    }
}

function GetEditSelect(Name, Label, DataSource, X, Y, IsNullable, PlaceHolder, DefaultValue) {
    return {
        ...GetSelect(Name, Label, DataSource, X, Y, DefaultValue),
        IsColon: false,
        IsFormItem: true, ColSpan: 8,
        LabelCol: 20,
        WrapperCol: 21,
        IsNullable: IsNullable,
        IsAddOptional: !!IsNullable,
        PlaceHolder: PlaceHolder,
        IsEdit: true,
        IsLoadValue: false,
        ReadRightName: "FinalCreditApprovalResultButtonView",
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
        WrapperCol: 21,
        AddonAfter: addonAfter,
        IsNullable: IsNullable,
        IsEdit: true,
        ReadRightName: "FinalCreditApprovalResultButtonView",
        Style: {
            display: "flex",
            flexDirection: "column",
            marginBottom: 10
        }
    }
}

function GetTextBox3(Name, Label, X, Y, DataType, PlaceHolder, MaxLength, IsNullable, addonAfter, MinValue, MaxValue) {
    return {
        ...GetTextBox2(Name, Label, X, Y, "", PlaceHolder, MaxLength, IsNullable, addonAfter),
        DataType, MinValue, MaxValue
    }
}

function GetSpanText(name, text, className, x, y) {
    return { Name: name, Type: "SpanText", Text: text, IsEdit: false, ClassName: className, X: x, Y: y }
}

function GetApprovedLoanPeriodDataSource() {
    return {
        ValueName: "PeriodValue",
        TextName: "PeriodName",
        StateName: "ProductRateList",
        ServiceName: "ProductRateService",
        ActionName: "GetDataList",
        IsRefresh: true,
        Payload: {
            pageRequest: {
                pageNum: 1,
                pageSize: 1000
            }
        }
    }
}