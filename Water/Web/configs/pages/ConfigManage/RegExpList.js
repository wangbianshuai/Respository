const RegExp = require("../../entities/RegExp");
const { GetButton, AssignProporties, GetTextBox } = require("../../Common");

//配置管理/正则表达式列表 400-499
const DataActionTypes = {
    //搜索查询
    SearchQuery: 400,
    //删除实体数据
    DeleteEntityData: 401
};
const Entity = { Name: RegExp.Name, PrimaryKey: RegExp.PropertyPrimaryKey || RegExp.PrimaryKey }

module.exports = {
    Name: "RegExpList",
    Type: "View",
    ModelsConfig: RegExp.ModelsConfig,
    ActionOptions: GetActionOptions(),
    EventActions: GetEventActions(),
    ActionNames: ["SearchQuery", "Delete"],
    Properties: AssignProporties({ Name: "RegExpList" }, [GetSearchOperationView(), GetAlert(), GetDataGridView()])
}

function GetActionOptions() {
    return { Name: "ConfigManage_RegExpList", ServiceName: "RegExpService", MinActionType: 400, MaxActionType: 499, ActionTypes: DataActionTypes }
}

function GetSearchOperationView() {
    return {
        Name: "SearchOperationView1",
        Entity: RegExp,
        Type: "RowsColsView",
        ClassName: "DivLeftRightView",
        Properties: AssignProporties({ Name: "RegExpList" }, [{ EventActionName: "ToEditPage", ...GetButton("ToEditPage", "新增", "primary", 1, 1) },
        { EventActionName: "EditRegExp", ColStyle: { paddingLeft: 0 }, ...GetButton("EditRegExp", "修改", "default", 1, 2) },
        {
            EventActionName: "DeleteRegExp",
            ColStyle: { paddingLeft: 0 },
            DataActionType: DataActionTypes.DeleteEntityData,
            SuccessTip: "删除成功！",
            ConfirmTip: "请确认是否删除当前应用？",
            ...GetButton("DeleteRegExp", "删除", "default", 1, 4)
        },
        GetKeyword()
        ])
    }
}

function GetKeyword() {
    const p = GetTextBox("Keyword", "", "Search", 2, 3, "请输入关键字")
    p.ColStyle = { paddingRight: 8, paddingLeft: 2 };
    p.IsCondition = true;
    p.PropertyName = "Name,Remark";
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
        Title: "正则表达式信息",
        IsRowSelection: true,
        IsSingleSelection: true,
        Properties: AssignProporties(RegExp, ["Name", "Expression", "Remark", { Name: "Create_Date", OrderByType: "desc" }])
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
        PageUrl: "/ConfigManage/RegExpEdit"
    },
    {
        Name: "EditRegExp",
        Type: "DataGridView/SelectRowToPage",
        DataGridView: "DataGridView1",
        AlertMessage: "AlertMessage",
        PageUrl: "/ConfigManage/RegExpEdit?Id=#{Id}&MenuName=" + escape("修改")
    },
    {
        Name: "DeleteRegExp",
        Type: "DataGrid/BatchUpdateRowDataList",
        DataGridView: "DataGridView1",
        AlertMessage: "AlertMessage"
    }]
}
