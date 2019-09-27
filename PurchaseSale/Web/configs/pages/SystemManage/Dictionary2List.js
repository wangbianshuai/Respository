const Dictionary2 = require("../../entities/Dictionary2");
const { GetButton, AssignProporties, GetTextBox } = require("../../Common");

//系统管理/键值配置列表 200-299
const DataActionTypes = {
    //搜索查询
    SearchQuery: 200,
    //删除实体数据
    DeleteEntityData: 201
};

const Entity = { Name: Dictionary2.Name, PrimaryKey: Dictionary2.PrimaryKey, ViewName: "ViewDictionary2" }

module.exports = {
    Name: "Dictionary2List",
    Type: "View",
    EventActions: GetEventActions(),
    Properties: AssignProporties({ Name: "Dictionary2List" }, [GetSearchOperationView(), GetAlert(), GetDataGridView()])
}

function GetSearchOperationView() {
    return {
        Name: "SearchOperationView1",
        Entity: Entity,
        Type: "RowsColsView",
        ClassName: "DivLeftRightView",
        Properties: AssignProporties({ Name: "Dictionary2List" }, [{ EventActionName: "ToEditPage", ...GetButton("ToEditPage", "新增", "primary", 1, 1) },
        { EventActionName: "EditDictionary2", ColStyle: { paddingLeft: 0 }, ...GetButton("EditDictionary2", "修改", "default", 1, 2) },
        {
            EventActionName: "DeleteDictionary2",
            ColStyle: { paddingLeft: 0 },
            DataActionType: DataActionTypes.DeleteEntityData,
            SuccessTip: "删除成功！",
            ConfirmTip: "请确认是否删除当前键值配置？",
            ...GetButton("DeleteDictionary2", "删除", "default", 1, 4)
        },
        GetKeyword()
        ])
    }
}

function GetKeyword() {
    const p = GetTextBox("Keyword", "", "Search", 2, 3, "请输入关键字")
    p.ColStyle = { paddingRight: 8, paddingLeft: 2 };
    p.IsCondition = true;
    p.PropertyName = "Name,Value,Remark";
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
        Properties: AssignProporties(Dictionary2, ["Name", "Value", "Remark", { Name: "CreateDate", OrderByType: "desc" }, { Name: "RowVersion", IsVisible: false }])
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
        PageUrl: "/SystemManage/Dictionary2Edit"
    },
    {
        Name: "EditDictionary2",
        Type: "DataGridView/SelectRowToPage",
        DataGridView: "DataGridView1",
        AlertMessage: "AlertMessage",
        PageUrl: "/SystemManage/Dictionary2Edit?Id=#{Id}&MenuName=" + escape("修改")
    },
    {
        Name: "DeleteDictionary2",
        Type: "DataGrid/BatchUpdateRowDataList",
        DataGridView: "DataGridView1",
        AlertMessage: "AlertMessage"
    }]
}
