const PersonBaseInfo = require("../../entities/PersonBaseInfo");

const { AssignProporties, GetTextBox, GetDatePicker, GetSelect, GetButton } = require("../../Common");

var DataActionTypes = {}

module.exports = (actionTypes) => {
    DataActionTypes = actionTypes;
    return {
        Name: "PersonBaseInfo",
        Type: "View",
        Properties: AssignProporties({ Name: "PersonBaseInfo" }, [GetInfoView(), GetRightButtonView()])
    }
}

function GetInfoView() {
    return {
        Name: "PersonBaseInfo2",
        Type: "RowsColsView",
        Entity: PersonBaseInfo,
        IsForm: true,
        LabelAlign: "left",
        Title: "个人基本信息",
        Style: { marginTop: 8 },
        PropertyName: "personalBase",
        DefaultEditData: { ViewName: "personalBase" },
        SaveEntityDataActionType: DataActionTypes.SaveOrderDetailEntityData,
        Properties: AssignProporties(PersonBaseInfo, GetProperties())
    }
}

function GetRightButtonView() {
    return {
        Name: "PersonBaseInfoRightButtonView",
        Type: "View",
        ClassName: "DivRightButton",
        IsDiv: true,
        Properties: AssignProporties({ Name: "PersonBaseInfo" }, GetRightButtonProperties())
    }
}

function GetRightButtonProperties() {
    return [{ ...GetButton("SavePersonBaseInfo", "保存", "primary"), Text2: "修改", IsDisabled: true, EventActionName: "SavePersonBaseInfoEntityData", Style: { marginRight: 36, width: 84 } }]
}

function GetProperties() {
    return [
        GetReadOnlyTextBox("Phone", "常用手机号", 1, 1),
        GetTextBox2("Email", "邮箱地址", 1, 2, "", "请输入邮箱地址", 100, false),
        GetEditSelect("Educational", "教育程度", PersonBaseInfo.EducationalDataSource, 1, 2, false, "请选择教育程度"),
        {
            ...GetEditSelect("MaritalStatus", "婚姻状况", PersonBaseInfo.MaritalStatusDataSource, 2, 1, false, "请选择婚姻状况"),
            ValueEnableProperties: { "02": ["MaritalYears"] },
            IsLoadValue: true
        },
        GetTextBox3("MaritalYears", "已婚年限", 2, 2, "int", "请输入已婚年限", 2, false, "年", true),
        GetTextBox2("NowAddress", "现居住地址", 2, 3, "", "请输入现居住地址", 100, false),
        {
            ...GetEditSelect("HouseStatus", "居住地是否租赁", PersonBaseInfo.HouseStatusDataSource, 3, 1, false, "请选择居住地是否租赁"),
            ValueDisabledProperties: { "02": ["HousePeriod"] },
            IsLoadValue: true
        },
        GetBetweenDate("HousePeriod", "leaseStartPeriod", "leaseEndPeriod", "租赁有效期限", 3, 2, false, "请选择租赁有效期限", true),
        GetTextBox2("ElectricityCode", "居住地电费单号", 3, 3, "", "请输入居住地电费单号", 20, false),
        {
            ...GetEditSelect("HasLocalHouse", "本地是否有房", PersonBaseInfo.HouseStatusDataSource, 4, 1, true),
            IsReadOnly: true
        }
    ]
}

function GetEditSelect(Name, Label, DataSource, X, Y, IsNullable, PlaceHolder, DefaultValue) {
    return {
        ...GetSelect(Name, Label, DataSource, X, Y, DefaultValue),
        IsColon: false,
        IsFormItem: true, ColSpan: 8,
        LabelCol: 10,
        WrapperCol: 21,
        IsNullable: IsNullable,
        PlaceHolder: PlaceHolder,
        IsEdit: true,
        ReadRightName: "PersonBaseInfoRightButtonView",
        Style: {
            display: "flex",
            flexDirection: "column",
            marginBottom: 10
        }
    }
}

function GetBetweenDate(Name, StartDateName, EndDateName, Label, X, Y, IsNullable, PlaceHolder, Disabled, DefaultValue) {
    return {
        ...GetDatePicker(Name, Label, X, Y, DefaultValue),
        IsColon: false,
        IsFormItem: true, ColSpan: 8,
        LabelCol: 10,
        WrapperCol: 21,
        Disabled,
        StartDateName, EndDateName,
        IsNullable: IsNullable,
        PlaceHolder: PlaceHolder,
        ControlType: "RangePicker",
        NullTipMessage: PlaceHolder,
        IsEdit: true,
        ReadRightName: "PersonBaseInfoRightButtonView",
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
        WrapperCol: 21,
        AddonAfter: addonAfter,
        IsNullable: IsNullable,
        IsEdit: true,
        ReadRightName: "PersonCardInfoRightButtonView",
        Style: {
            display: "flex",
            flexDirection: "column",
            marginBottom: 10
        }
    }
}

function GetTextBox3(Name, Label, X, Y, DataType, PlaceHolder, MaxLength, IsNullable, addonAfter, Disabled) {
    return {
        ...GetTextBox2(Name, Label, X, Y, "", PlaceHolder, MaxLength, IsNullable, addonAfter),
        DataType, Disabled
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