const User = require("../../entities/User");
const { AssignProporties, GetTextBox, GetButton, GetSelect } = require("../../Common");

//权限管理/角色配置 3700-3799
const DataActionTypes = {
    //获取实体数据
    GetEntityData: 3700,
    //保存实体数据
    SaveEntityData: 3701
}

module.exports = {
    Name: "RoleConfig",
    Type: "View",
    GetEntityData: DataActionTypes.GetEntityData,
    EventActions: GetEventActions(),
    Properties: AssignProporties({ Name: "RoleConfig" }, [GeEditView()])
}

function GeEditView() {
    return {
        Name: "UserEdit2",
        Type: "RowsColsView",
        Entity: User,
        IsForm: true,
        EventActionName: "GetEntityData",
        SaveEntityDataActionType: DataActionTypes.SaveEntityData,
        GetEntityDataActionType: DataActionTypes.GetEntityData,
        Properties: AssignProporties({ Name: "RoleConfig" }, GetProperties())
    }
}

function GetButtonProperties() {
    return [{
        Name: "LeftSpace1",
        Type: "WhiteSpace",
        ClassName: "ant-col ant-col-8 ant-form-item-label"
    },
    { ...GetButton("SaveEntityData", "提交", "primary"), EventActionName: "SaveEntityData", Style: { width: 84 } },
    { ...GetButton("ClearRoles", "清除角色", ""), EventActionName: "ClearRoles", Style: { marginLeft: 10 } },
    { ...GetButton("BackToLast", "返回", ""), EventActionName: "BackToLast", Style: { marginLeft: 10 } }]
}

function GetProperties() {
    return [
        GetReadOnlyTextBox2("name", "用户姓名", 1, 1),
        GetReadOnlyTextBox2("department", "部门", 2, 1),
        GetReadOnlyTextBox2("job", "职位", 3, 1),
        { IsClear: true, ...GetEditSelect("Roles", "角色名称", GetRoleListDataSource(), 4, 1, true, "请选择角色") },
        GetButtonView()
    ]
}

function GetEditSelect(Name, Label, DataSource, X, Y, IsNullable, PlaceHolder, DefaultValue) {
    return {
        ...GetSelect(Name, Label, null, X, Y, DefaultValue),
        IsFormItem: true,
        ColSpan: 24,
        LabelCol: 8,
        WrapperCol: 10,
        IsNullable,
        IsEdit: true,
        IsMultiple: true,
        AllowClear: true,
        ListName: "roleList",
        NullTipMessage: "请选择角色",
        ServiceDataSource: DataSource,
        PlaceHolder: PlaceHolder
    }
}

function GetRoleListDataSource() {
    return {
        ValueName: "roleId",
        TextName: "roleName",
        StateName: "RoleList",
        ServiceName: "RoleService",
        ActionName: "GetDataList",
        IsRefresh: true,
        Payload: {
            pageRequest: {
                pageNum: 1,
                pageSize: 1000
            },
            status: "02"
        }
    }
}

function GetButtonView() {
    return {
        Name: "ButtonView",
        Type: "View",
        ClassName: "DivCenterButton2",
        IsDiv: true,
        IsFormItem: true,
        IsAddOptional: true,
        ColSpan: 24,
        X: 6,
        Y: 1,
        Properties: AssignProporties({ Name: "RoleConfig" }, GetButtonProperties())
    }
}

function GetReadOnlyTextBox2(Name, Label, X, Y) {
    return {
        ...GetTextBox(Name, Label, "", X, Y),
        IsFormItem: true,
        ColSpan: 24,
        LabelCol: 8,
        WrapperCol: 10,
        IsReadOnly: true,
        IsEdit: true
    }
}

function GetEventActions() {
    return [{
        Name: "BackToLast",
        Type: "Page/ToPage",
        PageUrl: "/RightManage/UserManage"
    },
    {
        Name: "SaveEntityData",
        Type: "EntityEdit/SaveEntityData",
        EditView: "UserEdit2"
    },
    {
        Name: "ClearRoles",
        Type: "EntityEdit/ClearPropertyValue",
        EditView: "UserEdit2"
    },
    {
        Name: "GetEntityData",
        Type: "EntityEdit/GetEntityData",
        EditView: "UserEdit2"
    }]
}