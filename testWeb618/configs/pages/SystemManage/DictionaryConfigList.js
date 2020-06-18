const DictionaryConfig = require("../../entities/DictionaryConfig");
const { GetButton, AssignProporties, GetTextBox } = require("../../Common");

//SystemManage/DictionaryConfig 600-699
const DataActionTypes = {
    //搜索查询
    SearchQuery: 600,
    //删除实体数据
    DeleteEntityData: 601,
    //Excel导出
    ExcelExport: 602
};

const Entity = { Name: DictionaryConfig.Name, PrimaryKey: DictionaryConfig.PrimaryKey, ViewName: "ViewDictionaryConfig" }

module.exports = {
    Name: "DictionaryConfigList",
    Type: "View",
    EventActions: GetEventActions(),
    Properties: AssignProporties({ Name: "DictionaryConfigList" }, [GetSearchOperationView(), GetAlert(), GetDataGridView()])
}

function GetSearchOperationView() {
    return {
        Name: "SearchOperationView1",
        Entity: Entity,
        Type: "RowsColsView",
        ClassName: "DivLeftRightView",
        Properties: AssignProporties({ Name: "DictionaryConfigList" }, [{ EventActionName: "ToEditPage", ...GetButton("ToEditPage", "新增", "primary", 1, 1) },
        { EventActionName: "EditDictionaryConfig", ColStyle: { paddingLeft: 0 }, ...GetButton("EditDictionaryConfig", "修改", "default", 1, 2) },
        {
            EventActionName: "DeleteDictionaryConfig",
            ColStyle: { paddingLeft: 0 },
            DataActionType: DataActionTypes.DeleteEntityData,
            SuccessTip: "删除成功！",
            ConfirmTip: "请确认是否删除当前键值配置？",
            ...GetButton("DeleteDictionaryConfig", "删除", "default", 1, 4)
        },
        GetKeyword()
        ])
    }
}

function GetKeyword() {
    const p = GetTextBox("Keyword", "", "Search", 2, 3, "请输入关键字")
    p.ColStyle = { paddingRight: 8, paddingLeft: 2 };
    p.IsCondition = true;
    p.PropertyName = "Name,Value";
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
        Properties: AssignProporties(DictionaryConfig, ["Name", "Value", "TypeName", "Remark", { Name: "CreateDate", OrderByType: "desc" }, { Name: "RowVersion", IsVisible: false }])
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
        PageUrl: "/SystemManage/DictionaryConfigEdit"
    },
    {
        Name: "EditDictionaryConfig",
        Type: "DataGridView/SelectRowToPage",
        DataGridView: "DataGridView1",
        AlertMessage: "AlertMessage",
        PageUrl: "/SystemManage/DictionaryConfigEdit?DictionaryConfigId=#{DictionaryConfigId}&MenuName=" + escape("修改")
    },
    {
        Name: "DeleteDictionaryConfig",
        Type: "DataGrid/BatchUpdateRowDataList",
        DataGridView: "DataGridView1",
        AlertMessage: "AlertMessage"
    }]
}
