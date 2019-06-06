import Role from "../../entities/Role";
import { AssignProporties, GetTextBox, GetButton } from "../Common";

//权限管理/权限配置 3600-3699
const DataActionTypes = {
    //获取实体数据
    GetEntityData: 3600,
    //保存实体数据
    SaveEntityData: 3601
}

export default {
    Name: "RightConfig",
    Type: "View",
    GetEntityData: DataActionTypes.GetEntityData,
    EventActions: GetEventActions(),
    Properties: AssignProporties({}, [GeEditView()])
}

function GeEditView() {
    return {
        Name: "RoleEdit2",
        Type: "RowsColsView",
        Entity: Role,
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
        GetReadOnlyTextBox2("RoleName", "角色名称", 1, 1),
        GetTreeView(),
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
        IsAddOptional: true,
        ColSpan: 24,
        X: 6,
        Y: 1,
        Properties: AssignProporties({}, GetButtonProperties())
    }
}

function GetReadOnlyTextBox2(Name, Label, X, Y) {
    return {
        ...GetTextBox(Name, Label, "", X, Y),
        IsFormItem: true,
        ColSpan: 24,
        LabelCol: 8,
        WrapperCol: 10,
        IsReadOnly: true
    }
}

function GetEventActions() {
    return [{
        Name: "BackToLast",
        Type: "Page/ToPage",
        PageUrl: "/RightManage/RoleManage"
    },
    {
        Name: "SaveEntityData",
        Type: "EntityEdit/SaveEntityData",
        EditView: "RoleEdit2"
    },
    {
        Name: "GetEntityData",
        Type: "EntityEdit/GetEntityData",
        EditView: "RoleEdit2"
    }]
}

function GetTreeView() {
    return {
        Name: "ConfigRight",
        Type: "Tree",
        Label: "配置权限",
        RootValue: 0,
        IsCheckBox: true,
        IsFormItem: true,
        ColSpan: 24,
        LabelCol: 8,
        WrapperCol: 10,
        IsNullable: false,
        IsEdit: true,
        X: 3,
        Y: 1,
        DataSource: GetTreeDataSource()
    }
}

function GetTreeDataSource() {
    return [
        { Value: 1, Text: "工单", ParentValue: 0 },
        { Value: 2, Text: "我的工单", ParentValue: 1 },
        { Value: 3, Text: "工单查询", ParentValue: 2 },
        { Value: 4, Text: "查看流转日志", ParentValue: 3 },
        { Value: 5, Text: "修改", ParentValue: 3 },
        { Value: 6, Text: "转单", ParentValue: 3 },
        { Value: 11, Text: "工单2", ParentValue: 0 },
        { Value: 21, Text: "我的工单2", ParentValue: 11 },
        { Value: 31, Text: "工单查询2", ParentValue: 21 },
        { Value: 41, Text: "查看流转日志2", ParentValue: 31 },
        { Value: 51, Text: "修改2", ParentValue: 31 },
        { Value: 61, Text: "转单2", ParentValue: 31 }
    ]
}