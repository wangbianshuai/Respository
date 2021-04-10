//accountBillList 200-299
const dataActionTypes = {
    //搜索查询
    searchQuery: 200
};

const entity = { name: 'AccountBill', viewName: 'ViewAccountBill', primaryKey: 'BillId', isGroupByInfo: true };

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
            searchView: "searchView1",
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
        label: '关键字',
        propertyName: 'Remark',
        placeHolder: '摘要',
        cancelText: '筛选',
        operateLogic: "like",
        eventActionName: 'searchQuery',
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
