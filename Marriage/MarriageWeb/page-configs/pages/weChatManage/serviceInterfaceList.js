const serviceInterface = require("../../entities/serviceInterface");
const { getButton, assignProporties, getTextBox } = require("../../Common");

//weChatManage/serviceInterface 1100-1199
const dataActionTypes = {
    //搜索查询
    searchQuery: 1100,
    //删除实体数据
    deleteEntityData: 1101,
    //Excel导出
    excelExport: 1102
};

const { name, primaryKey, viewName } = serviceInterface;
const entity = { name, primaryKey, viewName };

module.exports = {
    name: "serviceInterfaceList",
    type: "View",
    eventActions: getEventActions(),
    properties: assignProporties({ name: "serviceInterfaceList" }, [getSearchOperationView(), getAlert(), getDataGridView()])
}

function getSearchOperationView() {
    return {
        name: "searchOperationView1",
        entity: entity,
        type: "RowsColsView",
        className: "divLeftRightView",
        properties: assignProporties({ name: "serviceInterfaceList" }, [{ eventActionName: "toEditPage", ...getButton("toEditPage", "新增", "primary", 1, 1) },
        { eventActionName: "editEntityData", colStyle: { paddingLeft: 0 }, ...getButton("editEntityData", "修改", "default", 1, 2) },
        {
            eventActionName: "deleteEntityData",
            colStyle: { paddingLeft: 0 },
            dataActionType: dataActionTypes.deleteEntityData,
            successTip: "删除成功！",
            confirmTip: "请确认是否删除当前服务接口？",
            ...getButton("deleteEntityData", "删除", "default", 1, 4)
        },
        getKeyword()
        ])
    }
}

function getKeyword() {
    const p = getTextBox("keyword", "", "Search", 2, 3, "请输入关键字")
    p.colStyle = { paddingRight: 8, paddingLeft: 2 };
    p.isCondition = true;
    p.propertyName = "Name,InterfaceName,MethodName";
    p.operateLogic = "like";
    p.eventActionName = "searchQuery";
    p.pressEnterEventActionName = "searchQuery";
    p.colStyle = { width: 240 }
    return p;
}

function getAlert() {
    return {
        name: "alertMessage",
        type: "Alert"
    }
}

function getDataGridView() {
    return {
        name: "dataGridView1",
        entity: entity,
        type: "DataGridView",
        entitySearchQuery: dataActionTypes.searchQuery,
        eventActionName: "searchQuery",
        isDiv: true,
        className: "divInfoView3",
        isRowSelection: true,
        isSingleSelection: true,
        properties: assignProporties(serviceInterface, ["Name", "InterfaceName", "MethodName", "Url", "Remark", { name: "CreateDate", OrderByType: "desc" }, { name: "RowVersion", isVisible: false }])
    }
}

function getEventActions() {
    return [{
        name: "searchQuery",
        type: "dataGridView/searchQuery",
        searchView: "searchOperationView1",
        searchButton: "keyword",
        dataGridView: "dataGridView1",
        alertMessage: "alertMessage"
    },
    {
        name: "toEditPage",
        type: "page/toPage",
        pageUrl: "/weChatManage/serviceInterfaceEdit"
    },
    {
        name: "editEntityData",
        type: "dataGridView/selectRowToPage",
        dataGridView: "dataGridView1",
        alertMessage: "alertMessage",
        pageUrl: "/weChatManage/serviceInterfaceEdit?ServiceInterfaceId=#{ServiceInterfaceId}&menuName=" + escape("修改")
    },
    {
        name: "deleteEntityData",
        type: "dataGrid/batchUpdateRowDataList",
        dataGridView: "dataGridView1",
        alertMessage: "alertMessage"
    }]
}
