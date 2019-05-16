import Order from "../../entities/Order";

import { AssignProporties, GetTextBox, GetDatePicker, GetSelect, GetButton } from "../../pages/Common";

export default {
    Name: "PersonBaseInfo",
    Type: "View",
    Properties: AssignProporties({}, [GetInfoView(), GetRightButtonView()])
}

function GetInfoView() {
    return {
        Name: "PersonBaseInfo2",
        Type: "RowsColsView",
        Entity: Order,
        IsForm: true,
        LabelAlign: "left",
        Title: "个人基本信息",
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
    return [{ ...GetButton("SavePersonBaseInfo", "保存", "primary"), EventActionName: "SavePersonBaseInfo", Style: { marginRight: 36, width: 84 } }]
}

function GetProperties() {
    return [
        GetReadOnlyTextBox("Phone", "常用手机号", 1, 1),
        GetEditSelect("UserType", "用户类型", GetUserTypeDataSource(), 1, 2, false, "请选择用户类型"),
        GetTextBox2("Email", "邮箱地址", 1, 3, "", "请输入邮箱地址", 100, false),
        GetEditSelect("Educational", "教育程度", GetEducationalDataSource(), 2, 1, false, "请选择教育程度"),
        GetEditSelect("MaritalStatus", "婚姻状况", GetMaritalStatusDataSource(), 2, 2, false, "请选择婚姻状况"),
        GetTextBox3("MaritalYears", "已婚年限", 2, 3, "int", "请输入已婚年限", 2, false, "年"),
        GetTextBox2("NowAddress", "现居住地址", 3, 1, "", "请输入现居住地址", 100, false),
        GetEditSelect("HouseStatus", "居住地是否租赁", GetHouseStatusDataSource(), 3, 2, false, "请选择居住地是否租赁"),
        GetBetweenDate("HousePeriod", "租赁有效期限", 3, 3, false),
        GetTextBox2("ElectricityCode", "居住地电费单号", 4, 1, "", "请输入居住地电费单号", 20, false)
    ]
}

function GetEditSelect(Name, Label, DataSource, X, Y, IsNullable, PlaceHolder, DefaultValue) {
    return {
        ...GetSelect(Name, Label, DataSource, X, Y, DefaultValue),
        IsColon: false,
        IsFormItem: true, ColSpan: 8,
        LabelCol: 10,
        WrapperCol: 20,
        IsNullable: IsNullable,
        PlaceHolder: PlaceHolder,
        IsEdit: true,
        Style: {
            display: "flex",
            flexDirection: "column",
            marginBottom: 10
        }
    }
}

function GetBetweenDate(Name, Label, X, Y, IsNullable, PlaceHolder, DefaultValue) {
    return {
        ...GetDatePicker(Name, Label, X, Y, DefaultValue),
        IsColon: false,
        IsFormItem: true, ColSpan: 8,
        LabelCol: 10,
        WrapperCol: 20,
        IsNullable: IsNullable,
        PlaceHolder: PlaceHolder,
        ControlType: "RangePicker",
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

function GetTextBox3(Name, Label, X, Y, DataType, PlaceHolder, MaxLength, IsNullable, addonAfter) {
    return {
        ...GetTextBox2(Name, Label, X, Y, "", PlaceHolder, MaxLength, IsNullable, addonAfter),
        DataType
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

function GetUserTypeDataSource() {
    return [{ Value: 1, Text: "个体工商户" }, { Value: 2, Text: "公司" }]
}

function GetEducationalDataSource() {
    return [{ Value: 1, Text: "本科" }, { Value: 2, Text: "大专" }]
}

function GetMaritalStatusDataSource() {
    return [{ Value: 1, Text: "已婚" }, { Value: 2, Text: "未婚" }]
}

function GetHouseStatusDataSource() {
    return [{ Value: 1, Text: "是" }, { Value: 0, Text: "否" }]
}