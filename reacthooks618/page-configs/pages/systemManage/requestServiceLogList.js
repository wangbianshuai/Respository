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

const entity = { name: requestServiceLog.name, primaryKey: requestServiceLog.primaryKey, viewName: "ViewRequestServiceLog" }

module.exports = {
    name: "requestServiceLog",
    type: "view",
    eventActions: getEventActions(),
    properties: assignProporties({ name: "requestServiceLog" }, [getSearchOperationView(), getDataGridView()])
}

function getSearchOperationView() {
    return {
        name: "SearchOperationView1",
        entity: entity,
        type: "RowsColsView",
        className: "DivSerachView",
        properties: assignProporties({ name: "requestServiceLog" }, [
            getEditSelect("LogType", "类型", getLoyTypeDataSource(), 1, 1),
            getEditSelect("isReSend", "是否重发记录", requestServiceLog.isReSendDataSource, 1, 2),
            getEditSelect2("ServiceInterfaceId", "服务接口", requestServiceLog.serviceInterfaceDataSource, 1, 3),
            { ...getDatePicker2("StartDate", "开始日期", 2, 1, "大于或等于其值"), isMonthFirst: true, propertyName: "CreateDate", operateLogic: ">=" },
            { ...getDatePicker2("EndDate", "至", 2, 2, "小于其值"), isCurrentDay: true, propertyName: "CreateDate", operateLogic: "<" },
            { ...getButton("Search", "搜索", "primary", 2, 3), isFormItem: true, Icon: "search", eventActionName: "searchQuery", pressEnterEventActionName: "searchQuery" },
            { ...getButton("ClearQuery", "清空", "default", 2, 4), isFormItem: true, eventActionName: "ClearQuery" },
            {
                eventActionName: "reSend", ...getButton("reSend", "重发", "primary", 3, 1), style: { marginLeft: 16, marginBottom: 16 },
                dataActionType: dataActionTypes.reSend,
                SuccessTip: "重发成功！",
                ConfirmTip: "请确认是否重发选择请求服务？",
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
        name: "DataGridView1",
        entity: entity,
        type: "dataGridView",
        entitySearchQuery: dataActionTypes.searchQuery,
        eventActionName: "searchQuery",
        isDiv: true,
        isRowSelection: true,
        className: "DivInfoView3",
        properties: assignProporties(requestServiceLog, ["LogTypeName", "ServiceInterfaceName", "ReSendCount", "isReSendName", "StartTime", "EndTime", "ElapsedMilliseconds",
            { name: "CreateDate", OrderByType: "desc" }, getOperation()])
    }
}

function getOperation() {
    return {
        name: "Operation",
        label: "操作",
        isData: false,
        actionList: assignProporties(requestServiceLog, [LookDetail()])
    }
}

function LookDetail() {
    return {
        name: "LookDetail",
        label: "查看",
        eventActionName: "LookDetail",
        type: "AButton"
    }
}

function getEventActions() {
    return [{
        name: "searchQuery",
        type: "dataGridView/searchQuery",
        searchView: "SearchOperationView1",
        searchButton: "Search",
        dataGridView: "DataGridView1"
    },
    {
        name: "LookDetail",
        type: "dataGridView/SelectRowToPage",
        dataGridView: "DataGridView1",
        pageUrl: "/systemManage/requestServiceLogEdit?LogId=#{LogId}&MenuName=" + escape("查看")
    },
    {
        name: "reSend",
        type: "DataGrid/BatchUpdateRowDataList",
        dataGridView: "DataGridView1"
    },
    {
        name: "ClearQuery",
        type: "dataGridView/searchQuery",
        searchView: "SearchOperationView1",
        searchButton: "ClearQuery",
        dataGridView: "DataGridView1",
        isClearQuery: true
    }]
}
