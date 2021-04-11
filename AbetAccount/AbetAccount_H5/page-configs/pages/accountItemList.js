const accountItem = require("../entities/accountItem");

//accountItemList 800-899
const dataActionTypes = {
    //搜索查询
    searchQuery: 800
};

const { name, primaryKey, viewName } = accountItem;
const entity = { name, primaryKey, viewName };

module.exports = {
    name: "index",
    type: "View",
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
            name: "toEditPage",
            type: "page/toPage",
            pageUrl: "/accountItemEdit.html"
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
        operateLogic: "like",
        eventActionName: 'searchQuery',
        isCondition: true,
        className: 'divSearchBar'
    }
}

function getDataGridView() {
    return {
        name: 'dataGridView1',
        type: "DataGridView",
        properties: assignProporties(
            ["Name", "Remark", { name: "CreateDate", orderByType: "desc" }, { name: "RowVersion", isVisible: false }]
        ),
        entity,
        isShowRecord: false,
        entitySearchQuery: dataActionTypes.searchQuery,
        eventActionName: 'searchQuery',
        detailPageUrl: '/accountItemEdit.html',
        actionName: 'searchQuery',
        className: "divDataGridView",
        itemType: 'AccountItemItem',
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