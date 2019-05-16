import Order from "../../entities/Order";

import { AssignProporties, GetTextBox, GetDatePicker, GetSelect, GetButton, CreateGuid } from "../../pages/Common";

export default {
    Name: "PersonPropertyInfo",
    Type: "View",
    Properties: AssignProporties({}, [GetInfoView(), GetRightButtonView()])
}

function GetInfoView() {
    return {
        Name: "PersonPropertyInfo2",
        Type: "View",
        Title: "个人资产信息",
        Style: { marginTop: 8 },
        Properties: AssignProporties(Order, [GetHouseProperties(), GetCarProperties()])
    }
}

function GetCarProperties() {
    return {
        Name: "CarList",
        Type: "DataListView",
        DefaultValue: [{ Id: CreateGuid(), Title: "车产信息一" }],
        IsComplexEdit: true,
        IsFirstDelete: false,
        DeletePropertyName: "DeleteCar",
        PrimaryKey: "Id",
        Title: "车产信息",
        Properties: AssignProporties({}, [{
            Name: "CarItemView",
            Type: "RowsColsView",
            IsForm: true,
            LabelAlign: "left",
            IsDiv: false,
            Properties: AssignProporties({}, GetCarItemProperties())
        }])
    }
}

function GetHouseProperties() {
    return {
        Name: "HouseList",
        Type: "DataListView",
        DefaultValue: [{ Id: CreateGuid(), Title: "房产信息一" }],
        IsComplexEdit: true,
        IsFirstDelete: false,
        DeletePropertyName: "DeleteHouse",
        PrimaryKey: "Id",
        Title: "房产信息",
        Properties: AssignProporties({}, [{
            Name: "HouseItemView",
            Type: "RowsColsView",
            IsForm: true,
            LabelAlign: "left",
            IsDiv: false,
            Properties: AssignProporties({}, GetHouseItemProperties())
        }])
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
    return [{ ...GetButton("AddHouse", "新增房产", ""), EventActionName: "AddHouse", Style: { marginRight: 10 }, Icon: "plus" },
    { ...GetButton("AddCar", "新增车产", ""), EventActionName: "AddCar", Style: { marginRight: 10 }, Icon: "plus" },
    { ...GetButton("SavePersonPropertyInfo", "保存", "primary"), EventActionName: "SavePersonPropertyInfo", Style: { marginRight: 36, width: 84 } }]
}

function GetHouseItemProperties() {
    return [
        { Name: "Title", Type: "SpanText", X: 1, Y: 1, ClassName: "SpanTitle" },
        { ...GetButton("DeleteHouse", "删除", "", 1, 2), EventActionName: "DeleteHouse", Style: { marginLeft: 20, marginBottom: 10 }, Icon: "delete" },
        GetTextBox2("HouseUserName", "房产所有人", 2, 1, "", "", 50, true),
        GetTextBox2("HouserAddress", "房产地址", 2, 2, "", "", 100, true),
        GetTextBox3("HoustSpace", "面积", 2, 3, "decimal", "", 10, true, "平米")
    ]
}

function GetCarItemProperties() {
    return [
        { Name: "Title", Type: "SpanText", X: 1, Y: 1, ClassName: "SpanTitle" },
        { ...GetButton("DeleteCar", "删除", "", 1, 2), EventActionName: "DeleteCar", Style: { marginLeft: 20, marginBottom: 10 }, Icon: "delete" },
        GetTextBox2("CarNo", "车牌号码", 2, 1, "", "", 10, true),
        GetEditSelect("CarType", "车辆类型", GetCarTypeDataSource(), 2, 2, true, "请选择车辆类型"),
        GetEditSelect("CarUser", "车辆所有人", GetCarUserDataSource(), 2, 3, true, "请选择车辆类型"),
        GetTextBox2("CarUserAddress", "车辆所有人住址", 3, 1, "", "", 100, true),
        GetEditSelect("CarUseNature", "使用性质", GetCarUseNatureDataSource(), 3, 2, true, "请选择使用性质"),
        GetTextBox3("BrandModel", "品牌型号", 3, 3, "", "", 50, true),
        GetTextBox3("CarCode", "车辆识别代号", 4, 1, "", "", 50, true),
        GetTextBox3("CarAutoCode", "发动机号码", 4, 2, "", "", 50, true),
        GetDatePicker2("RegisterDate", "注册日期", 4, 3, "", true, ""),
        GetDatePicker2("CardDate", "发证日期", 5, 1, "", true, "")
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
        IsAddOptional: !!IsNullable,
        IsEdit: true,
        Style: {
            display: "flex",
            flexDirection: "column",
            marginBottom: 10
        }
    }
}

function GetCarTypeDataSource() {
    return [{ Value: 1, Text: "小型桥车" }, { Value: 0, Text: "客车" }]
}

function GetCarUserDataSource() {
    return [{ Value: 1, Text: "本人" }, { Value: 0, Text: "朋友" }]
}

function GetCarUseNatureDataSource(){
    return [{ Value: 1, Text: "家用代步" }, { Value: 0, Text: "营运" }]
}