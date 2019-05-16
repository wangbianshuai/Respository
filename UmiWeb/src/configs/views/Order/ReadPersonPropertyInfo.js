import Order from "../../entities/Order";

import { AssignProporties, GetTextBox, GetButton, CreateGuid } from "../../pages/Common";

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
        Properties: AssignProporties(Order, [GetHouseProperties(), GetCarProperties(),
        { Name: "WhiteSpace1", Type: "WhiteSpace", ClassName: "WhiteSpace1", Style: { marginBottom: 20 }, X: 4, Y: 1 },
        GetTextArea("BorrowerAmount", "备注", 5, 1, "请输入备注")])
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
    return [{ ...GetButton("SavePersonPropertyInfo", "保存", "primary"), EventActionName: "SavePersonPropertyInfo", Style: { marginRight: 36, width: 84 } }]
}

function GetHouseItemProperties() {
    return [
        { Name: "Title", Type: "SpanText", X: 1, Y: 1, ClassName: "SpanTitle" },
        GetReadOnlyTextBox("HouseUserName", "房产所有人", 2, 1),
        GetReadOnlyTextBox("HouserAddress", "房产地址", 2, 2),
        GetReadOnlyTextBox("HoustSpace", "面积", 2, 3, "平米")
    ]
}

function GetCarItemProperties() {
    return [
        { Name: "Title", Type: "SpanText", X: 1, Y: 1, ClassName: "SpanTitle" },
        GetReadOnlyTextBox("CarNo", "车牌号码", 2, 1),
        GetReadOnlyTextBox("CarType", "车辆类型", 2, 2),
        GetReadOnlyTextBox("CarUser", "车辆所有人", 2, 3),
        GetReadOnlyTextBox("CarUserAddress", "车辆所有人住址", 3, 1),
        GetReadOnlyTextBox("CarUseNature", "使用性质", 3, 2),
        GetReadOnlyTextBox("BrandModel", "品牌型号", 3, 3),
        GetReadOnlyTextBox("CarCode", "车辆识别代号", 4, 1),
        GetReadOnlyTextBox("CarAutoCode", "发动机号码", 4, 2),
        GetReadOnlyTextBox("RegisterDate", "注册日期", 4, 3),
        GetReadOnlyTextBox("CardDate", "发证日期", 5, 1)
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