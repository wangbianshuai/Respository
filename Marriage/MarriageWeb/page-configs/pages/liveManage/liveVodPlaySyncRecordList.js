const liveVodPlaySyncRecord = require("../../entities/liveVodPlaySyncRecord");
const { getButton, assignProporties, getDatePicker } = require("../../Common");

//直播管理/直播点播同步记录 2000-2099
const dataActionTypes = {
    //搜索查询
    searchQuery: 2000,
    //删除实体数据
    deleteEntityData: 2001,
    //Excel导出
    excelExport: 2002
};

const { name, primaryKey, viewName } = liveVodPlaySyncRecord;
const entity = { name, primaryKey, viewName };

module.exports = {
    name: "liveVodPlaySyncRecord",
    type: "View",
    eventActions: getEventActions(),
    properties: assignProporties({ name: "liveVodPlaySyncRecord" }, [getSearchOperationView(), getDataGridView()])
}

function getSearchOperationView() {
    return {
        name: "searchOperationView1",
        entity: entity,
        type: "RowsColsView",
        className: "divSerachView",
        properties: assignProporties({ name: "liveVodPlaySyncRecord" }, [
            { ...getDatePicker2("DayTime", "开始日期", 2, 1, "大于或等于其值"), isMonthFirst: true, propertyName: "DayTime", operateLogic: ">=" },
            { ...getDatePicker2("DayTime", "至", 2, 2, "小于其值"), isCurrentDay: true, propertyName: "DayTime", operateLogic: "<" },
            { ...getButton("search", "搜索", "primary", 2, 3), isFormItem: true, icon: "search", eventActionName: "searchQuery", pressEnterEventActionName: "searchQuery" },
            { ...getButton("clearQuery", "清空", "default", 2, 4), isFormItem: true, eventActionName: "clearQuery" }
        ])
    }
}

function getDatePicker2(name, label, x, y, placeHolder, defaultValue) {
    return {
        ...getDatePicker(name, label, x, y, defaultValue),
        isFormItem: true, colSpan: 6,
        isNullable: true,
        placeHolder: placeHolder,
        maxLength: 20,
        labelCol: 8,
        wrapperCol: 15,
        dataType: "DateTime",
        isCondition: true
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
        properties: assignProporties(liveVodPlaySyncRecord, ["DayTime", "RecordCount", "SucceedCount", "FailedCount",
            { name: "CreateDate", OrderByType: "desc" }])
    }
}

function getEventActions() {
    return [{
        name: "searchQuery",
        type: "dataGridView/searchQuery",
        searchView: "searchOperationView1",
        searchButton: "search",
        dataGridView: "dataGridView1"
    },
    {
        name: "clearQuery",
        type: "dataGridView/searchQuery",
        searchView: "searchOperationView1",
        searchButton: "clearQuery",
        dataGridView: "dataGridView1",
        isClearQuery: true
    }]
}