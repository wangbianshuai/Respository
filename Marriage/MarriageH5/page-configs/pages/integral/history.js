const { getSpanText } = require('../../common');

//integral/history 2300-2399
const dataActionTypes = {
    //搜索查询 全部
    searchQuery: 2300,
    //搜索关键字
    searchHistory: 2301
};

const entity = { name: 'Integral', primaryKey: 'UID' };

module.exports = {
    name: "history",
    type: "View",
    isDiv: true,
    className: 'divView3',
    eventActions: getEventActions(),
    properties: [getTitle(), getDataGridView('integralDataGridView1', 'searchHistory', dataActionTypes.searchHistory, {
        Param: { PointsHistoryIndex: "DateTimeDesc" },
        Act: 'Points_GetPointsHistoryList'
    })]
}

function getTitle() {
    return { ...getSpanText('title', 'divTopTitle'), text: '积分历史', isBottomLine: true }
}

function getEventActions() {
    return [
        {
            name: "searchHistory",
            type: "dataGridView/searchQuery",
            dataGridView: "integralDataGridView1"
        }]
}

function getDataGridView(name, eventActionName, entitySearchQuery, formData) {
    return {
        name,
        type: "DataGridView",
        properties: [],
        entity,
        formData,
        entitySearchQuery,
        eventActionName,
        headerItemType: 'IntegralHistoryHeaderItem',
        actionName: eventActionName,
        className: "divDataGridView2",
        itemType: 'IntegralHistoryItem'
    }
}