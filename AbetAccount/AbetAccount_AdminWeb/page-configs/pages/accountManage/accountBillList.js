const accountBill = require("../../entities/accountBill");
const { getButton, assignProporties, getTextBox, getDatePicker, getSelect, getSelect2, createGuid } = require("../../Common");

//accountManage/accountBillList 1200-1299
const dataActionTypes = {
    //搜索查询
    searchQuery: 1200,
    //删除实体数据
    deleteEntityData: 1201,
    //Excel导出
    excelExport: 1202,
    //Excel导入
    exportImport: 1203
};

const { name, primaryKey, viewName } = accountBill;
const entity = { name, primaryKey, viewName, isGroupByInfo: true };

module.exports = {
    name: "accountBillList",
    type: "View",
    noRightNames: ['toEditPage', 'excelImport'],
    eventActions: getEventActions(),
    dialogViews: getDialogViews(),
    properties: assignProporties({ name: "accountBillList" }, [getSearchOperationView(), getDataGridView()])
}

function getSearchOperationView() {
    return {
        name: "searchOperationView1",
        entity: entity,
        type: "RowsColsView",
        className: "divSerachView",
        properties: assignProporties({ name: "accountBillList" }, [
            { ...getEditSelect("IncomeOutlay", "收支", accountBill.incomeOutlayDataSource, 1, 1) },
            { ...getEditSelect2("AccountItemId", "账目名称", accountBill.accountItemsDataSource, 1, 2), childNames: ['AccountCategoryId'] },
            {
                ...getEditSelect2("AccountCategoryId", "类别", accountBill.accountCategorysDataSource, 1, 3),
                parentName: 'AccountItemId', parentPropertyName: 'AccountItemId'
            },
            { ...getDatePicker2("StartDate", "开始日期", 2, 1, "大于或等于其值"), isMonthFirst: true, propertyName: "BillDate", operateLogic: ">=" },
            { ...getDatePicker2("EndDate", "至", 2, 2, "小于其值"), isCurrentDay: true, propertyName: "BillDate", operateLogic: "<" },
            getEditSelect2("BillUser", "经手人", accountBill.usersDataSource, 2, 3),
            getEditSelect("AccountType", "账户", accountBill.accountTypeDataSource, 3, 1),
            {
                ...getTextBox2("keyword", "关键字", 3, 2, "", "备注"), propertyName: "Remark",
                operateLogic: "like", pressEnterEventActionName: "searchQuery", pressEnterEventPropertyName: "search",
            },
            { ...getButton("search", "搜索", "primary", 3, 3), isFormItem: true, icon: "search", eventActionName: "searchQuery", pressEnterEventActionName: "searchQuery" },
            { ...getButton("clearQuery", "清空", "default", 3, 4), isFormItem: true, eventActionName: "clearQuery" },
            { eventActionName: "toEditPage", ...getButton("toEditPage", "新增", "primary", 4, 1), style: { marginLeft: 16, marginBottom: 16 } },
            { eventActionName: "excelImport", ...getButton("excelImport", "Excel导入", "", 4, 2), icon: 'import' }
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
        entityExcelExport: dataActionTypes.excelExport,
        eventActionName: "searchQuery",
        isDiv: true,
        className: "divInfoView3",
        groupByInfoHtml: getGroupByInfoHtml(),
        properties: assignProporties(accountBill, [{ name: "BillDate", orderByType: "desc" }, "AccountItemName", "AccountCategoryName", "IncomeOutlayName", getAmount('Amount2'), "Remark", "AccountTypeName", "BillUserName",
        { name: "CreateUser", isVisible: false }, getOperation(), { name: "RowVersion", isVisible: false }])
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
        isFixed2: true, isCurrency: true, fontColor: "#1890ff"
    }
}

function getOperation() {
    return {
        name: "operation",
        label: "操作",
        isData: false,
        selfPropertyName: 'CreateUser',
        actionList: assignProporties(accountBill, [getUpdateAppAccountBillAction(), getDeleteAppAccountBillAction()])
    }
}

function getDeleteAppAccountBillAction() {
    return {
        name: "deleteAppAccount",
        label: '删除',
        type: "AButton",
        isSelfOperation: true,
        dataActionType: dataActionTypes.deleteEntityData,
        successTip: "删除成功！",
        confirmTip: "请确认是否删除当前记账记录？",
        eventActionName: "deleteAppAccount"
    }
}

function getUpdateAppAccountBillAction() {
    return {
        name: "editAppAccount",
        label: '修改',
        type: "AButton",
        isSelfOperation: true,
        eventActionName: "editAppAccount"
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
        name: "toEditPage",
        type: "page/toPage",
        pageUrl: "/accountManage/accountBillEdit"
    },
    {
        name: "editAppAccount",
        type: "dataGridView/selectRowToPage",
        dataGridView: "dataGridView1",
        pageUrl: "/accountManage/accountBillEdit?BillId=#{BillId}&menuName=" + encodeURIComponent("修改")
    },
    {
        name: "excelImport",
        type: "dialog/excelImport",
        dataGridView: "dataGridView1",
        dialogView: "excelImportView",
    },
    {
        name: "deleteAppAccount",
        type: "dataGrid/batchUpdateRowDataList",
        dataGridView: "dataGridView1"
    }]
}

function getDialogViews() {
    return [
        getExcelImportView()
    ]
}

function getExcelImportView() {
    return {
        id: createGuid(),
        dialogId: createGuid(),
        name: "excelImportView",
        entity,
        type: "RowsColsView",
        dialogTitle: "Excel导入",
        dialogWidth: 560,
        successTip: "导入成功",
        className: "divView2",
        isClear: true,
        setSelectValuesOkActionType: dataActionTypes.exportImport,
        dialogStyle: { height: 80, overflow: "auto" },
        properties: assignProporties(entity, [
            {
                name: 'excelFile',
                type: 'File',
                accept: ".xlsx",
                label: 'Excel',
                isFormItem: true,
                colSpan: 22,
                labelCol: 4,
                wrapperCol: 20,
                isEdit: true,
            }
        ])
    }
}