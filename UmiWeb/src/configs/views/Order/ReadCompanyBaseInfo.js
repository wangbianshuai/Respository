import Order from "../../entities/Order";

import { AssignProporties, GetTextBox, GetSelect, GetButton } from "../../pages/Common";

export default {
    Name: "CompanyBaseInfo",
    Type: "View",
    Properties: AssignProporties({}, [GetInfoView(), GetRightButtonView()])
}

function GetInfoView() {
    return {
        Name: "CompanyBaseInfo2",
        Type: "RowsColsView",
        Entity: Order,
        IsForm: true,
        LabelAlign: "left",
        Title: "公司基本信息",
        Style: { marginTop: 8 },
        Properties: AssignProporties(Order, GetProperties())
    }
}

function GetRightButtonView() {
    return {
        Name: "RightButtonView",
        Type: "View",
        ClassName: "DivRightButton",
        IsDiv: true,
        Properties: AssignProporties(Order, GetRightButtonProperties())
    }
}

function GetRightButtonProperties() {
    return [{ ...GetButton("SaveCompanyBaseInfo", "保存", "primary"), EventActionName: "SaveCompanyBaseInfo", Style: { marginRight: 36, width: 84 } }]
}

function GetProperties() {
    return [
        GetReadOnlyTextBox("CompanyName", "公司名称", 1, 1),
        GetReadOnlyTextBox("CompanyNo", "统一社会信用代码", 1, 2),
        GetReadOnlyTextBox("RegisterDate", "成立时间", 1, 3),
        GetReadOnlyTextBox("RegisterAmount", "注册资金", 2, 1, "元"),
        GetReadOnlyTextBox("ManageYears", "经营年限", 2, 2, "年"),
        GetReadOnlyTextBox("CompanyAddress", "单位地址", 2, 3),
        GetReadOnlyTextBox("CompanyTelephone", "单位电话", 3, 1),
        GetReadOnlyTextBox("CompanyEmail", "单位邮箱", 3, 2),
        GetEditSelect("Industry1", "行业门类", [], 3, 3, true, "请选择行业门类"),
        GetEditSelect("Industry2", "行业大类", [], 4, 1, true, "请选择行业大类"),
        GetEditSelect("Industry3", "行业中类", [], 4, 2, true, "请选择行业中类"),
        GetEditSelect("Industry4", "行业小类", [], 4, 3, true, "请选择行业小类"),
        GetEditSelect("CompanyHouseStatus", "办公地是否租赁", 5, 1),
        GetReadOnlyTextBox("CompanyHousePeriod", "租赁有效期限", 5, 2),
        GetReadOnlyTextBox("CompanyElectricityCode", "办公地电费单号", 5, 3),
        { Name: "WhiteSpace1", Type: "WhiteSpace", ClassName: "WhiteSpace1", Style: { marginBottom: 20 }, X: 6, Y: 1, ColSpan: 24 },
        GetTextArea("BorrowerAmount", "备注", 7, 1, "请输入备注")
    ]
}

function GetTextArea(Name, Label, X, Y, PlaceHolder) {
    return {
        ...GetTextBox(Name, Label, "TextArea", X, Y),
        IsFormItem: true,
        IsNullable: true,
        IsAddOptional: true,
        ColSpan: 24,
        Rows: 4,
        LabelCol: 2,
        WrapperCol: 22,
        PlaceHolder,
        Style: {
            marginBottom: 10
        }
    }
}

function GetEditSelect(Name, Label, DataSource, X, Y, IsNullable, PlaceHolder, DefaultValue) {
    return {
        ...GetSelect(Name, Label, DataSource, X, Y, DefaultValue),
        IsColon: false,
        IsFormItem: true, ColSpan: 8,
        LabelCol: 10,
        WrapperCol: 20,
        IsNullable: IsNullable,
        IsAddOptional: !!IsNullable,
        PlaceHolder: PlaceHolder,
        IsEdit: true,
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
        WrapperCol: 20,
        IsReadOnly: true,
        AddonAfter: addonAfter,
        Value: "测试数据1" + Label,
        Style: {
            display: "flex",
            flexDirection: "column",
            marginBottom: 10
        }
    }
}