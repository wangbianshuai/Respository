import { AssignProporties, GetTextBox, CreateGuid, GetButton } from "../../pages/Common";

var DataActionTypes = {}

export default (actionTypes) => {
    DataActionTypes = actionTypes;

    return {
        Name: "LoanReviewOpinionRecord",
        Type: "View",
        Title: "审核明细",
        Style: { marginTop: 8 },
        EventActionName: "GetLoanReviewOpinionRecord",
        GetEntityDataActionType: DataActionTypes.GetLoanReviewOpinionRecord,
        Properties: AssignProporties({}, [GetInfoView()])
    }
}

function GetInfoView() {
    return {
        Name: "RecordList",
        Type: "DataListView",
        DefaultValue: [{ Id: CreateGuid(), Title: "参会人员一" }, { Id: CreateGuid(), Title: "参会人员二" }],
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
        GetReadOnlyTextBox("Name", "姓名", 2, 1),
        GetReadOnlyTextBox("DeptName", "部门", 2, 2),
        GetReadOnlyTextBox("JobName", "职位", 2, 3),
        GetReadOnlyTextArea("BaseInfo", "基本情况", 3, 1),
        GetReadOnlyTextArea("CoreProblem", "核心问题", 4, 1),
        GetReadOnlyTextArea("Recommended", "建议措施", 5, 1),
        {
            Name: "DivInfoView3",
            Type: "View",
            ClassName: "DivInfoView3",
            IsDiv: true,
            X: 6, Y: 1,
            IsFormItem: true,
            IsAddOptional: false,
            ColSpan: 24,
            LabelCol: 2,
            WrapperCol: 22,
            Label: "全部附件",
            Style: {
                marginBottom: 10
            },
            Properties: AssignProporties({}, GetAttementProperties())
        },
        GetSpanText("BorrowerAmount", "审核结果：通过", 7, 1),
        { Name: "WhiteSpace1", Type: "WhiteSpace", ClassName: "WhiteSpace1", X: 8, Y: 1, IsLastNoVisible: true, ColSpan: 24, Style: { marginTop: 10, marginBottom: 10, } }
    ]
}

function GetAttementProperties() {
    return [
        { ...GetButton("ToAttachPage", "附件操作", ""), Icon: "upload", EventActionName: "ToAttachPage", Style: { marginRight: 20 } },
        { Name: "LeftRemark2", Type: "SpanText", ClassName: "SpanLabel2", Text: "", Label: "备注：跳转至影像平台进行上传或下载" },
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

function GetSpanText(Name, Text, X, Y) {
    return {
        Name, Text, X, Y,
        Type: "SpanText",
        Style: { color: "#0099FF" }
    }
}