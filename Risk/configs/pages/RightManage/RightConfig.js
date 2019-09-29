const Role =require( "../../entities/Role");
const { AssignProporties, GetTextBox, GetButton } =require( "../../Common");

//权限管理/权限配置 3600-3699
const DataActionTypes = {
    //获取实体数据
    GetEntityData: 3600,
    //保存实体数据
    SaveEntityData: 3601
}

module.exports= {
    Name: "RightConfig",
    Type: "View",
    GetEntityData: DataActionTypes.GetEntityData,
    EventActions: GetEventActions(),
    Properties: AssignProporties({Name:"RightConfig"}, [GeEditView()])
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
        Properties: AssignProporties(Role, GetProperties())
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
        Properties: AssignProporties({Name:"RightConfig"}, GetButtonProperties())
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
        Name: "permissionsTree",
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
        IsTreeNodes: true,
        ValueName: "permissionId",
        TextName: "aliasName",
        CheckedName: "ownState",
        CheckedValue: "01",
        UnCheckedValue: "02",
        ChildName: "chlidPermission",
        IsSelectValue: true,
        IsNotRoot: true
    }
}