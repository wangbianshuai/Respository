const Role =require( "../../entities/Role");
const { GetButton, AssignProporties, GetTextBox, GetRadio } =require( "../../Common");

//权限管理/角色管理 2700-2799
const DataActionTypes = {
    //搜索查询
    SearchQuery: 2700,
    DeleteEntityData: 2701,
};

module.exports= {
    Name: "RoleManage",
    Type: "View",
    EventActions: GetEventActions(),
    Properties: AssignProporties(Role, [GetSearchOperationView(), GetAlert(), GetDataGridView()])
}

function GetSearchOperationView() {
    return {
        Name: "SearchOperationView1",
        Entity: Role,
        Type: "RowsColsView",
        ClassName: "DivLeftRightView",
        Properties: AssignProporties(Role, [{ EventActionName: "ToConfigPage", ...GetButton("ToConfigPage", "配置权限", "primary", 1, 1) },
        { EventActionName: "ToEditPage", ColStyle: { paddingLeft: 0 }, ...GetButton("ToEditPage", "新增", "default", 1, 2) },
        { EventActionName: "EditRole", ColStyle: { paddingLeft: 0 }, ...GetButton("EditRole", "修改", "default", 1, 3) },
        {
            EventActionName: "DeleteRole",
            ColStyle: { paddingLeft: 0 },
            DataActionType: DataActionTypes.DeleteEntityData,
            SuccessTip: "删除成功！",
            ConfirmTip: "请确认是否删除当前角色？",
            ...GetButton("DeleteRole", "删除", "default", 1, 4)
        },
        GetStatus(),
        GetKeyword()
        ])
    }
}

function GetStatus() {
    const p = GetRadio("Status", "", GetStatusDataSource(), 2, 1, "null");
    p.Justify = "end";
    p.ValueChangeEventActionName = "SearchQuery";
    p.IsCondition = true;
    p.IsLoadValue = true;
    return p;
}

function GetKeyword() {
    const p = GetTextBox("Keyword", "", "Search", 2, 3, "请输入")
    p.ColStyle = { paddingRight: 8, paddingLeft: 2 };
    p.IsCondition = true;
    p.EventActionName = "SearchQuery";
    p.PressEnterEventActionName = "SearchQuery";
    p.ColStyle = { width: 240 }
    return p;
}

function GetAlert() {
    return {
        Name: "AlertMessage",
        Type: "Alert"
    }
}

function GetDataGridView() {
    return {
        Name: "DataGridView1",
        Entity: Role,
        Type: "DataGridView",
        EntitySearchQuery: DataActionTypes.SearchQuery,
        EventActionName: "SearchQuery",
        Title: "角色列表",
        IsRowSelection: true,
        IsSingleSelection: true,
        Properties: AssignProporties(Role, ["RoleName", "Remark", "CreateUser", "UpdateDate", "StatusName"])
    }
}

function GetEventActions() {
    return [{
        Name: "SearchQuery",
        Type: "DataGridView/SearchQuery",
        SearchView: "SearchOperationView1",
        SearchButton: "Keyword",
        DataGridView: "DataGridView1",
        AlertMessage: "AlertMessage"
    },
    {
        Name: "ToEditPage",
        Type: "Page/ToPage",
        PageUrl: "/RightManage/RoleEdit"
    },
    {
        Name: "ToConfigPage",
        Type: "DataGridView/SelectRowToPage",
        DataGridView: "DataGridView1",
        AlertMessage: "AlertMessage",
        IsLocalData: true,
        PageUrl: "/RightManage/RightConfig?RoleId=#{roleId}&RoleName=#{roleName}"
    },
    {
        Name: "EditRole",
        Type: "DataGridView/SelectRowToPage",
        DataGridView: "DataGridView1",
        AlertMessage: "AlertMessage",
        IsLocalData: true,
        SetPageUrl: "SetEditRolePageUrl",
        PageUrl: "/RightManage/RoleEdit?RoleId=#{roleId}&MenuName=" + escape("修改")
    },
    {
        Name: "DeleteRole",
        Type: "DataGrid/BatchUpdateRowDataList",
        DataGridView: "DataGridView1",
        AlertMessage: "AlertMessage"
    }]
}

function GetStatusDataSource() {
    return [{ Value: "null", Text: "全部" }, { Value: "02", Text: "正常" }, { Value: "01", Text: "删除" }]
}
