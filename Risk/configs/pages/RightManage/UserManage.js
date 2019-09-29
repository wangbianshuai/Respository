const User =require( "../../entities/User");
const { GetButton, AssignProporties, GetTextBox } =require( "../../Common");

//权限管理/用户管理 2800-2899
const DataActionTypes = {
    //搜索查询
    SearchQuery: 2800
};

module.exports= {
    Name: "UserManage",
    Type: "View",
    EventActions: GetEventActions(),
    Properties: AssignProporties(User, [GetSearchOperationView(), GetAlert(), GetDataGridView()])
}

function GetSearchOperationView() {
    return {
        Name: "SearchOperationView1",
        Entity: User,
        Type: "RowsColsView",
        ClassName: "DivLeftRightView",
        Properties: AssignProporties(User, [{ EventActionName: "ToRoleConfig", ...GetButton("ToRoleConfig", "配置角色", "primary", 1, 1) },
        { EventActionName: "ToEditPage", ColStyle: { paddingLeft: 0 }, ...GetButton("ToEditPage", "开户", "", 1, 2) },
        GetKeyword()
        ])
    }
}

function GetKeyword() {
    const p = GetTextBox("Keyword", "", "Search", 2, 3, "请输入姓名/邮箱/手机号")
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
        Entity: User,
        Type: "DataGridView",
        EntitySearchQuery: DataActionTypes.SearchQuery,
        EventActionName: "SearchQuery",
        Title: "用户列表",
        IsLocalPage: true,
        IsRowSelection: true,
        IsSingleSelection: true,
        Properties: AssignProporties(User, ["UserName", "Email", "Phone", "JobName", "DepartName"])
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
        Name: "ToRoleConfig",
        Type: "DataGridView/SelectRowToPage",
        DataGridView: "DataGridView1",
        AlertMessage: "AlertMessage",
        IsLocalData: true,
        PageUrl: "/RightManage/RoleConfig?UserId=#{userId}"
    },
    {
        Name: "ToEditPage",
        Type: "Page/ToPage",
        PageUrl: "/RightManage/UserEdit"
    }]
}