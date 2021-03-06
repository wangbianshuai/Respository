import PropertyInfo from "../../entities/PropertyInfo";

import { AssignProporties, GetTextBox, GetSelect, GetButton } from "../../pages/Common";

var DataActionTypes = {}

export default (actionTypes) => {
    DataActionTypes = actionTypes;

    return {
        Name: "PropertyInfo",
        Type: "View",
        Properties: AssignProporties({}, [GetInfoView(), GetRightButtonView()])
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
        PropertyName: "PropertyInfo",
        DefaultEditData: { ViewName: "PropertyInfo" },
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
        Properties: AssignProporties({}, GetRightButtonProperties())
    }
}

function GetRightButtonProperties() {
    return [
        { ...GetButton("SavePropertyInfo", "保存", "primary"), EventActionName: "SavePropertyInfo", Style: { marginRight: 36, width: 84 } }]
}

function GetProperties() {
    return [
        GetEditSelect("IsLocalHouse", "是否本地有房产", PropertyInfo.LocalHouseDataSource, 1, 1, true, "请选择是否本地有房产"),
        GetEditSelect("IsMortgage", "是否有按揭", PropertyInfo.MortgageDataSource, 1, 2, true, "请选择是否有按揭"),
        GetTextBox3("HouseAmount", "清房房价（如有房产，则必填）", 1, 3, "float", "请输入", 20, true, "元"),
        GetTextBox3("MonthMortgage", "按揭月供金额", 2, 1, "float", "请输入", 20, true, "元")
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