const marriageMakePair = require("../../entities/marriageMakePair");
const { getButton, assignProporties, getTextBox, getSelect, createGuid } = require("../../Common");

//marriageManage/marriageMakePairRecordList 1500-1599
const dataActionTypes = {
    //搜索查询
    searchQuery: 1500,
    //删除实体数据
    deleteEntityData: 1501,
    //Excel导出
    excelExport: 1502,
    //获取实体数据
    getMarriageMakePairsDetails: 1503
};

const { name, primaryKey, viewName } = marriageMakePair;
const entity = { name, primaryKey, viewName };

const detailItem = { name: "MarriageMakePairDetail", primaryKey: 'DetailId' }

module.exports = {
    name: "marriageMakePairList",
    type: "View",
    dialogViews: getDialogViews(),
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
        properties: assignProporties(marriageMakePair, ["UserName", "UserSexName", "OtherSideUserName", getPercentValue(),
            { name: "CreateDate", OrderByType: "desc" }])
    }
}

function getPercentValue() {
    return {
        name: "PercentValue",
        label: "匹配度(%)",
        action: {
            name: "lookMakePairDetail",
            eventActionName: "lookMakePairDetail",
            type: "AButton"
        }

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
    },
    {
        name: "lookMakePairDetail",
        type: "dialog/showDialogLookData",
        dialogView: "lookMakePairDetailView",
        lookView: "lookMakePairDetailView"
    },
    {
        name: "getMarriageMakePairsDetails",
        type: "entityEdit/getEntityData",
        editView: "lookMakePairDetailView"
    }]
}

function getDialogViews() {
    return [
        getLookMakePairDetailView()
    ]
}

function getLookMakePairDetailView() {
    return {
        id: createGuid(),
        dialogId: createGuid(),
        name: "lookMakePairDetailView",
        entity,
        type: "View",
        dialogTitle: "#{UserName}与#{OtherSideUserName}匹配详情",
        dialogWidth: 1060,
        eventActionName: "getMarriageMakePairsDetails",
        getEntityDataActionType: dataActionTypes.getMarriageMakePairsDetails,
        dialogStyle: { height: 520, overflow: "auto" },
        properties: assignProporties(marriageMakePair, [
            getComplexView()
        ])
    }
}

function getComplexView() {
    return {
        name: "Details",
        type: "DataGridView",
        x: 1,
        y: 1,
        isComplexEntity: true,
        isPaging: false,
        entity: detailItem,
        isDiv: true,
        className: "divInfoView3",
        properties: assignProporties(detailItem, [{ name: 'ConditionTypeName', label: '类型' },
        { name: 'ConditionItemTitle', label: '标题' },
        { name: 'SelfSelectValue', label: '择偶标准选择值' },
        { name: 'OtherSideSelectValue', label: '对方条件选择值' },
        { name: 'PercentValueName', label: '匹配度(%)' }
        ])
    }
}