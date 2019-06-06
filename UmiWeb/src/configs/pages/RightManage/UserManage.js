import User from "../../entities/User";
import { GetButton, AssignProporties, CreateGuid, GetTextBox, GetSelect } from "../Common";

//权限管理/用户管理 2800-2899
const DataActionTypes = {
    //搜索查询
    SearchQuery: 2800
};

export default {
    Name: "UserManage",
    Type: "View",
    EventActions: GetEventActions(),
    Properties: AssignProporties(User, [GetSearchOperationView(), GetAlert(), GetDataGridView()])
}

function GetSearchOperationView() {
    return {
        Id: CreateGuid(),
        Name: "SearchOperationView1",
        Entity: User,
        Type: "RowsColsView",
        ClassName: "DivLeftRightView",
        Properties: AssignProporties(User, [{ EventActionName: "ToRoleConfig", ...GetButton("ToRoleConfig", "配置角色", "primary", 1, 1) },
        { EventActionName: "ToEditPage", ...GetButton("ToEditPage", "开户", "", 1, 2) },
        GetQueryName(),
        GetKeyword()
        ])
    }
}

function GetKeyword() {
    const p = GetTextBox("Keyword", "", "Search", 2, 3, "请输入")
    p.ColStyle = { paddingRight: 8, paddingLeft: 2 };
    p.IsCondition = true;
    p.EventActionName = "SearchQuery";
    p.ColStyle = { width: 240 }
    return p;
}

function GetQueryName() {
    const p = GetSelect("QueryName", "", GetQueryNameDataSource(), 2, 2, "UserName");
    p.ColStyle = { paddingRight: 0, paddingLeft: 8 };
    p.Width = 100;
    p.IsCondition = true;
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
        Id: CreateGuid(),
        Name: "DataGridView1",
        Entity: User,
        Type: "DataGridView",
        EntitySearchQuery: DataActionTypes.SearchQuery,
        EventActionName: "SearchQuery",
        Title: "用户列表",
        IsRowSelection: true,
        IsSingleSelection: true,
        Properties: AssignProporties(User, ["UserName", "Email", "Phone", "JobName","DepartName", "UpdateDate"])
    }
}

function GetQueryNameDataSource() {
    return [{ Value: "UserName", Text: "姓名" }, { Value: "Email", Text: "邮箱" }]
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
        PageUrl: "/RightManage/RoleConfig?UserId=#{UserId}"
    },
    {
        Name: "ToEditPage",
        Type: "Page/ToPage",
        PageUrl: "/RightManage/UserEdit"
    }]
}