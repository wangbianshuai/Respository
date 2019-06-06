import PlatformRate from "../../entities/PlatformRate";
import { AssignProporties, GetTextBox, GetSelect, GetButton } from "../Common";

//公共配置/平台服务费率编辑 3200-3299
const DataActionTypes = {
    //获取实体数据
    GetEntityData: 3200,
    //保存实体数据
    SaveEntityData: 3201
}

export default {
    Name: "PlatformServiceRateEdit",
    Type: "View",
    GetEntityData: DataActionTypes.GetEntityData,
    EventActions: GetEventActions(),
    Properties: AssignProporties({}, [GeEditView()])
}

function GeEditView() {
    return {
        Name: "PlatformRateEdit2",
        Type: "RowsColsView",
        Entity: PlatformRate,
        IsForm: true,
        EventActionName: "GetEntityData",
        SaveEntityDataActionType: DataActionTypes.SaveEntityData,
        GetEntityDataActionType: DataActionTypes.GetEntityData,
        Properties: AssignProporties({}, GetProperties())
    }
}

function GetButtonProperties() {
    return [{
        Name: "LeftSpace1",
        Type: "WhiteSpace",
        ClassName: "ant-col ant-col-8 ant-form-item-label"
    },
    { ...GetButton("SaveEntityData", "提交", "primary"), EventActionName: "SaveEntityData", Style: { width: 84 } },
    { ...GetButton("BackToLast", "返回", ""), EventActionName: "BackToLast", Style: { marginLeft: 10 } }]
}

function GetProperties() {
    return [
        GetTextBox2("Name", "名称", 1, 1, "", "请输入名称", 50, false),
        GetTextBox3("ServiceRate", "信息服务费率", 2, 1, "float", "请输入信息服务费率", 6, false, "%"),
        GetEditSelect("CollectionType", "收取类型", GetCollectionTypeDataSource(), 3, 1, false, "请选择收取类型"),
        GetEditSelect("CollectionMethod", "收取方式", GetCollectionMethodDataSource(), 4, 1, false, "请选择年收取方式"),
        GetTextArea("Remark", "描述", 5, 1),
        GetButtonView()
    ]
}

function GetCollectionMethodDataSource(){
    return [{ Value: "1", Text: "一次性收取" }, { Value: "2", Text: "分期" }]
}

function GetCollectionTypeDataSource() {
    return [{ Value: "1", Text: "前置" }, { Value: "2", Text: "后置" }]
}

function GetEditSelect(Name, Label, DataSource, X, Y, IsNullable, PlaceHolder, DefaultValue) {
    return {
        ...GetSelect(Name, Label, DataSource, X, Y, DefaultValue),
        IsFormItem: true,
        ColSpan: 24,
        LabelCol: 8,
        WrapperCol: 10,
        IsNullable,
        IsEdit: true,
        PlaceHolder: PlaceHolder
    }
}

function GetButtonView() {
    return {
        Name: "ButtonView",
        Type: "View",
        ClassName: "DivCenterButton",
        IsDiv: true,
        IsFormItem: true,
        ColSpan: 24,
        X: 6,
        Y: 1,
        Properties: AssignProporties({}, GetButtonProperties())
    }
}

function GetTextArea(Name, Label, X, Y) {
    return {
        ...GetTextBox(Name, Label, "TextArea", X, Y),
        IsFormItem: true,
        IsNullable: true,
        IsEdit: true,
        ColSpan: 24,
        Rows: 3,
        IsAddOptional: true,
        LabelCol: 8,
        WrapperCol: 10
    }
}

function GetTextBox2(Name, Label, X, Y, ContorlType, PlaceHolder, MaxLength, IsNullable, addonAfter) {
    return {
        ...GetTextBox(Name, Label, ContorlType, X, Y, PlaceHolder, MaxLength || 50),
        IsFormItem: true,
        ColSpan: 24,
        LabelCol: 8,
        WrapperCol: 10,
        IsNullable,
        AddonAfter: addonAfter,
        IsEdit: true
    }
}

function GetEventActions() {
    return [{
        Name: "BackToLast",
        Type: "Page/ToPage",
        PageUrl: "/CommonConfig/PlatformRateConfig"
    },
    {
        Name: "SaveEntityData",
        Type: "EntityEdit/SaveEntityData",
        EditView: "PlatformRateEdit2"
    },
    {
        Name: "GetEntityData",
        Type: "EntityEdit/GetEntityData",
        EditView: "PlatformRateEdit2"
    }]
}

function GetTextBox3(Name, Label, X, Y, DataType, PlaceHolder, MaxLength, IsNullable, addonAfter) {
    return {
        ...GetTextBox2(Name, Label, X, Y, "", PlaceHolder, MaxLength, IsNullable, addonAfter),
        DataType
    }
}