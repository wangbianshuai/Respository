const User = require("../../entities/User");
const { GetButton, AssignProporties, GetTextBox } = require("../../Common");

//配置管理/用户 600-699
const DataActionTypes = {
    //搜索查询
    SearchQuery: 600,
    //删除实体数据
    DeleteEntityData: 601,
    //Excel导出
    ExcelExport: 602
};

const Entity = { Name: User.Name, PrimaryKey: User.PrimaryKey, ViewName: "ViewUser" }

module.exports = {
    Name: "UserList",
    Type: "View",
    EventActions: GetEventActions(),
    Properties: AssignProporties({ Name: "UserList" }, [GetSearchOperationView(), GetAlert(), GetDataGridView()])
}

function GetSearchOperationView() {
    return {
        Name: "SearchOperationView1",
        Entity: Entity,
        Type: "RowsColsView",
        ClassName: "DivLeftRightView",
        Properties: AssignProporties({ Name: "UserList" }, [{ EventActionName: "ToEditPage", ...GetButton("ToEditPage", "新增", "primary", 1, 1) },
        { EventActionName: "EditUser", ColStyle: { paddingLeft: 0 }, ...GetButton("EditUser", "修改", "default", 1, 2) },
        {
            EventActionName: "DeleteUser",
            ColStyle: { paddingLeft: 0 },
            DataActionType: DataActionTypes.DeleteEntityData,
            SuccessTip: "删除成功！",
            ConfirmTip: "请确认是否删除当前用户？",
            ...GetButton("DeleteUser", "删除", "default", 1, 4)
        },
        GetKeyword()
        ])
    }
}

function GetKeyword() {
    const p = GetTextBox("Keyword", "", "Search", 2, 3, "请输入关键字")
    p.ColStyle = { paddingRight: 8, paddingLeft: 2 };
    p.IsCondition = true;
    p.PropertyName = "LoginName,UserName";
    p.OperateLogic = "like";
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
        Entity: Entity,
        Type: "DataGridView",
        EntitySearchQuery: DataActionTypes.SearchQuery,
        EventActionName: "SearchQuery",
        IsDiv: true,
        ClassName: "DivInfoView3",
        IsRowSelection: true,
        IsSingleSelection: true,
        Properties: AssignProporties(User, ["LoginName", "UserName", "LastLoginDate", { Name: "CreateDate", OrderByType: "desc" }, { Name: "RowVersion", IsVisible: false }])
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
        PageUrl: "/SystemManage/UserEdit"
    },
    {
        Name: "EditUser",
        Type: "DataGridView/SelectRowToPage",
        DataGridView: "DataGridView1",
        AlertMessage: "AlertMessage",
        PageUrl: "/SystemManage/UserEdit?UserId=#{UserId}&MenuName=" + escape("修改")
    },
    {
        Name: "DeleteUser",
        Type: "DataGrid/BatchUpdateRowDataList",
        DataGridView: "DataGridView1",
        AlertMessage: "AlertMessage"
    }]
}
