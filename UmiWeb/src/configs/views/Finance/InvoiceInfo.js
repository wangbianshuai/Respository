import { AssignProporties, GetTextBox, GetButton } from "../../pages/Common";

export default {
    Name: "InvoiceInfo",
    Type: "View",
    Properties: AssignProporties({}, [GetInfoView(), GetRightButtonView()])
}

function GetInfoView() {
    return {
        Name: "InvoiceInfo2",
        Type: "RowsColsView",
        IsForm: true,
        LabelAlign: "left",
        Title: "开票信息",
        Style: { marginTop: 8 },
        Properties: AssignProporties({}, GetProperties())
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
    return [
        { ...GetButton("SaveInvoiceInfo", "保存", "primary"), EventActionName: "SaveInvoiceInfo", Style: { marginRight: 36, width: 84 } }]
}

function GetProperties() {
    return [
        GetUpload("UploadRecord", "开票数据导入", 1, 1, false),
        GetTextBox3("kinsfolkContactMobile", "企业月均开票金额（近13～24个月）", 1, 2, "decimal", "请输入", 20, false, "元"),
        GetTextBox3("kinsfolkContactRelation", "企业月均开票金额（近12个月）", 1, 3, "decimal", "请输入", 20, false, "元")
    ]
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
        LabelCol: 20,
        WrapperCol: 20,
        IsEdit: true,
        Style: {
            display: "flex",
            flexDirection: "column",
            marginBottom: 10
        }
    }
}