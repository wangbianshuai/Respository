const { getButton, getTextBox, getSelect } = require("../Common");
const accountCategory = require("../entities/accountCategory");

//accountCategoryList 600-699
const dataActionTypes = {
    //搜索查询
    searchQuery: 600
};

const { name, primaryKey, viewName } = accountCategory;
const entity = { name, primaryKey, viewName};

module.exports = {
    name: "index",
    type: "View",
    noRightNames: ['add'],
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
        tabs: [{ title: '收支类型', url: "/accountCategoryList.html?tabPage=0" },
        { title: '实体项目', url: "/accountItemList.html?tabPage=1" }]
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
            pageUrl: "/accountCategoryEdit.html"
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
        propertyName: 'Name,Remark',
        placeHolder: '名称,备注',
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
        properties: assignProporties(
            ["Name", "IncomeOutlayName", "Remark", { name: "CreateDate", orderByType: "desc" }, { name: "RowVersion", isVisible: false }]
        ),
        entity,
        isShowRecord: false,
        entitySearchQuery: dataActionTypes.searchQuery,
        eventActionName: 'searchQuery',
        detailPageUrl: '/accountCategoryEdit.html',
        actionName: 'searchQuery',
        className: "divDataGridView",
        itemType: 'AccountCategoryItem',
        headerItemType: 'DataInfoHeader'
    }
}

function assignProporties(properties) {
    const list = [];
    properties.forEach(p => {
        if (typeof p === 'string') return list.push({ name: p })
        else list.push(p)
    })
    return list;
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
                text: '收支类别筛选条件',
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
            getEditSelect("IncomeOutlay", "收支", accountCategory.incomeOutlayDataSource, 1, 2),
            {
                ...getTextBox2("keyword2", "关键字", 3, 2, "", "名称,备注"), propertyName: "Name,Remark",
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

function getTextBox2(name, label, x, y, contorlType, placeHolder, maxLength) {
    return {
        ...getTextBox(name, label, contorlType, x, y, placeHolder, maxLength || 50),
        isNullable: true,
        isCondition: true
    }
}