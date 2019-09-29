const BankRecord = require("../../entities/BankRecord");

const { AssignProporties, GetTextBox, GetButton } = require("../../Common");

var DataActionTypes = {}

module.exports = (actionTypes) => {
    DataActionTypes = actionTypes;

    return {
        Name: "PersonBankInfo",
        Type: "View",
        Properties: AssignProporties({ Name: "PersonBankInfo" }, [GetInfoView(), GetRightButtonView()])
    }
}

function GetInfoView() {
    return {
        Name: "PersonBankInfo2",
        Type: "View",
        Title: "对私银行流水信息",
        Style: { marginTop: 8 },
        PropertyName: "PersonBankInfo",
        DefaultEditData: { ViewName: "PersonBankInfo" },
        SaveEntityDataActionType: DataActionTypes.SaveCompanyFinanceInfo,
        Properties: AssignProporties({ Name: "PersonBankInfo" }, [GetBankProperties()])
    }
}

function GetBankProperties() {
    return {
        Name: "PersonBankList",
        Type: "DataListView",
        IsComplexEdit: true,
        IsFirstDelete: false,
        DeletePropertyName: "DeletePersonBank",
        PrimaryKey: "Id",
        Title: "银行卡",
        IsEdit: true,
        IsNullable: false,
        Properties: AssignProporties({ Name: "PersonBankInfo" }, [{
            Name: "PersonBankItemView",
            Type: "RowsColsView",
            IsForm: true,
            LabelAlign: "left",
            IsDiv: false,
            Properties: AssignProporties(BankRecord, GetBankItemProperties())
        }])
    }
}

function GetRightButtonView() {
    return {
        Name: "PersonBankInfoButtonView",
        Type: "View",
        ClassName: "DivRightButton",
        IsDiv: true,
        Properties: AssignProporties({ Name: "PersonBankInfo" }, GetRightButtonProperties())
    }
}

function GetRightButtonProperties() {
    return [{ ...GetButton("AddBank", "新增", ""), EventActionName: "AddPersonBank", Style: { marginRight: 10 }, Icon: "plus" },
    { ...GetButton("SavePersonBankInfo", "保存", "primary"), Text2: "修改", EventActionName: "SavePersonBankInfo", Style: { marginRight: 36, width: 84 } }]
}

function GetBankItemProperties() {
    return [
        { Name: "Title", Type: "SpanText", X: 1, Y: 1, ClassName: "SpanTitle" },
        { ...GetButton("DeletePersonBank", "删除", "", 1, 2), RightNames: ["PersonBankInfoButtonView"], EventActionName: "DeletePersonBank", Style: { marginLeft: 20, marginBottom: 10 }, Icon: "delete" },
        GetUpload("PersonRecordFile", "对私贷流水", 2, 1, true),
        GetTextBox3("PersonMonthAmount", "对私贷月均流水", 2, 2, "float", "请输入对私贷月均流水", 20, false, "元"),
        GetTextBox3("PersonMonthInterest", "对私结息汇总", 2, 3, "float", "请输入对私结息汇总", 20, false, "元")
    ]
}

function GetTextBox3(Name, Label, X, Y, DataType, PlaceHolder, MaxLength, IsNullable, addonAfter) {
    return {
        ...GetTextBox2(Name, Label, X, Y, "", PlaceHolder, MaxLength, IsNullable, addonAfter),
        DataType
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
        IsAddOptional: !!IsNullable,
        IsEdit: true,
        ReadRightName: "PersonBankInfoButtonView",
        Style: {
            display: "flex",
            flexDirection: "column",
            marginBottom: 10
        }
    }
}

function GetUpload(Name, Label, X, Y, IsNullable) {
    return {
        Name, Label, X, Y, IsNullable,
        Type: "Upload",
        Text: "上传文件",
        FileName: "file",
        ExtLabel: "支持扩展名：.xls、.xlsx",
        Accept: ".xls,.xlsx",
        IsInitState: true,
        FileSize: 1024 * 1024 * 10, FileSizeText: "10M",
        ExtStyle: { color: "#999999", marginLeft: 10 },
        IsColon: false,
        IsFormItem: true, ColSpan: 8,
        LabelCol: 20,
        WrapperCol: 21,
        UploadUrl: "loanapproval/firstApproval/uploadBankflowAndCalc",
        ReadRightName: "PersonBankInfoButtonView",
        Style: {
            display: "flex",
            flexDirection: "column",
            marginBottom: 10
        }
    }
}