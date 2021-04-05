const accountCategory = require("../../entities/accountCategory");
const { getButton, assignProporties, getSelect, getTextBox } = require("../../Common");

//accountManage/accountCategory 1000-1099
const dataActionTypes = {
    //搜索查询
    searchQuery: 1000,
    //删除实体数据
    deleteEntityData: 1001,
    //Excel导出
    excelExport: 1002
};

const { name, primaryKey, viewName } = accountCategory;
const entity = { name, primaryKey, viewName };

module.exports = {
    name: "accountCategoryList",
    type: "View",
    noRightNames: ['toEditPage', 'editEntityData', 'deleteEntityData'],
    eventActions: getEventActions(),
    properties: assignProporties({ name: "accountCategoryList" }, [getSearchOperationView(), getDataGridView()])
}

function getSearchOperationView() {
    return {
        name: "searchOperationView1",
        entity: entity,
        type: "RowsColsView",
        className: "divSerachView",
        properties: assignProporties({ name: "accountCategoryList" }, [
            getEditSelect("IncomeOutlay", "收支", accountCategory.incomeOutlayDataSource, 1, 1),
            {
                ...getTextBox2("keyword", "关键字", 1, 2, "", "名称,备注"), propertyName: "Name,Remark",
                operateLogic: "like", pressEnterEventActionName: "searchQuery", pressEnterEventPropertyName: "search",
            },
            { ...getButton("search", "搜索", "primary", 1, 4), isFormItem: true, icon: "search", eventActionName: "searchQuery", pressEnterEventActionName: "searchQuery" },
            { ...getButton("clearQuery", "清空", "default", 1, 5), isFormItem: true, eventActionName: "clearQuery" },
            { ...{ eventActionName: "toEditPage", ...getButton("toEditPage", "新增", "primary", 2, 1) }, style: { marginLeft: 16, marginBottom: 16 } },
            { eventActionName: "editEntityData", colStyle: { paddingLeft: 0 }, ...getButton("editEntityData", "修改", "default", 2, 2) },
            {
                eventActionName: "deleteEntityData",
                colStyle: { paddingLeft: 0 },
                dataActionType: dataActionTypes.deleteEntityData,
                successTip: "删除成功！",
                confirmTip: "请确认是否删除当前类别？",
                ...getButton("deleteEntityData", "删除", "default", 2, 4)
            }
        ])
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
        eventActionName: "searchQuery",
        isDiv: true,
        className: "divInfoView3",
        isRowSelection: true,
        isSingleSelection: true,
        properties: assignProporties(accountCategory, ["Name", "IncomeOutlayName", "Remark", { name: "CreateDate", orderByType: "desc" }, { name: "RowVersion", isVisible: false }])
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
        name: "clearQuery",
        type: "dataGridView/searchQuery",
        searchView: "searchOperationView1",
        searchButton: "clearQuery",
        dataGridView: "dataGridView1",
        isClearQuery: true
    },
    {
        name: "toEditPage",
        type: "page/toPage",
        pageUrl: "/accountManage/accountCategoryEdit"
    },
    {
        name: "editEntityData",
        type: "dataGridView/selectRowToPage",
        dataGridView: "dataGridView1",
        alertMessage: "alertMessage",
        pageUrl: "/accountManage/accountCategoryEdit?CategoryId=#{CategoryId}&menuName=" + encodeURIComponent("修改")
    },
    {
        name: "deleteEntityData",
        type: "dataGrid/batchUpdateRowDataList",
        dataGridView: "dataGridView1",
        alertMessage: "alertMessage"
    }]
}
