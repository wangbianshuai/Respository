const DictionaryConfig = require("../../entities/DictionaryConfig");
const { getButton, assignProporties, getTextBox } = require("../../Common");

//systemManage/DictionaryConfig 600-699
const dataActionTypes = {
    //搜索查询
    searchQuery: 600,
    //删除实体数据
    deleteEntityData: 601,
    //Excel导出
    excelExport: 602
};

const entity = { name: DictionaryConfig.name, primaryKey: DictionaryConfig.primaryKey, viewName: "ViewDictionaryConfig" }

module.exports = {
    name: "DictionaryConfigList",
    type: "View",
    eventActions: getEventActions(),
    properties: assignProporties({ name: "DictionaryConfigList" }, [getSearchOperationView(), getAlert(), getDataGridView()])
}

function getSearchOperationView() {
    return {
        name: "SearchOperationView1",
        entity: entity,
        type: "RowsColsView",
        className: "divLeftRightView",
        properties: assignProporties({ name: "DictionaryConfigList" }, [{ eventActionName: "ToEditPage", ...getButton("ToEditPage", "新增", "primary", 1, 1) },
        { eventActionName: "EditDictionaryConfig", colStyle: { paddingLeft: 0 }, ...getButton("EditDictionaryConfig", "修改", "default", 1, 2) },
        {
            eventActionName: "DeleteDictionaryConfig",
            colStyle: { paddingLeft: 0 },
            dataActionType: dataActionTypes.deleteEntityData,
            successTip: "删除成功！",
            confirmTip: "请确认是否删除当前键值配置？",
            ...getButton("DeleteDictionaryConfig", "删除", "default", 1, 4)
        },
        getKeyword()
        ])
    }
}

function getKeyword() {
    const p = getTextBox("Keyword", "", "Search", 2, 3, "请输入关键字")
    p.colStyle = { paddingRight: 8, paddingLeft: 2 };
    p.isCondition = true;
    p.propertyName = "name,value";
    p.operateLogic = "like";
    p.eventActionName = "searchQuery";
    p.pressEnterEventActionName = "searchQuery";
    p.colStyle = { width: 240 }
    return p;
}

function getAlert() {
    return {
        name: "alertMessage",
        type: "alert"
    }
}

function getDataGridView() {
    return {
        name: "DataGridView1",
        entity: entity,
        type: "dataGridView",
        entitySearchQuery: dataActionTypes.searchQuery,
        eventActionName: "searchQuery",
        isDiv: true,
        className: "divInfoView3",
        isRowSelection: true,
        isSingleSelection: true,
        properties: assignProporties(DictionaryConfig, ["name", "value", "TypeName", "Remark", { name: "CreateDate", OrderByType: "desc" }, { name: "RowVersion", isVisible: false }])
    }
}

function getEventActions() {
    return [{
        name: "searchQuery",
        type: "dataGridView/searchQuery",
        searchView: "SearchOperationView1",
        searchButton: "Keyword",
        dataGridView: "DataGridView1",
        alertMessage: "alertMessage"
    },
    {
        name: "ToEditPage",
        type: "Page/toPage",
        pageUrl: "/systemManage/DictionaryConfigEdit"
    },
    {
        name: "EditDictionaryConfig",
        type: "dataGridView/selectRowToPage",
        dataGridView: "DataGridView1",
        alertMessage: "alertMessage",
        pageUrl: "/systemManage/DictionaryConfigEdit?DictionaryConfigId=#{DictionaryConfigId}&menuName=" + escape("修改")
    },
    {
        name: "DeleteDictionaryConfig",
        type: "DataGrid/batchUpdateRowDataList",
        dataGridView: "DataGridView1",
        alertMessage: "alertMessage"
    }]
}
