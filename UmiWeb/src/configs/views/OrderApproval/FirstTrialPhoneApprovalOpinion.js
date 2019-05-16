import { AssignProporties, GetTextBox, GetButton } from "../../pages/Common";

export default {
    Name: "FirstTrialPhoneApprovalOpinion",
    Type: "View",
    Properties: AssignProporties({}, [GetInfoView(), GetRightButtonView()])
}

function GetInfoView() {
    return {
        Name: "FirstTrialPhoneApprovalOpinion2",
        Type: "RowsColsView",
        IsForm: true,
        Title: "审核意见",
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
    return [GetRadio("ApproveStatus", "", GetApprovalStatusDataSource()),
    { ...GetButton("SavePatchInfo", "提交", "primary"), EventActionName: "SavePatchInfo", Style: { marginRight: 36, width: 84 } }]
}

export function GetRadio(Name, Label, DataSource) {
    return { Name, Label, Type: "Radio", DataSource, Style: { marginLeft: 16 } }
}

function GetProperties() {
    return [
        GetTextArea("BorrowerAmount", "备注", 1, 1),
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

function GetApprovalStatusDataSource() {
    return [{ Value: 1, Text: "同意并流转至实地" }, { Value: 2, Text: "同意并流转至终审" }, { Value: 3, Text: "拒绝" }, { Value: 4, Text: "返回补件" }]
}
