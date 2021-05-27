const accountBill = require("../../entities/accountBill");
const { getButton, assignProporties, getTextBox, getDatePicker, getSelect, getSelect2 } = require("../../Common");

//accountManage/accountBillCount 1400-1499
const dataActionTypes = {
    //搜索查询
    searchQuery: 1400,
    //删除实体数据
    deleteEntityData: 1401,
    //Excel导出
    excelExport: 1402
};

const { name, primaryKey, viewName } = accountBill;
const entity = { name, primaryKey, viewName, isGroupByInfo: true };

module.exports = {
    name: "accountBillList",
    type: "View",
    isDialogViews: true,
    eventActions: getEventActions(),
    properties: assignProporties({ name: "accountBillList" }, [getSearchOperationView(), getDataGridView()])
}

function getSearchOperationView() {
    return {
        name: "searchOperationView1",
        entity: entity,
        type: "RowsColsView",
        className: "divSerachView",
        properties: assignProporties({ name: "accountBillList" }, [
            { ...getEditSelect2("BillYear", "年份", accountBill.billYearDataSource, 1, 1), childNames: ['BillQuarter', 'BillMonth'] },
            {
                ...getEditSelect2("BillQuarter", "季度", accountBill.billQuarterDataSource, 1, 2),
                parentName: 'BillYear', parentPropertyName: 'BillYear'
            },
            {
                ...getEditSelect2("BillMonth", "月份", accountBill.billMonthDataSource, 1, 3),
                parentName: 'BillYear', parentPropertyName: 'BillYear'
            },
            { ...getButton("search", "搜索", "primary", 1, 4), isFormItem: true, icon: "search", eventActionName: "searchQuery", pressEnterEventActionName: "searchQuery" },
            { ...getButton("clearQuery", "清空", "default", 1, 5), isFormItem: true, eventActionName: "clearQuery" },
        ])
    }
}

function getEditSelect2(name, label, dataSource, x, y, defaultValue) {
    return {
        ...getSelect2(name, label, dataSource, x, y, defaultValue),
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
        isPartPaging: true,
        isGroupByQuery: true,
        groupByInfoHtml: getGroupByInfoHtml(),
        properties: assignProporties(accountBill, [
            { name: "DisplayIndex", orderByType: "asc", isColumnVisible: false },
            "AccountItemName", getAmount('Amount2')])
    }
}

function getGroupByInfoHtml() {
    var html = [];

    html.push("收入：<span style=\"color:#1890ff;\">{TotalIncome}</span>，");
    html.push("支出：<span style=\"color:red;\">{TotalOutlay}</span>，");
    html.push("结余：<span style=\"color:{TotalBalanceColor};\">{TotalBalance}</span>");

    return html.join("");
}

function getAmount(name) {
    return {
        name,
        groupByExpression: `sum(${name})`,
        isFixed2: true, isCurrency: true, fontColor: "#1890ff"
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
        name: "setShowColumns",
        type: "dataGrid/setDataGridShowColumns",
        dataGridView: "dataGridView1"
    }]
}
