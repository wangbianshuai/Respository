const InvoiceInfo = require("../../entities/InvoiceInfo");

const { AssignProporties, GetTextBox, GetButton } = require("../../Common");

var DataActionTypes = {}

module.exports = (actionTypes) => {
    DataActionTypes = actionTypes;

    return {
        Name: "InvoiceInfo",
        Type: "View",
        Properties: AssignProporties({ Name: "InvoiceInfo" }, [GetInfoView(), GetRightButtonView()])
    }
}

function GetInfoView() {
    return {
        Name: "InvoiceInfo2",
        Type: "RowsColsView",
        IsForm: true,
        LabelAlign: "left",
        Title: "开票信息",
        Style: { marginTop: 8 },
        PropertyName: "billInfo",
        DefaultEditData: { ViewName: "billInfo" },
        SaveEntityDataActionType: DataActionTypes.SaveFinalBaseInfo,
        Properties: AssignProporties(InvoiceInfo, GetProperties())
    }
}

function GetRightButtonView() {
    return {
        Name: "InvoiceInfoButtonView",
        Type: "View",
        ClassName: "DivRightButton",
        IsDiv: true,
        Properties: AssignProporties({ Name: "InvoiceInfo" }, GetRightButtonProperties())
    }
}

function GetRightButtonProperties() {
    return [
        { ...GetButton("SaveInvoiceInfo", "保存", "primary"), Text2: "修改", EventActionName: "SaveInvoiceInfo", Style: { marginRight: 36, width: 84 } }]
}

function GetProperties() {
    return [
        GetUpload("InvoiceFile", "开票数据导入", 1, 1, true),
        GetTextBox3("AvgInvoiceAmount24", "企业月均开票金额（近13～24个月）", 1, 2, "float", "请输入", 20, false, "元"),
        GetTextBox3("AvgInvoiceAmount12", "企业月均开票金额（近12个月）", 1, 3, "float", "请输入", 20, false, "元")
    ]
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
        ReadRightName: "InvoiceInfoButtonView",
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
        UploadUrl: "loanapproval/final/uploadBillInfo",
        ReadRightName: "InvoiceInfoButtonView",
        Style: {
            display: "flex",
            flexDirection: "column",
            marginBottom: 10
        }
    }
}