import Role from "../../entities/Role";
import { GetButton, AssignProporties, CreateGuid, GetTextBox, GetRadio } from "../Common";

//权限管理/角色管理 2700-2799
const DataActionTypes = {
    //搜索查询
    SearchQuery: 2700,
    DeleteEntityData: 2701,
};

export default {
    Name: "RoleManage",
    Type: "View",
    EventActions: GetEventActions(),
    Properties: AssignProporties(Role, [GetSearchOperationView(), GetAlert(), GetDataGridView()])
}

function GetSearchOperationView() {
    return {
        Id: CreateGuid(),
        Name: "SearchOperationView1",
        Entity: Role,
        Type: "RowsColsView",
        ClassName: "DivLeftRightView",
        Properties: AssignProporties(Role, [{ EventActionName: "ToConfigPage", ...GetButton("ToConfigPage", "配置权限", "primary", 1, 1) },
        { EventActionName: "ToEditPage", ...GetButton("ToEditPage", "新增", "default", 1, 2) },
        { EventActionName: "EditRole", ...GetButton("EditRole", "修改", "default", 1, 3) },
        {
            EventActionName: "DeleteRole",
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
    const p = GetRadio("Status", "", GetStatusDataSource(), 2, 1, "0");
    p.Justify = "end";
    p.IsCondition = true;
    return p;
}

function GetKeyword() {
    const p = GetTextBox("Keyword", "", "Search", 2, 3, "请输入")
    p.ColStyle = { paddingRight: 8, paddingLeft: 2 };
    p.IsCondition = true;
    p.EventActionName = "SearchQuery";
    p.ColStyle = { width: 300 };
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
        Entity: Role,
        Type: "DataGridView",
        EntitySearchQuery: DataActionTypes.SearchQuery,
        EventActionName: "SearchQuery",
        Title: "角色列表",
        IsRowSelection: true,
        IsSingleSelection: true,
        Properties: AssignProporties(Role, ["RoleName", "Remark", "CreateUser", "UpdateDate", "Status"])
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
        PageUrl: "/RightManage/RightConfig?RoleId=#{RoleId}"
    },
    {
        Name: "EditRole",
        Type: "DataGridView/SelectRowToPage",
        DataGridView: "DataGridView1",
        AlertMessage: "AlertMessage",
        PageUrl: "/RightManage/RoleEdit?RoleId=#{RoleId}&MenuName=" + escape("修改")
    },
    {
        Name: "DeleteRole",
        Type: "DataGrid/BatchUpdateRowDataList",
        DataGridView: "DataGridView1",
        AlertMessage: "AlertMessage"
    }]
}

function GetStatusDataSource() {
    return [{ Value: "0", Text: "全部" }, { Value: "1", Text: "正常" }, { Value: "2", Text: "删除" }]
}
