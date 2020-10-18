//library/search 1700-1799
const dataActionTypes = {
  //搜索查询 全部
  searchQuery: 1700,
  //搜索关键字
  searchKeyword: 1701
};

const entity = { name: 'Library', primaryKey: 'UID' };

module.exports = {
  name: "search",
  type: "View",
  eventActions: getEventActions(),
  properties: [getDataGridView('libraryDataGridView1', 'searchKeyword', dataActionTypes.searchKeyword, {
    Param: { LibraryIndex: "ClicksDesc", "SetTopIndex": true },
    Act: 'Library_GetList'
  })]
}

function getEventActions() {
  return [
    {
      name: "searchKeyword",
      type: "dataGridView/searchQuery",
      dataGridView: "libraryDataGridView1"
    }]
}

function getDataGridView(name, eventActionName, entitySearchQuery, formData, itemType) {
  return {
    name,
    type: "DataGridView",
    properties: [],
    entity,
    formData,
    entitySearchQuery,
    eventActionName,
    detailPageUrl: '/detail/library?tabPage=0',
    actionName: eventActionName,
    className: "divDataGridView2",
    itemType: itemType || 'TopEdgeAppItem'
  }
}