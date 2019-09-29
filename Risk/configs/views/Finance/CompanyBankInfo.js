const BankRecord = require("../../entities/BankRecord");

const { AssignProporties, GetTextBox, GetButton } = require("../../Common");

var DataActionTypes = {}

module.exports = (actionTypes) => {
    DataActionTypes = actionTypes;

    return {
        Name: "CompanyBankInfo",
        Type: "View",
        Properties: AssignProporties({ Name: "CompanyBankInfo" }, [GetInfoView(), GetRightButtonView()])
    }
}

function GetInfoView() {
    return {
        Name: "CompanyBankInfo2",
        Type: "View",
        Title: "对公银行流水信息",
        Style: { marginTop: 8 },
        PropertyName: "CompanyBankInfo",
        DefaultEditData: { ViewName: "CompanyBankInfo" },
        SaveEntityDataActionType: DataActionTypes.SaveCompanyFinanceInfo,
        Properties: AssignProporties({ Name: "CompanyBankInfo" }, [GetBankProperties()])
    }
}

function GetBankProperties() {
    return {
        Name: "CompanyBankList",
        Type: "DataListView",
        IsComplexEdit: true,
        IsFirstDelete: false,
        DeletePropertyName: "DeleteCompanyBank",
        PrimaryKey: "Id",
        Title: "银行卡",
        IsEdit: true,
        IsNullable: false,
        Properties: AssignProporties({ Name: "CompanyBankInfo" }, [{
            Name: "CompanyBankItemView",
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
        Name: "CompanyBankInfoButtonView",
        Type: "View",
        ClassName: "DivRightButton",
        IsDiv: true,
        Properties: AssignProporties({ Name: "CompanyBankInfo" }, GetRightButtonProperties())
    }
}

function GetRightButtonProperties() {
    return [{ ...GetButton("AddBank", "新增", ""), EventActionName: "AddCompanyBank", Style: { marginRight: 10 }, Icon: "plus" },
    { ...GetButton("SaveCompanyBankInfo", "保存", "primary"), Text2: "修改", EventActionName: "SaveCompanyBankInfo", Style: { marginRight: 36, width: 84 } }]
}

function GetBankItemProperties() {
    return [
        { Name: "Title", Type: "SpanText", X: 1, Y: 1, ClassName: "SpanTitle" },
        { ...GetButton("DeleteCompanyBank", "删除", "", 1, 2), RightNames: ["CompanyBankInfoButtonView"], EventActionName: "DeleteCompanyBank", Style: { marginLeft: 20, marginBottom: 10 }, Icon: "delete" },
        GetUpload("CompanyRecordFile", "对公贷流水", 2, 1, true),
        GetTextBox3("CompanyMonthAmount", "对公贷月均流水", 2, 2, "float", "请输入对公贷月均流水", 20, false, "元"),
        GetTextBox3("CompanyMonthInterest", "对公结息汇总", 2, 3, "float", "请输入对公结息汇总", 20, false, "元")
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
        ReadRightName: "CompanyBankInfoButtonView",
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
        ReadRightName: "CompanyBankInfoButtonView",
        Style: {
            display: "flex",
            flexDirection: "column",
            marginBottom: 10
        }
    }
}