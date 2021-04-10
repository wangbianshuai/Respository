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
    properties: [getTopView(),getDataGridView()]
}


function getTopView(){
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
            dataGridView: "dataGridView1"
        }]
}

function getSearchView() {
    return {
        name: 'searchView1',
        type: 'View',
        isDiv: true,
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

function getDataGridView() {
    return {
        name: 'dataGridView1',
        type: "DataGridView",
        properties: [],
        entity,
        isShowRecord: false,
        entitySearchQuery: dataActionTypes.searchQuery,
        eventActionName: 'searchQuery',
        detailPageUrl: '/accountBillEdit.html',
        actionName: 'searchQuery',
        className: "divDataGridView",
        itemType: 'AccountBillItem',
        headerItemType: 'DataInfoHeader'
    }
}