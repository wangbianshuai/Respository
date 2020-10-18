//footmark/index 1800-1899
const dataActionTypes = {
  //搜索查询 全部
  searchQuery: 500,
  //文献浏览历史
  searchLibraryHistory: 1801,
  //活动参加历史
  searchActivityHistory: 1802,
  //视频浏览历史
  searchVideoHistory: 1803,
};

const entity = { name: 'Footmark', primaryKey: 'UID' };

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
      getTabView('libraryHistoryDataGridView1', '文献浏览历史', '/detail/library?tabPage=0', 'searchLibraryHistory', dataActionTypes.searchLibraryHistory, {
        Param: { VisitedHistoryIndex: "DateTimeDesc" },
        Act: 'Library_GetVisitedHistoryList'
      }, 'TopEdgeAppItem', 'divDataGridView2'),
      getTabView('activityHistoryDataGridView1', '活动参加历史', '/detail/activity?tabPage=0', 'searchActivityHistory', dataActionTypes.searchActivityHistory, {
        Param: { HistoryIndex: "DateTimeDesc" },
        Act: 'OpticalSchool_GetActivitiesSurveyHistoryList'
      }, 'TopEdgeAppItem', 'divDataGridView2', 'ActivityUID'),
      getTabView('videoHistoryDataGridView1', '视频浏览历史', '/detail/video?tabPage=2', 'searchVideoHistory', dataActionTypes.searchVideoHistory, {
        Param: { VisitedHistoryIndex: "DateTimeDesc" },
        Act: 'OpticalSchool_GetVideoVisitedHistoryList'
      }, 'TopClassRoomItem', 'divVideoGridView')
    ]
  }
}

function getTabView(name, tabLabel, detailPageUrl, eventActionName, entitySearchQuery, formData, itemType, className, primaryKey) {
  return {
    name,
    tabLabel,
    type: "DataGridView",
    properties: [],
    entity,
    formData,
    entitySearchQuery,
    eventActionName,
    isSpectral: true,
    detailPageUrl,
    primaryKey: primaryKey || 'ArticleUID',
    actionName: eventActionName,
    className,
    itemType
  }
}

function getEventActions() {
  return [
    {
      name: "searchLibraryHistory",
      type: "dataGridView/searchQuery",
      dataGridView: "libraryHistoryDataGridView1"
    },
    {
      name: "searchActivityHistory",
      type: "dataGridView/searchQuery",
      dataGridView: "activityHistoryDataGridView1",
    },
    {
      name: "searchVideoHistory",
      type: "dataGridView/searchQuery",
      dataGridView: "videoHistoryDataGridView1"
    }
  ]
}