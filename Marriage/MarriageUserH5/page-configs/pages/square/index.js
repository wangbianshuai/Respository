//square/index 1000-1099
const dataActionTypes = {
    //相亲广场
    searchQuery: 1000,
    //赠送玫瑰
    searchSend: 1001,
    //收到玫瑰
    searchReceive: 1002,
    //互赠玫瑰
    searchMutual: 1003,
};

const entity = { name: 'MarriageUser', primaryKey: 'UserId' };

module.exports = {
    name: "index",
    type: "View",
    eventActions: getEventActions(),
    properties: [getTabs()]
}

function getTabs() {
    return {
        name: 'tabs1',
        type: 'Tabs',
        properties: [
            getTabView('userDataGridView1', '相亲广场', 0, 'searchQuery', dataActionTypes.searchQuery, {
                Type: 0
            }),
            getTabView('sendDataGridView1', '赠送玫瑰', 1, 'searchSend', dataActionTypes.searchSend, {
                Type: 1,
            }),
            getTabView('receiveDataGridView1', '收到玫瑰', 2, 'searchReceive', dataActionTypes.searchReceive, {
                Type: 2,
            }),
            getTabView('MutualDataGridView1', '互赠玫瑰', 3, 'searchMutual', dataActionTypes.searchMutual, {
                Type: 3,
            })
        ]
    }
}

function getEventActions() {
    return [
        {
            name: "searchQuery",
            type: "dataGridView/searchQuery",
            dataGridView: "userDataGridView1"
        },
        {
            name: "searchSend",
            type: "dataGridView/searchQuery",
            dataGridView: "sendDataGridView1"
        },
        {
            name: "searchReceive",
            type: "dataGridView/searchQuery",
            dataGridView: "receiveDataGridView1"
        },
        {
            name: "searchMutual",
            type: "dataGridView/searchQuery",
            dataGridView: "MutualDataGridView1"
        }]
}

function getTabView(name, tabLabel, tabPage, eventActionName, entitySearchQuery, conditions) {
    return {
        name,
        tabLabel,
        type: "DataGridView",
        properties: [],
        entity,
        conditions,
        entitySearchQuery,
        eventActionName,
        detailPageUrl: '/user/index?tabPage=' + tabPage,
        actionName: eventActionName,
        className: "divDataGridView",
        itemType: 'MarriageUserItem'
    }
}