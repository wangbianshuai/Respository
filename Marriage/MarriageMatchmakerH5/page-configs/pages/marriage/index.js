//marriage/index 1300-1399
const dataActionTypes = {
    //待相亲
    searchQuery: 1300,
    //有意向
    searchLike: 1301,
    //牵手成功
    searchMarriage: 1302,
    //无意向
    searchDislike: 1303
};

const entity = { name: 'MarriageArrange', primaryKey: 'MarriageArrangeId' };

module.exports = {
    name: "index",
    type: "View",
    eventActions: getEventActions(),
    properties: [getTabs()]
}

function getTabs() {
    return {
        name: 'marriageTabs1',
        type: 'Tabs',
        properties: [
            getTabView('userDataGridView1', '待相亲', 0, 'searchQuery', dataActionTypes.searchQuery, {
                Type: 0
            }),
            getTabView('likeDataGridView1', '有意向', 1, 'searchLike', dataActionTypes.searchLike, {
                Type: 1,
            }),
            getTabView('marriageDataGridView1', '牵手成功', 2, 'searchMarriage', dataActionTypes.searchMarriage, {
                Type: 2,
            }),
            getTabView('dislikeDataGridView1', '无意向', 3, 'searchDislike', dataActionTypes.searchDislike, {
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
            name: "searchLike",
            type: "dataGridView/searchQuery",
            dataGridView: "likeDataGridView1"
        },
        {
            name: "searchMarriage",
            type: "dataGridView/searchQuery",
            dataGridView: "marriageDataGridView1"
        },
        {
            name: "searchDislike",
            type: "dataGridView/searchQuery",
            dataGridView: "dislikeDataGridView1"
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
        detailPageUrl: '/marriage/detail?tabPage=' + tabPage,
        actionName: eventActionName,
        className: "divDataGridView",
        itemType: 'MarriageArrangeItem'
    }
}