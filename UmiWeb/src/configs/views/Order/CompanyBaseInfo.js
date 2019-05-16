import Order from "../../entities/Order";

import { AssignProporties, GetTextBox, GetDatePicker, GetSelect, GetButton } from "../../pages/Common";

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
        GetDatePicker2("RegisterDate", "成立时间", 1, 3, "", false, "请选择成立时间"),
        GetTextBox3("RegisterAmount", "注册资金", 2, 1, "decimal", "请输入注册资金", 20, false, "元"),
        GetTextBox3("ManageYears", "经营年限", 2, 2, "int", "请输入经营年限", 2, false, "年"),
        GetTextBox2("CompanyAddress", "单位地址", 2, 3, "", "请输入单位地址", 100, false),
        GetTextBox2("CompanyTelephone", "单位电话", 3, 1, "", "请输入单位电话", 50, false),
        GetTextBox2("CompanyEmail", "单位邮箱", 3, 2, "", "请输入单位邮箱", 100, false),
        GetEditSelect("Industry1", "行业门类", [], 3, 3, true, "请选择行业门类"),
        GetEditSelect("Industry2", "行业大类", [], 4, 1, true, "请选择行业大类"),
        GetEditSelect("Industry3", "行业中类", [], 4, 2, true, "请选择行业中类"),
        GetEditSelect("Industry4", "行业小类", [], 4, 3, true, "请选择行业小类"),
        GetEditSelect("CompanyHouseStatus", "办公地是否租赁", GetHouseStatusDataSource(), 5, 1, false, "请选择办公地是否租赁"),
        GetDatePicker2("CompanyHousePeriod", "租赁有效期限", 5, 2, "RangePicker", false),
        GetTextBox2("CompanyElectricityCode", "办公地电费单号", 5, 3, "", "请输入办公地电费单号", 20, false)
    ]
}

function GetTextBox3(Name, Label, X, Y, DataType, PlaceHolder, MaxLength, IsNullable, addonAfter) {
    return {
        ...GetTextBox2(Name, Label, X, Y, "", PlaceHolder, MaxLength, IsNullable, addonAfter),
        DataType
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

function GetDatePicker2(Name, Label, X, Y, ControlType, IsNullable, PlaceHolder, DefaultValue) {
    return {
        ...GetDatePicker(Name, Label, X, Y, DefaultValue),
        IsColon: false,
        IsFormItem: true, ColSpan: 8,
        LabelCol: 10,
        WrapperCol: 20,
        IsNullable: IsNullable,
        PlaceHolder: PlaceHolder,
        ControlType: ControlType,
        IsEdit: true,
        Style: {
            display: "flex",
            flexDirection: "column",
            marginBottom: 10
        }
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

function GetHouseStatusDataSource() {
    return [{ Value: 1, Text: "是" }, { Value: 0, Text: "否" }]
}