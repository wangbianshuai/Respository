const operationLog = require("../../entities/operationLog");
const { getButton, assignProporties, getTextBox, getSelect, getDatePicker } = require("../../Common");

//系统管理/操作日志 4200-4299
const dataActionTypes = {
    //搜索查询
    searchQuery: 4200,
};

const { name, primaryKey, viewName } = operationLog;
const entity = { name, primaryKey, viewName };

module.exports = {
    name: "operationLog",
    type: "View",
    eventActions: getEventActions(),
    properties: assignProporties({ name: "operationLog" }, [getSearchOperationView(), getDataGridView()])
}

function getSearchOperationView() {
    return {
        name: "searchOperationView1",
        entity: entity,
        type: "RowsColsView",
        className: "divSerachView",
        properties: assignProporties({ name: "operationLog" }, [
            getEditSelect("LogType", "类型", getLoyTypeDataSource(), 1, 1),
            getEditSelect("RequestType", "请求类型", getRequestDataSource(), 1, 2),
            getTextBox2("EntityName", "实体名", 1, 3),
            getTextBox2("MethodName", "方法名", 1, 4),
            { ...getDatePicker2("StartDate", "开始日期", 2, 1, "大于或等于其值"), isMonthFirst: true, propertyName: "CreateDate", operateLogic: ">=" },
            { ...getDatePicker2("EndDate", "至", 2, 2, "小于其值"), isCurrentDay: true, propertyName: "CreateDate", operateLogic: "<" },
            { ...getButton("search", "搜索", "primary", 2, 3), isFormItem: true, icon: "search", eventActionName: "searchQuery", pressEnterEventActionName: "searchQuery" },
            { ...getButton("clearQuery", "清空", "default", 2, 4), isFormItem: true, eventActionName: "clearQuery" }
        ])
    }
}

function getRequestDataSource() {
    return [{ value: "POST", text: "POST" }, { value: "PUT", text: "PUT" }, { value: "GET", text: "GET" }, { value: "DELETE", text: "DELETE" }]
}

function getLoyTypeDataSource() {
    return [{ value: "Success", text: "成功" }, { value: "message", text: "信息" }, { value: "Exception", text: "异常" }]
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
        properties: assignProporties(operationLog, ["LogType", "RequestType", "EntityName", "MethodName", "IPAddress", "StartTime", "EndTime", "ElapsedMilliseconds", "Name",
            { name: "CreateDate", OrderByType: "desc" }, getLookDetail(), { name: "LogPath", isVisible: false }])
    }
}

function getLookDetail() {
    return {
        name: "LookDetail",
        isOpenPage: true,
        isAddRouterBase: true,
        pageUrl: "operationLog.html?Path=#{LogPath}"
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
