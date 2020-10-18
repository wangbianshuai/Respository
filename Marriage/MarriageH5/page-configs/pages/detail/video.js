const { getSpanText, getDateIconText, getIconText, getHtmlContent } = require('../../common');

//detail/video 1100-1199
const dataActionTypes = {
    //get entity data
    getEntityData: 1100,
    //Save entity data
    saveEntityData: 1101
};

const entity = { name: 'Spectral', primaryKey: 'UID' };

module.exports = {
    name: "video",
    type: "View",
    eventActions: getEventActions(),
    properties: [getTabs(), getEditView()]
}

function getEditView() {
    return {
        name: "editView",
        type: "View",
        isDiv: true,
        className: 'divDetail',
        properties: [getEditView2()]
    }
}

function getEditView2() {
    return {
        name: "videoEdit",
        type: "RowsColsView",
        isDiv: true,
        className: 'divDetail2',
        entity: entity,
        eventActionName: "getEntityData",
        formData: {
            Param: {},
            Act: 'OpticalSchool_GetSingleVideoInfo',
            dataPrimaryKey: 'VideoUID'
        },
        getEntityDataActionType: dataActionTypes.getEntityData,
        properties: getProperties()
    }
}

function getTabs() {
    return {
        name: 'tabs1',
        type: 'Tabs',
        isDiv: true,
        className: 'tabDetail',
        tabs: [{ title: '活动', url: "/spectral/list?tabPage=0" },
        { title: '科研经验', url: "/spectral/list?tabPage=1" },
        { title: '云课堂', url: "/spectral/list?tabPage=2" },
        { title: '工具', url: "/spectral/list?tabPage=3" }]
    }
}

function getProperties() {
    return [
        getSpanText('VideoName', 'divTitle', 1, 1),
        { ...getIconText('VideoType', 'videotype.png', 'divVideoType', 2, 1), dataSource: getVideoTypeDataSource() },
        { ...getDateIconText('CreatedDate', 'divDate', 2, 2) },
        { name: 'favoritesStart', type: 'FavoritesStar', x: 2, y: 3, articleType: 40 },
        getHtmlContent('Description', 'divContent', 3, 1),
        {
            name: 'Links',
            type: 'IframeVideo',
            allowfullscreen: true,
            className: "videoFrame",
            x: 4,
            y: 1
        },
        getRecommendRead()
    ]
}

function getVideoTypeDataSource() {
    return [
        { value: 40, text: '光谱基础知识' },
        { value: 10, text: '仪器日常维护' },
        { value: 60, text: '样品测试方法及技巧' },
        { value: 20, text: '仪器软件介绍' },
        { value: 70, text: '仪器数据分析' },
        { value: 80, text: '仪器附件介绍' },
        { value: 30, text: '前沿应用' },
        { value: 50, text: '产品介绍' },
        { value: 90, text: '常见问题答疑' },
        { value: 40, text: '其他' }
    ]
}

function getEventActions() {
    return [{
        name: "getEntityData",
        type: "entityEdit/getEntityData",
        editView: "videoEdit",
        setGetEntityDataLoad: 'setGetEntityDataLoad'
    }]
}

function getRecommendRead() {
    return {
        name: 'recommendRead',
        type: 'recommendRead',
        className: "divRecommendRead",
        textName: 'VideoName',
        primaryKey: 'UID',
        title: '推荐视频',
        x: 5,
        y: 1,
        detailPageUrl: '/detail/video'
    }
}