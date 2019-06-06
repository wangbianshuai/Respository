import CompanyBaseInfo from "../../entities/CompanyBaseInfo";

import { AssignProporties, GetTextBox, GetSelect, GetButton } from "../../pages/Common";

var DataActionTypes = {}

export default (actionTypes) => {
    DataActionTypes = actionTypes;
    return {
        Name: "CompanyBaseInfo",
        Type: "View",
        Properties: AssignProporties({}, [GetInfoView(), GetRightButtonView()])
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
        PropertyName: "CompanyBaseInfo",
        DefaultEditData: { ViewName: "CompanyBaseInfo" },
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
        Properties: AssignProporties({}, GetRightButtonProperties())
    }
}

function GetRightButtonProperties() {
    return [{ ...GetButton("SaveCompanyBaseInfo", "保存", "primary"), EventActionName: "SaveCompanyBaseInfoEntityData", Style: { marginRight: 36, width: 84 } }]
}

function GetProperties() {
    return [
        GetReadOnlyTextBox("CompanyName", "公司名称", 1, 1),
        GetReadOnlyTextBox("CompanyIdNumber", "统一社会信用代码", 1, 2),
        GetReadOnlyTextBox("LegalPersonName", "公司名称", 2, 1),
        GetReadOnlyTextBox("LegalPersonIdNumber", "统一社会信用代码", 2, 2),
        GetReadOnlyTextBox("RegisterDate", "成立时间", 2, 3),
        GetReadOnlyTextBox("RegisterAmount", "注册资金", 3, 1, "万元"),
        GetReadOnlyTextBox("ManageYears", "经营年限", 3, 2, "年"),
        GetReadOnlyTextBox("CompanyAddress", "单位地址", 3, 3),
        GetReadOnlyTextBox("CompanyTelephone", "单位电话", 4, 1),
        GetReadOnlyTextBox("CompanyEmail", "单位邮箱", 4, 2),
        GetSelect3("Industry1", "行业门类", 4, 3, true, "请选择行业门类", null, null, ["Industry2"]),
        GetSelect3("Industry2", "行业大类", 5, 1, true, "请选择行业大类", "Industry1", "parentId", ["Industry3"]),
        GetSelect3("Industry3", "行业中类", 5, 2, true, "请选择行业中类", "Industry2", "parentId", ["Industry4"]),
        GetSelect3("Industry4", "行业小类", 5, 3, true, "请选择行业小类", "Industry3", "parentId"),
        GetReadOnlySelect("CompanyHouseStatus", "办公地是否租赁", CompanyBaseInfo.HouseStatusDataSource, 6, 1),
        GetReadOnlyTextBox("CompanyHousePeriod", "租赁有效期限", 6, 2),
        GetReadOnlyTextBox("CompanyElectricityCode", "办公地电费单号", 6, 3),
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

function GetSelect3(name, label, x, y, isNullable, placeHolder, parentName, parentPropertyName, childNames) {
    const p = GetEditSelect(name, label, null, x, y, isNullable, placeHolder);
    p.ParentName = parentName;
    p.ParentPropertyName = parentPropertyName;
    p.ChildNames = childNames;
    p.ServiceDataSource = { ValueName: "id", TextName: "categoryName", IsLocal: true }

    return p;
}

function GetEditSelect(Name, Label, DataSource, X, Y, IsNullable, PlaceHolder, DefaultValue) {
    return {
        ...GetSelect(Name, Label, DataSource, X, Y, DefaultValue),
        IsColon: false,
        IsFormItem: true, ColSpan: 8,
        LabelCol: 10,
        WrapperCol: 21,
        IsNullable: IsNullable,
        IsAddOptional: !!IsNullable,
        PlaceHolder: PlaceHolder,
        IsEdit: true,
        ReadRightName: "CompanyBaseInfoButtonView",
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