const requestServiceLog = require("../../entities/requestServiceLog");
const { getButton, assignProporties, getSelect2, getSelect, getDatePicker } = require("../../Common");

//系统管理/请求服务日志 400-499
const dataActionTypes = {
    //搜索查询
    searchQuery: 400,
    //删除实体数据
    deleteEntityData: 401,
    //Excel导出
    excelExport: 402,
    //重发
    reSend: 403
};

const { name, primaryKey, viewName } = requestServiceLog;
const entity = { name, primaryKey, viewName };

module.exports = {
    name: "requestServiceLog",
    type: "View",
    eventActions: getEventActions(),
    properties: assignProporties({ name: "requestServiceLog" }, [getSearchOperationView(), getDataGridView()])
}

function getSearchOperationView() {
    return {
        name: "searchOperationView1",
        entity: entity,
        type: "RowsColsView",
        className: "divSerachView",
        properties: assignProporties({ name: "requestServiceLog" }, [
            getEditSelect("LogType", "类型", getLoyTypeDataSource(), 1, 1),
            getEditSelect("isReSend", "是否重发记录", requestServiceLog.isReSendDataSource, 1, 2),
            getEditSelect2("ServiceInterfaceId", "服务接口", requestServiceLog.serviceInterfaceDataSource, 1, 3),
            { ...getDatePicker2("StartDate", "开始日期", 2, 1, "大于或等于其值"), isMonthFirst: true, propertyName: "CreateDate", operateLogic: ">=" },
            { ...getDatePicker2("EndDate", "至", 2, 2, "小于其值"), isCurrentDay: true, propertyName: "CreateDate", operateLogic: "<" },
            { ...getButton("search", "搜索", "primary", 2, 3), isFormItem: true, Icon: "search", eventActionName: "searchQuery", pressEnterEventActionName: "searchQuery" },
            { ...getButton("clearQuery", "清空", "default", 2, 4), isFormItem: true, eventActionName: "clearQuery" },
            {
                eventActionName: "reSend", ...getButton("reSend", "重发", "primary", 3, 1), style: { marginLeft: 16, marginBottom: 16 },
                dataActionType: dataActionTypes.reSend,
                successTip: "重发成功！",
                confirmTip: "请确认是否重发选择请求服务？",
            },
        ])
    }
}

function getEditSelect2(name, label, serviceDataSource, x, y, defaultValue) {
    return {
        ...getSelect2(name, label, serviceDataSource, x, y, defaultValue),
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

function getLoyTypeDataSource() {
    return [{ value: "1", text: "成功" }, { value: "2", text: "失败" }]
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
        isRowSelection: true,
        className: "divInfoView3",
        properties: assignProporties(requestServiceLog, ["LogTypeName", "ServiceInterfaceName", "ReSendCount", "isReSendName", "StartTime", "EndTime", "ElapsedMilliseconds",
            { name: "CreateDate", OrderByType: "desc" }, getOperation()])
    }
}

function getOperation() {
    return {
        name: "operation",
        label: "操作",
        isData: false,
        actionList: assignProporties(requestServiceLog, [lookDetail()])
    }
}

function lookDetail() {
    return {
        name: "lookDetail",
        label: "查看",
        eventActionName: "lookDetail",
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
        name: "lookDetail",
        type: "dataGridView/selectRowToPage",
        dataGridView: "dataGridView1",
        pageUrl: "/systemManage/requestServiceLogEdit?LogId=#{LogId}&menuName=" + escape("查看")
    },
    {
        name: "reSend",
        type: "dataGrid/batchUpdateRowDataList",
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
