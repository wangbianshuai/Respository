const fileRecord = require("../../entities/fileRecord");
const { getButton, assignProporties, getTextBox, getDatePicker } = require("../../Common");

//系统管理/文件记录 1700-1799
const dataActionTypes = {
    //搜索查询
    searchQuery: 1700,
    //删除实体数据
    deleteEntityData: 1701,
    //Excel导出
    excelExport: 1702,
};

const { name, primaryKey, viewName } = fileRecord;
const entity = { name, primaryKey, viewName, expandMethods: { searchQuery: 'Select2', delete: 'Delete2', isBatchDelete: true } };

module.exports = {
    name: "fileRecord",
    type: "View",
    eventActions: getEventActions(),
    properties: assignProporties({ name: "fileRecord" }, [getSearchOperationView(), getDataGridView()])
}

function getSearchOperationView() {
    return {
        name: "searchOperationView1",
        entity: entity,
        type: "RowsColsView",
        className: "divSerachView",
        properties: assignProporties({ name: "fileRecord" }, [
            { ...getDatePicker2("StartDate", "开始日期", 1, 1, "大于或等于其值"), isMonthFirst: true, propertyName: "CreateDate", operateLogic: ">=" },
            { ...getDatePicker2("EndDate", "至", 1, 2, "小于其值"), isCurrentDay: true, propertyName: "CreateDate", operateLogic: "<" },
            {
                ...getTextBox2("keyword", "关键字", 2, 1, "", "AppId/文件名/文件类型"), propertyName: "FileName,FileType,AppId",
                operateLogic: "like", pressEnterEventActionName: "searchQuery", pressEnterEventPropertyName: "search",
            },
            { ...getButton("search", "搜索", "primary", 2, 3), isFormItem: true, icon: "search", eventActionName: "searchQuery", pressEnterEventActionName: "searchQuery" },
            { ...getButton("clearQuery", "清空", "default", 2, 4), isFormItem: true, eventActionName: "clearQuery" },
            {
                eventActionName: "delete", ...getButton("delete", "删除", "primary", 3, 1), style: { marginLeft: 16, marginBottom: 16 },
                dataActionType: dataActionTypes.deleteEntityData,
                successTip: "删除成功！",
                confirmTip: "请确认是否删除选择的记录？",
            },
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
        isRowSelection: true,
        className: "divInfoView3",
        properties: assignProporties(fileRecord, [{ isOpenPage: true, imageWidth: 75, imageTypeName: 'FileType', imageTypeValue: 'images', name: "FilePath" }, "FileName", "FileType", "FileSize", "AppId", "IpAddress",
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
        name: "delete",
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
