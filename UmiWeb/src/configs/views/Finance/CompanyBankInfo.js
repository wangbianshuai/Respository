import { AssignProporties, GetTextBox, GetButton, CreateGuid } from "../../pages/Common";

export default {
    Name: "CompanyBankInfo",
    Type: "View",
    Properties: AssignProporties({}, [GetInfoView(), GetRightButtonView()])
}

function GetInfoView() {
    return {
        Name: "CompanyBankInfo2",
        Type: "View",
        Title: "对公银行流水信息",
        Style: { marginTop: 8 },
        Properties: AssignProporties({}, [GetBankProperties()])
    }
}

function GetBankProperties() {
    return {
        Name: "CompanyBankList",
        Type: "DataListView",
        DefaultValue: [{ Id: CreateGuid(), Title: "银行卡一" }],
        IsComplexEdit: true,
        IsFirstDelete: false,
        DeletePropertyName: "DeleteCompanyBank",
        PrimaryKey: "Id",
        Title: "银行卡",
        Properties: AssignProporties({}, [{
            Name: "CompanyBankItemView",
            Type: "RowsColsView",
            IsForm: true,
            LabelAlign: "left",
            IsDiv: false,
            Properties: AssignProporties({}, GetBankItemProperties())
        }])
    }
}

function GetRightButtonView() {
    return {
        Name: "RightButtonView",
        Type: "View",
        ClassName: "DivRightButton",
        IsDiv: true,
        Properties: AssignProporties({}, GetRightButtonProperties())
    }
}

function GetRightButtonProperties() {
    return [{ ...GetButton("AddBank", "新增", ""), EventActionName: "AddCompanyBank", Style: { marginRight: 10 }, Icon: "plus" },
    { ...GetButton("SaveCompanyBankInfo", "保存", "primary"), EventActionName: "SaveCompanyBankInfo", Style: { marginRight: 36, width: 84 } }]
}

function GetBankItemProperties() {
    return [
        { Name: "Title", Type: "SpanText", X: 1, Y: 1, ClassName: "SpanTitle" },
        { ...GetButton("DeleteCompanyBank", "删除", "", 1, 2), EventActionName: "DeleteCompanyBank", Style: { marginLeft: 20, marginBottom: 10 }, Icon: "delete" },
        GetUpload("UploadRecord", "对公贷流水", 2, 1, false),
        GetTextBox2("HouserAddress", "对公贷月均流水", 2, 2, "decimal", "", 20, false, "元"),
        GetTextBox3("HoustSpace", "对公结息汇总", 2, 3, "decimal", "", 20, false, "元")
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
        LabelCol: 10,
        WrapperCol: 20,
        AddonAfter: addonAfter,
        IsNullable: IsNullable,
        IsAddOptional: !!IsNullable,
        IsEdit: true,
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
        ExtLabel: "支持扩展名：.xls、.xlsx",
        Accept: ".xls,.xlsx",
        IsInitState: true,
        FileSize: 1024 * 1024 * 10, FileSizeText: "10M",
        ExtStyle: { color: "#999999", marginLeft: 10 },
        IsColon: false,
        IsFormItem: true, ColSpan: 8,
        LabelCol: 10,
        WrapperCol: 20,
        IsEdit: true,
        Style: {
            display: "flex",
            flexDirection: "column",
            marginBottom: 10
        }
    }
}