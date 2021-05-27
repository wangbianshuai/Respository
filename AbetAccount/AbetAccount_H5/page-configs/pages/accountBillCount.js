const { getButton, assignProporties, getTextBox, getDatePicker, getSelect, getSelect2 } = require("../Common");
const accountBill = require("../entities/accountBill");

//accountBillCount 500-599
const dataActionTypes = {
    //搜索查询
    searchQuery: 500
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
        initialPage: 1,
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
            name: "setShowColumns",
            type: "dataGridView/setDataGridShowColumns",
            dataGridView: "dataGridView1"
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
        properties: [getSearchBar()]
    }
}

function getSearchBar() {
    return {
        name: 'keyword',
        type: 'SearchBar',
        label: '关键字',
        propertyName: 'AccountItemName',
        placeHolder: '账目名称',
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
        properties: assignProporties(accountBill,
            [
                { name: "DisplayIndex", orderByType: "asc", isColumnVisible: false },
                "AccountItemName", getAmount('Amount2')]
        ),
        entity,
        isShowRecord: false,
        isShowColumn: true,
        isGroupByQuery: true,
        entitySearchQuery: dataActionTypes.searchQuery,
        eventActionName: 'searchQuery',
        detailPageUrl: '/accountBillEdit.html',
        actionName: 'searchQuery',
        className: "divDataGridView",
        itemType: 'AccountBillCountItem',
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
    html.push("<span>收支结余：<span style=\"color:{TotalBalanceColor};\">{TotalBalance}</span></span>");
    html.push('</div>')

    return html.join("");
}

function getAmount(name) {
    return {
        name,
        groupByExpression: `sum(${name})`,
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
                text: '记账统计筛选条件',
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
            { ...getEditSelect2("BillYear", "年份", accountBill.billYearDataSource, 1, 1), childNames: ['BillQuarter', 'BillMonth'] },
            {
                ...getEditSelect2("BillQuarter", "季度", accountBill.billQuarterDataSource, 1, 2),
                parentName: 'BillYear', parentPropertyName: 'BillYear'
            },
            {
                ...getEditSelect2("BillMonth", "月份", accountBill.billMonthDataSource, 1, 3),
                parentName: 'BillYear', parentPropertyName: 'BillYear'
            },
            {
                ...getTextBox2("keyword2", "关键字", 3, 2, "", "账目名称"), propertyName: "AccountItemName",
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

function getEditSelect2(name, label, dataSource, x, y, defaultValue) {
    return {
        ...getSelect2(name, label, dataSource, x, y, defaultValue),
        operateLogic: "=",
        isNullable: true,
        allowClear: true,
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