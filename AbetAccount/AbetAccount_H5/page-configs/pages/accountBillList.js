const { getButton, getTextBox, getDatePicker, getSelect, getSelect2 } = require("../Common");
const accountBill = require("../entities/accountBill");

//accountBillList 200-299
const dataActionTypes = {
    //搜索查询
    searchQuery: 200
};

const { name, primaryKey, viewName } = accountBill;
const entity = { name, primaryKey, viewName, isGroupByInfo: true };

module.exports = {
    name: "index",
    type: "View",
    dialogViews: getDialogViews(),
    eventActions: getEventActions(),
    properties: [getTopView(), getDataGridView()]
}


function getTopView() {
    return {
        name: 'topView1',
        type: 'View',
        isDiv: true,
        className: 'divTopView',
        properties: [getTabs(), getSearchView()]
    }
}

function getTabs() {
    return {
        name: 'tabs1',
        type: 'Tabs',
        isDiv: true,
        className: 'tabDetail',
        tabs: [{ title: '记账', url: "/accountBillList.html?tabPage=0" },
        { title: '记账统计', url: "/accountBillCount.html?tabPage=1" }]
    }
}

function getEventActions() {
    return [
        {
            name: "searchQuery",
            type: "dataGridView/searchQuery",
            dataGridView: "dataGridView1",
            searchView: "searchView1"
        },
        {
            name: "searchQuery2",
            type: "dataGridView/searchQuery",
            dataGridView: "dataGridView1",
            searchButton: "search",
            searchView: "searchConditionView1",
            dialogView: "searchView2",
        },
        {
            name: "clearQuery",
            type: "dataGridView/searchQuery",
            searchView: "searchConditionView1",
            searchButton: "clearQuery",
            dataGridView: "dataGridView1",
            isClearQuery: true,
            dialogView: "searchView2"
        },
        {
            name: "searchCondition",
            type: "dialog/showDialogSearchData",
            dialogView: "searchView2"
        },
        {
            name: "toEditPage",
            type: "page/toPage",
            pageUrl: "/accountBillEdit.html"
        },
        {
            name: "closeConditionDialog",
            type: "dialog/closeDialogSearchData",
            dialogView: "searchView2",
        }]
}

function getSearchView() {
    return {
        name: 'searchView1',
        type: 'View',
        isDiv: true,
        isKeywordView: true,
        keywordName: 'keyword2',
        className: 'divSearchBarView',
        properties: [getSearchBar(), getAdd()]
    }
}

function getAdd() {
    return {
        name: 'add',
        type: 'ImageButton',
        imageName: 'add.png',
        className: 'divAddButton',
        eventActionName: 'toEditPage'
    }
}

function getSearchBar() {
    return {
        name: 'keyword',
        type: 'SearchBar',
        label: '关键字',
        propertyName: 'Remark',
        placeHolder: '摘要',
        cancelText: '筛选',
        operateLogic: "like",
        eventActionName: 'searchQuery',
        cancelEventActionName: 'searchCondition',
        showCancelButton: true,
        isCondition: true
    }
}

function getDataGridView() {
    return {
        name: 'dataGridView1',
        type: "DataGridView",
        properties: assignProporties([{ name: "BillDate", orderByType: "desc" }, "AccountItemName", "AccountCategoryName", "IncomeOutlayName", getAmount('Amount2'), getAmount('Tax2'), "Remark", "AccountTypeName", "BillUserName",
        { name: "CreateDate", orderByType: "desc" }, { name: "CreateUser", isVisible: false }, { name: "RowVersion", isVisible: false }]),
        entity,
        isShowRecord: false,
        entitySearchQuery: dataActionTypes.searchQuery,
        eventActionName: 'searchQuery',
        detailPageUrl: '/accountBillEdit.html',
        actionName: 'searchQuery',
        className: "divDataGridView",
        itemType: 'AccountBillItem',
        headerItemType: 'DataInfoHeader',
        groupByInfoHtml: getGroupByInfoHtml(),
    }
}

function getGroupByInfoHtml() {
    var html = [];

    html.push('<div>')
    html.push("<span>收入：<span style=\"color:#1890ff;\">{TotalIncome}</span></span>");
    html.push("<span>支出：<span style=\"color:red;\">{TotalOutlay}</span></span>");
    html.push('</div>')

    html.push('<div>')
    html.push("<span>收入税额：<span style=\"color:#1890ff;\">{TotalIncomeTax}</span></span>");
    html.push("<span>开出税额：<span style=\"color:red;\">{TotalOutlayTax}</span></span>");
    html.push('</div>')

    html.push('<div>')
    html.push("<span>收支结余：<span style=\"color:{TotalBalanceColor};\">{TotalBalance}</span></span>");
    html.push("<span>结余税额：<span style=\"color:{TotalBalanceTaxColor};\">{TotalBalanceTax}</span></span>");
    html.push('</div>')

    return html.join("");
}

function assignProporties(properties) {
    const list = [];
    properties.forEach(p => {
        if (typeof p === 'string') return list.push({ name: p })
        else list.push(p)
    })
    return list;
}

function getAmount(name) {
    return {
        name,
        isFixed2: true, isCurrency: true, fontColor: "#1890ff"
    }
}

function getDialogViews() {
    return [getSearchOperationView()]
}

function getSearchOperationView() {
    return {
        name: "searchView2",
        entity: entity,
        type: "View",
        isViewType: true,
        isVisibleType: true,
        className: "divSearchView",
        properties: [
            {
                name: 'navTitle',
                type: 'NavBar',
                text: '记账筛选条件',
                mode: 'light',
                rightProperty: {
                    name: 'close',
                    type: 'ImageButton',
                    imageName: 'close.png',
                    className: 'divCloseButton',
                    eventActionName: 'closeConditionDialog'
                }
            },
            getSearchConditionView(),
            getButtonView()
        ]
    }
}

function getSearchConditionView() {
    return {
        name: "searchConditionView1",
        entity: entity,
        type: "View",
        isList: true,
        isViewType: true,
        keywordName: 'keyword',
        className: "divSearchConditionView",
        properties: [
            getEditSelect2("AccountItemId", "实体项目", accountBill.accountItemsDataSource, 1, 1),
            { ...getEditSelect("IncomeOutlay", "收支", accountBill.incomeOutlayDataSource, 1, 2), childNames: ['AccountCategoryId'] },
            {
                ...getEditSelect2("AccountCategoryId", "类别", accountBill.accountCategorysDataSource, 1, 3),
                parentName: 'IncomeOutlay', parentPropertyName: 'IncomeOutlay'
            },
            { ...getDatePicker2("StartDate", "开始日期", 2, 1, "大于或等于其值"), isMonthFirst: true, propertyName: "BillDate", operateLogic: ">=" },
            { ...getDatePicker2("EndDate", "结束日期", 2, 2, "小于其值"), isCurrentDay: true, propertyName: "BillDate", operateLogic: "<" },
            getEditSelect2("BillUser", "经手人", accountBill.usersDataSource, 2, 3),
            getEditSelect("AccountType", "账户", accountBill.accountTypeDataSource, 3, 1),
            {
                ...getTextBox2("keyword2", "关键字", 3, 2, "", "摘要"), propertyName: "Remark",
                operateLogic: "like", pressEnterEventActionName: "searchQuery", pressEnterEventPropertyName: "search",
            }
        ]
    }
}

function getButtonView() {
    return {
        name: 'searchButtonView',
        type: 'View',
        isDiv: true,
        className: 'divSearchButtonView',
        properties: [
            { ...getButton("search", "搜索", "primary", 3, 3), icon: "search", eventActionName: "searchQuery2", pressEnterEventActionName: "searchQuery2" },
            { ...getButton("clearQuery", "清空", "default", 3, 4), eventActionName: "clearQuery" }

        ]
    }
}

function getEditSelect(name, label, dataSource, x, y, defaultValue) {
    return {
        ...getSelect(name, label, dataSource, x, y, defaultValue),
        operateLogic: "=",
        isNullable: true,
        allowClear: true,
        isCondition: true
    }
}


function getEditSelect2(name, label, dataSource, x, y, defaultValue) {
    return {
        ...getSelect2(name, label, dataSource, x, y, defaultValue),
        operateLogic: "=",
        isNullable: true,
        allowClear: true,
        isCondition: true
    }
}

function getDatePicker2(name, label, x, y, placeHolder, defaultValue) {
    return {
        ...getDatePicker(name, label, x, y, defaultValue),
        isNullable: true,
        placeHolder: placeHolder,
        maxLength: 20,
        dataType: "DateTime",
        isCondition: true
    }
}

function getTextBox2(name, label, x, y, contorlType, placeHolder, maxLength) {
    return {
        ...getTextBox(name, label, contorlType, x, y, placeHolder, maxLength || 50),
        isNullable: true,
        isCondition: true
    }
}