const liveVodPlayInfo = require("../../entities/liveVodPlayInfo");
const { getButton, assignProporties, getTextBox, getSelect, createGuid, getDatePicker } = require("../../Common");

//直播管理/直播点播播放 1900-1999
const dataActionTypes = {
    //搜索查询
    searchQuery: 1900,
    //删除实体数据
    deleteEntityData: 1901,
    //Excel导出
    excelExport: 1902,
    //同步播放流量
    syncPlayFlux: 1903
};

const { name, primaryKey, viewName } = liveVodPlayInfo;
const entity = { name, primaryKey, viewName };

module.exports = {
    name: "liveVodPlayInfo",
    type: "View",
    dialogViews: getDialogViews(),
    eventActions: getEventActions(),
    properties: assignProporties({ name: "liveVodPlayInfo" }, [getSearchOperationView(), getDataGridView()])
}

function getSearchOperationView() {
    return {
        name: "searchOperationView1",
        entity: entity,
        type: "RowsColsView",
        className: "divSerachView",
        properties: assignProporties({ name: "liveVodPlayInfo" }, [
            getEditSelect("ResponseStatus", "响应状态", liveVodPlayInfo.responseStatusDataSource, 1, 1),
            getTextBox2("FileId", "视频文件ID", 1, 2),
            getTextBox2("Sync", "同步编号", 1, 3),
            { ...getDatePicker2("DayTime", "开始日期", 2, 1, "大于或等于其值"), isMonthFirst: true, propertyName: "DayTime", operateLogic: ">=" },
            { ...getDatePicker2("DayTime", "至", 2, 2, "小于其值"), isCurrentDay: true, propertyName: "DayTime", operateLogic: "<" },
            { ...getButton("search", "搜索", "primary", 2, 3), isFormItem: true, icon: "search", eventActionName: "searchQuery", pressEnterEventActionName: "searchQuery" },
            { ...getButton("clearQuery", "清空", "default", 2, 4), isFormItem: true, eventActionName: "clearQuery" },
            {
                eventActionName: "syncPlayFlux", ...getButton("syncPlayFlux", "同步播放流量", "primary", 3, 1), icon: "sync", style: { marginLeft: 16, marginBottom: 16 },
                dataActionType: dataActionTypes.syncPlayFlux,
            }
        ])
    }
}


function getTextBox2(name, label, x, y, contorlType, placeHolder, maxLength) {
    return {
        ...getTextBox(name, label, contorlType, x, y, placeHolder, maxLength || 50),
        isFormItem: true,
        colSpan: 6,
        labelCol: 8,
        wrapperCol: 15,
        operateLogic: "=",
        isNullable: true,
        isCondition: true
    }
}

function getEditSelect(name, label, dataSource, x, y, defaultValue) {
    return {
        ...getSelect(name, label, dataSource, x, y, defaultValue),
        isFormItem: true,
        colSpan: 6,
        labelCol: 8,
        wrapperCol: 15,
        operateLogic: "=",
        isNullable: true,
        allowClear: true,
        isCondition: true
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
        properties: assignProporties(liveVodPlayInfo, ["DayTime", "Name", "LiveCode", "FileId", "TotalFlux", "ResponseStatusName",
            { name: "ResponseContent", isVisible: false },
            { name: "CreateDate", OrderByType: "desc" }, getOperation()])
    }
}

function getOperation() {
    return {
        name: "operation",
        label: "响应报文",
        isData: false,
        actionList: assignProporties(liveVodPlayInfo, [lookDetail()])
    }
}

function lookDetail() {
    return {
        name: "lookDetail",
        label: "查看",
        eventActionName: "lookResponseContent",
        type: "AButton"
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
        name: "syncPlayFlux",
        type: "dialog/showDialogEditEntityData",
        dialogView: "syncFluxEditView",
        dataGridView: "dataGridView1",
        editView: 'syncFluxEditView'
    },
    {
        name: "lookResponseContent",
        type: "dialog/showDialogLookRowData",
        dialogView: "lookResponseContentView",
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

function getDialogViews() {
    return [
        getSyncFluxEditView(),
        getLookResponseContentView(),
    ]
}

function getLookResponseContentView() {
    return {
        id: createGuid(),
        dialogId: createGuid(),
        name: "lookResponseContentView",
        entity,
        type: "RowsColsView",
        dialogTitle: "响应报文",
        dialogWidth: 600,
        className: "divView2",
        dialogStyle: { height: 260, overflow: "auto" },
        properties: assignProporties(liveVodPlayInfo, [
            { ...getTextBox3("ResponseContent", "响应报文", 1, 1, "TextArea"), rows: 10, isReadOnly: true }
        ])
    }
}

function getSyncFluxEditView() {
    return {
        id: createGuid(),
        dialogId: createGuid(),
        name: "syncFluxEditView",
        entity,
        type: "RowsColsView",
        dialogTitle: "同步播放流量",
        dialogWidth: 600,
        className: "divView2",
        successTip: '同步成功',
        dialogStyle: { height: 260, overflow: "auto" },
        saveEntityDataActionType: dataActionTypes.syncPlayFlux,
        properties: assignProporties(liveVodPlayInfo, getSyncFluxProperties())
    }
}

function getSyncFluxProperties() {
    return [
        getTextBox3("uin", "uin", 1, 1, "", "请输入uin", 50, false),
        getTextBox3("skey", "skey", 2, 1, "", "请输入skey", 50, false),
        getTextBox3("mc_gtk", "mc_gtk", 3, 1, "", "请输入mc_gtk", 50, false),
        { ...getDatePicker3("dayTime", "日期", 4, 1, false), placeHolder: '请输入日期', isYesterday: true }
    ]
}

function getTextBox3(name, label, x, y, contorlType, placeHolder, maxLength, isNullable, isVisible, validateNames, validateTipMessage) {
    return {
        ...getTextBox(name, label, contorlType, x, y, placeHolder, maxLength || 50),
        validateNames, validateTipMessage,
        isFormItem: true,
        colSpan: 24,
        labelCol: 5,
        wrapperCol: 16,
        isNullable,
        isVisible,
        isEdit: true
    }
}

function getDatePicker3(name, label, x, y, isNullable, defaultValue) {
    return {
        ...getDatePicker(name, label, x, y, defaultValue),
        isFormItem: true,
        colSpan: 24,
        labelCol: 5,
        wrapperCol: 16,
        isNullable,
        isEdit: true
    }
}