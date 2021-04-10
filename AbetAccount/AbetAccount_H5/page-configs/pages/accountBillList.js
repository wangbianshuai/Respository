//accountBillList 200-299
const dataActionTypes = {
    //搜索查询
    searchQuery: 200
};

const entity = { name: 'AccountBill', viewName: 'ViewAccountBill', primaryKey: 'BillId' };

module.exports = {
    name: "index",
    type: "View",
    eventActions: getEventActions(),
    properties: [getTabs(), getSearchView()]
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
            dataGridView: "billDataGridView1"
        }]
}

function getSearchView() {
    return {
        name: 'searchView1',
        type: 'View',
        isDiv: true,
        className: 'divSearchView',
        properties: [getSearchBar()]
    }
}

function getSearchBar() {
    return {
        name: 'keyword',
        type: 'SearchBar',
        propertyNames: ['Remark'],
        placeHolder: '摘要',
        cancelText: '筛选',
        showCancelButton: true,
        isCondition: true
    }
}

function getDataGridView(name, eventActionName, entitySearchQuery, conditions) {
    return {
        name,
        type: "DataGridView",
        properties: [],
        entity,
        conditions,
        entitySearchQuery,
        eventActionName,
        detailPageUrl: '/accountBillEdit',
        actionName: eventActionName,
        className: "divDataGridView",
        itemType: 'AccountBillItem'
    }
}