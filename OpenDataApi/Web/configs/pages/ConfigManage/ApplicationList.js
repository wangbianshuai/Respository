const Application = require("../../entities/Application");
const { GetButton, AssignProporties, GetTextBox } = require("../../Common");

//配置管理/应用列表 100-199
const DataActionTypes = {
    //搜索查询
    SearchQuery: 100,
    //删除实体数据
    DeleteEntityData: 101
};

module.exports = {
    Name: "ApplicationList",
    Type: "View",
    EventActions: GetEventActions(),
    Properties: AssignProporties({ Name: "ApplicationList" }, [GetSearchOperationView(), GetAlert(), GetDataGridView()])
}

function GetSearchOperationView() {
    return {
        Name: "SearchOperationView1",
        Entity: Application,
        Type: "RowsColsView",
        ClassName: "DivLeftRightView",
        Properties: AssignProporties({ Name: "ApplicationList" }, [{ EventActionName: "ToEditPage", ...GetButton("ToEditPage", "新增", "primary", 1, 1) },
        { EventActionName: "EditApplication", ColStyle: { paddingLeft: 0 }, ...GetButton("EditApplication", "修改", "default", 1, 2) },
        {
            EventActionName: "DeleteApplication",
            ColStyle: { paddingLeft: 0 },
            DataActionType: DataActionTypes.DeleteEntityData,
            SuccessTip: "删除成功！",
            ConfirmTip: "请确认是否删除当前应用？",
            ...GetButton("DeleteApplication", "删除", "default", 1, 4)
        },
        GetKeyword()
        ])
    }
}

function GetKeyword() {
    const p = GetTextBox("Keyword", "", "Search", 2, 3, "请输入关键字")
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
        Entity: Application,
        Type: "DataGridView",
        EntitySearchQuery: DataActionTypes.SearchQuery,
        EventActionName: "SearchQuery",
        Title: "应用信息",
        IsRowSelection: true,
        IsSingleSelection: true,
        Properties: AssignProporties(Application, ["Name", "Connection_String", "Db_User", "Db_Password", "Remark", "CreateDate"])
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
        PageUrl: "/ConfigManage/ApplicationEdit"
    },
    {
        Name: "EditApplication",
        Type: "DataGridView/SelectRowToPage",
        DataGridView: "DataGridView1",
        AlertMessage: "AlertMessage",
        PageUrl: "/ConfigManage/ApplicationEdit?ApplicationId=#{applicationId}&MenuName=" + escape("修改")
    },
    {
        Name: "DeleteApplication",
        Type: "DataGrid/BatchUpdateRowDataList",
        DataGridView: "DataGridView1",
        AlertMessage: "AlertMessage"
    }]
}
