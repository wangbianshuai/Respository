import PlatformRate from "../../entities/PlatformRate";
import { AssignProporties, GetTextBox, GetButton } from "../Common";

//公共配置/平台罚息费率编辑 3000-3099
const DataActionTypes = {
    //获取实体数据
    GetEntityData: 3000,
    //保存实体数据
    SaveEntityData: 3001
}

export default {
    Name: "PlatformFineRateEdit",
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
        GetTextBox3("FinRate", "罚息费率", 2, 1, "float", "罚息费率", 6, false, "%"),
        GetTextArea("Remark", "描述", 3, 1),
        GetButtonView()
    ]
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