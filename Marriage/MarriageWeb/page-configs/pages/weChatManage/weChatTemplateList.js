const weChatTemplate = require("../../entities/weChatTemplate");
const { getButton, assignProporties, getTextBox } = require("../../Common");

//systemManage/weChatTemplateList 1600-1699
const dataActionTypes = {
    //搜索查询
    searchQuery: 1600,
    //删除实体数据
    deleteEntityData: 1601,
    //Excel导出
    excelExport: 1602,
    //syncWeChatTemplate:同步微信消息模板
    syncWeChatTemplate: 1603
};

const { name, primaryKey } = weChatTemplate;
const entity = { name, primaryKey };

module.exports = {
    name: "weChatTemplateList",
    type: "View",
    eventActions: getEventActions(),
    properties: assignProporties({ name: "weChatTemplateList" }, [getSearchOperationView(), getDataGridView()])
}

function getSearchOperationView() {
    return {
        name: "searchOperationView1",
        entity: entity,
        type: "RowsColsView",
        className: "divSerachView",
        properties: assignProporties({ name: "weChatTemplateList" }, [
            {
                ...getTextBox2("keyword", "关键字", 1, 1, "", "标题/一级行业/二级行业"), propertyName: "Title,PrimaryIndustry,DeputyIndustry",
                operateLogic: "like", pressEnterEventActionName: "searchQuery", pressEnterEventPropertyName: "search",
            },
            { ...getButton("search", "搜索", "primary", 1, 2), isFormItem: true, icon: "search", eventActionName: "searchQuery", pressEnterEventActionName: "searchQuery" },
            {
                eventActionName: "syncWeChatTemplate", ...getButton("syncWeChatTemplate", "同步微信", "primary", 2, 1), icon: 'sync', style: { marginLeft: 16, marginBottom: 16 },
                confirmTip: '确定要同步微信消息模板列表数据吗？', dataActionType: dataActionTypes.syncWeChatTemplate, successTip: '同步成功！'
            }])
    }
}

function getTextBox2(name, label, x, y, contorlType, placeHolder, maxLength) {
    return {
        ...getTextBox(name, label, contorlType, x, y, placeHolder, maxLength || 50),
        isFormItem: true,
        colSpan: 6,
        labelCol: 8,
        wrapperCol: 15,
        isNullable: true,
        isCondition: true
    }
}

function getDataGridView() {
    return {
        name: "dataGridView1",
        entity: entity,
        type: "DataGridView",
        entitySearchQuery: dataActionTypes.searchQuery,
        entityExcelExport: dataActionTypes.excelExport,
        eventActionName: "searchQuery",
        isDiv: true,
        className: "divInfoView3",
        isRowSelection: true,
        isSingleSelection: true,
        properties: assignProporties(weChatTemplate, ["Title", "PrimaryIndustry", "DeputyIndustry", "Content", "Example",
            { name: "UpdateDate", OrderByType: "desc" }])
    }
}

function getEventActions() {
    return [{
        name: "searchQuery",
        type: "dataGridView/searchQuery",
        searchView: "searchOperationView1",
        searchButton: "search",
        dataGridView: "dataGridView1"
    }, {
        name: "syncWeChatTemplate",
        type: "dataGridView/syncData",
        dataGridView: "dataGridView1"
    }]
}