import House from "../../entities/House";
import Car from "../../entities/Car";

import { AssignProporties, GetTextBox, GetButton, CreateGuid, GetSelect } from "../../pages/Common";

var DataActionTypes = {}

export default (actionTypes) => {
    DataActionTypes = actionTypes;

    return {
        Name: "PersonPropertyInfo",
        Type: "View",
        Properties: AssignProporties({}, [GetInfoView(), GetRightButtonView()])
    }
}

function GetInfoView() {
    return {
        Name: "PersonPropertyInfo2",
        Type: "View",
        Title: "个人资产信息",
        Style: { marginTop: 8 },
        IsForm: true,
        LabelAlign: "left",
        PropertyName: "PersonPropertyInfo",
        DefaultEditData: { ViewName: "PersonPropertyInfo" },
        SaveEntityDataActionType: DataActionTypes.SaveApprovalOrderDetail,
        Properties: AssignProporties({}, [GetHouseProperties(), GetCarProperties(),
        { Name: "WhiteSpace1", Type: "WhiteSpace", ClassName: "WhiteSpace1", Style: { marginBottom: 20 }, X: 3, Y: 1, ColSpan: 24 },
        GetTextArea("ApprovalRemark", "备注", 6, 1, "请输入备注")])
    }
}

function GetCarProperties() {
    return {
        Name: "CarList",
        Type: "DataListView",
        IsComplexEdit: true,
        PrimaryKey: "Id",
        ColSpan: 24,
        Title: "车产信息",
        Properties: AssignProporties({}, [{
            Name: "CarItemView",
            Type: "RowsColsView",
            IsForm: true,
            LabelAlign: "left",
            IsDiv: false,
            Properties: AssignProporties(Car, GetCarItemProperties())
        }])
    }
}

function GetHouseProperties() {
    return {
        Name: "HouseList",
        Type: "DataListView",
        DefaultValue: [{ Id: CreateGuid(), Title: "房产信息一" }],
        IsComplexEdit: true,
        PrimaryKey: "Id",
        Title: "房产信息",
        ColSpan: 24,
        Properties: AssignProporties({}, [{
            Name: "HouseItemView",
            Type: "RowsColsView",
            IsForm: true,
            LabelAlign: "left",
            IsDiv: false,
            Properties: AssignProporties(House, GetHouseItemProperties())
        }])
    }
}

function GetRightButtonView() {
    return {
        Name: "PersonPropertyInfoButtonView",
        Type: "View",
        ClassName: "DivRightButton",
        IsDiv: true,
        Properties: AssignProporties({}, GetRightButtonProperties())
    }
}

function GetRightButtonProperties() {
    return [{ ...GetButton("SavePersonPropertyInfo", "保存", "primary"), EventActionName: "SavePersonPropertyInfoEntityData", Style: { marginRight: 36, width: 84 } }]
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
        GetReadOnlySelect("CarType", "办公地是否租赁", Car.CarTypeDataSource, 2, 2),
        GetReadOnlySelect("CarUser", "车辆所有人", Car.CarUserDataSource, 2, 3),
        GetReadOnlyTextBox("CarUserAddress", "车辆所有人住址", 3, 1),
        GetReadOnlySelect("CarUseNature", "办公地是否租赁", Car.CarUseNatureDataSource, 3, 2),
        GetReadOnlyTextBox("BrandModel", "品牌型号", 3, 3),
        GetReadOnlyTextBox("CarCode", "车辆识别代号", 4, 1),
        GetReadOnlyTextBox("CarAutoCode", "发动机号码", 4, 2),
        GetReadOnlyTextBox("RegisterDate", "注册日期", 4, 3),
        GetReadOnlyTextBox("CardDate", "发证日期", 5, 1)
    ]
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

function GetTextArea(Name, Label, X, Y, PlaceHolder) {
    return {
        ...GetTextBox(Name, Label, "TextArea", X, Y, PlaceHolder),
        IsFormItem: true,
        IsNullable: true,
        IsColon: false,
        IsAddOptional: true,
        IsEdit: true,
        ReadRightName: "PersonPropertyInfoButtonView",
        ColSpan: 24,
        Rows: 4,
        FormItemClassName: "LeftFormItem",
        LabelCol: 10,
        WrapperCol: 23,
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