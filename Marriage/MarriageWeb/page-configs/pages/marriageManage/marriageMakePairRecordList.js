const marriageMakePair = require("../../entities/marriageMakePair");
const { getButton, assignProporties, getTextBox, getSelect, } = require("../../Common");

//marriageManage/marriageMakePairRecordList 1500-1599
const dataActionTypes = {
    //搜索查询
    searchQuery: 1500
};

const { name, primaryKey, viewName } = marriageMakePair;
const entity = { name, primaryKey, viewName };

module.exports = {
    name: "marriageMakePairList",
    type: "View",
    eventActions: getEventActions(),
    properties: assignProporties({ name: "marriageMakePairList" }, [getSearchOperationView(), getDataGridView()])
}

function getSearchOperationView() {
    return {
        name: "searchOperationView1",
        entity: entity,
        type: "RowsColsView",
        className: "divSerachView",
        properties: assignProporties({ name: "marriageMakePairList" }, [
            getEditSelect("UserSex", "性别", marriageMakePair.sexDataSource, 1, 1),
            {
                ...getTextBox2("keyword", "关键字", 1, 2, "", "姓名/手机号码"), propertyName: "UserName,OtherSideUserName",
                operateLogic: "like", pressEnterEventActionName: "searchQuery", pressEnterEventPropertyName: "search",
            },
            { ...getButton("search", "搜索", "primary", 1, 3), isFormItem: true, icon: "search", eventActionName: "searchQuery", pressEnterEventActionName: "searchQuery" },
            { ...getButton("clearQuery", "清空", "default", 1, 4), isFormItem: true, eventActionName: "clearQuery" }
        ])
    }
}

function getEditSelect(name, label, dataSource, x, y, defaultValue) {
    return {
        ...getSelect(name, label, dataSource, x, y, defaultValue),
        isFormItem: true,
        colSpan: 6,
        labelCol: 8,
        wrapperCol: 16,
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
        wrapperCol: 16,
        isNullable: true,
        isCondition: true
    }
}

function getDataGridView() {
    return {
        name: "dataGridView1",
        entity,
        type: "DataGridView",
        entitySearchQuery: dataActionTypes.searchQuery,
        eventActionName: "searchQuery",
        isDiv: true,
        className: "divInfoView3",
        properties: assignProporties(marriageMakePair, ["UserName", "UserSexName", "OtherSideUserName", "PercentValue",
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