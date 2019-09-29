const PropertyInfo = require("../../entities/PropertyInfo");

const { AssignProporties, GetTextBox, GetSelect, GetButton } = require("../../Common");

var DataActionTypes = {}

module.exports = (actionTypes) => {
    DataActionTypes = actionTypes;

    return {
        Name: "PropertyInfo",
        Type: "View",
        Properties: AssignProporties({ Name: "PropertyInfo" }, [GetInfoView(), GetRightButtonView()])
    }
}

function GetInfoView() {
    return {
        Name: "PropertyInfo2",
        Type: "RowsColsView",
        IsForm: true,
        LabelAlign: "left",
        Title: "资产信息",
        Style: { marginTop: 8 },
        PropertyName: "assetsInfo",
        DefaultEditData: { ViewName: "assetsInfo" },
        SaveEntityDataActionType: DataActionTypes.SaveFinalBaseInfo,
        Properties: AssignProporties(PropertyInfo, GetProperties())
    }
}

function GetRightButtonView() {
    return {
        Name: "PropertyInfoButtonView",
        Type: "View",
        ClassName: "DivRightButton",
        IsDiv: true,
        Properties: AssignProporties({ Name: "PropertyInfo" }, GetRightButtonProperties())
    }
}

function GetRightButtonProperties() {
    return [
        { ...GetButton("SavePropertyInfo", "保存", "primary"), Text2: "修改", EventActionName: "SavePropertyInfo", Style: { marginRight: 36, width: 84 } }]
}

function GetProperties() {
    return [
        {
            ...GetEditSelect("IsLocalHouse", "是否本地有房产", PropertyInfo.LocalHouseDataSource, 1, 1, false, "请选择是否本地有房产"),
            ValueDisabledProperties: { "02": ["IsMortgage", "HouseAmount"] },
            IsLoadValue: true
        },
        {
            ...GetEditSelect("IsMortgage", "是否有按揭", PropertyInfo.MortgageDataSource, 1, 2, false, "请选择是否有按揭"),
            Disabled: true,
            ValueDisabledProperties: { "02": ["MonthMortgage"] },
            IsLoadValue: true
        },
        { ...GetTextBox3("HouseAmount", "清房房价（如有房产，则必填）", 1, 3, "float", "请输入", 20, false, "元"), Disabled: true },
        { ...GetTextBox3("MonthMortgage", "按揭月供金额", 2, 1, "float", "请输入", 20, false, "元"), Disabled: true }
    ]
}

function GetEditSelect(Name, Label, DataSource, X, Y, IsNullable, PlaceHolder, DefaultValue) {
    return {
        ...GetSelect(Name, Label, DataSource, X, Y, DefaultValue),
        IsColon: false,
        IsFormItem: true, ColSpan: 8,
        LabelCol: 20,
        WrapperCol: 21,
        IsNullable: IsNullable,
        IsAddOptional: !!IsNullable,
        PlaceHolder: PlaceHolder,
        IsEdit: true,
        ReadRightName: "PropertyInfoButtonView",
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
        LabelCol: 20,
        WrapperCol: 21,
        AddonAfter: addonAfter,
        IsNullable: IsNullable,
        IsEdit: true,
        ReadRightName: "PropertyInfoButtonView",
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