const CompanyBaseInfo = require("../../entities/CompanyBaseInfo");

const { AssignProporties, GetTextBox, GetSelect, GetButton } = require("../../Common");

var DataActionTypes = {}

module.exports = (actionTypes) => {
    DataActionTypes = actionTypes;
    return {
        Name: "CompanyBaseInfo",
        Type: "View",
        Properties: AssignProporties({ Name: "CompanyBaseInfo" }, [GetInfoView(), GetRightButtonView()])
    }
}

function GetInfoView() {
    return {
        Name: "CompanyBaseInfo2",
        Type: "RowsColsView",
        Entity: CompanyBaseInfo,
        IsForm: true,
        LabelAlign: "left",
        Title: "公司基本信息",
        Style: { marginTop: 8 },
        PropertyName: "enterprise",
        DefaultEditData: { ViewName: "enterprise" },
        SaveEntityDataActionType: DataActionTypes.SaveApprovalOrderDetail,
        Properties: AssignProporties(CompanyBaseInfo, GetProperties())
    }
}

function GetRightButtonView() {
    return {
        Name: "CompanyBaseInfoButtonView",
        Type: "View",
        ClassName: "DivRightButton",
        IsDiv: true,
        Properties: AssignProporties({ Name: "CompanyBaseInfo" }, GetRightButtonProperties())
    }
}

function GetRightButtonProperties() {
    return [{ ...GetButton("SaveCompanyBaseInfo", "保存", "primary"), Text2: "修改", EventActionName: "SaveCompanyBaseInfoEntityData", Style: { marginRight: 36, width: 84 } }]
}

function GetProperties() {
    return [
        GetReadOnlyTextBox("CompanyName", "企业名称", 1, 1),
        GetReadOnlyTextBox("CompanyIdNumber", "统一社会信用代码", 1, 2),
        { ...GetReadOnlyTextBox("businessLicenseUrl", "营业执照", 1, 3, "查看"), IsAddonAfterOpenUrl: true },
        { ...GetReadOnlyTextBox("RegisterDate", "成立时间", 2, 1), IsDate: true },
        GetReadOnlyTextBox("RegisterAmount", "注册资金", 2, 2, "万元"),
        GetReadOnlyTextBox("ManageYears", "经营年限", 2, 3, "年"),
        GetReadOnlyTextBox("CompanyAddress", "单位地址", 3, 1),
        GetReadOnlyTextBox("CompanyTelephone", "单位电话", 3, 2),
        GetReadOnlyTextBox("CompanyEmail", "单位邮箱", 3, 3),
        GetReadOnlyTextBox("Industry1", "行业门类", 4, 1),
        GetReadOnlyTextBox("Industry2", "行业大类", 4, 2),
        GetReadOnlyTextBox("Industry3", "行业中类", 4, 3),
        GetReadOnlyTextBox("Industry4", "行业小类", 5, 1),
        GetReadOnlySelect("CompanyHouseStatus", "办公地是否租赁", CompanyBaseInfo.HouseStatusDataSource, 5, 2),
        GetReadOnlyTextBox("CompanyHousePeriod", "租赁有效期限", 5, 3),
        GetReadOnlyTextBox("CompanyElectricityCode", "办公地电费单号", 6, 1),
        { Name: "WhiteSpace1", Type: "WhiteSpace", ClassName: "WhiteSpace1", Style: { marginBottom: 20 }, X: 7, Y: 1, ColSpan: 24 },
        GetTextArea("ApprovalRemark", "备注", 8, 1, "请输入备注")
    ]
}

function GetTextArea(Name, Label, X, Y, PlaceHolder) {
    return {
        ...GetTextBox(Name, Label, "TextArea", X, Y, PlaceHolder),
        IsFormItem: true,
        IsNullable: true,
        IsColon: false,
        IsAddOptional: true,
        IsEdit: true,
        ReadRightName: "CompanyBaseInfoButtonView",
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

function GetReadOnlySelect(Name, Label, DataSource, X, Y) {
    return {
        ...GetSelect(Name, Label, DataSource, X, Y),
        IsColon: false,
        IsFormItem: true, ColSpan: 8,
        LabelCol: 10,
        WrapperCol: 21,
        IsReadOnly: true,
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