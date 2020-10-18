const { getMoveSelect2, getMoveSelect } = require('../../common');

//spectral/list 800-899
const dataActionTypes = {
    //活动
    searchQuery: 800,
    //科研经验
    searchExperience: 801,
    //行业动态
    searchVideo: 802,
};

const entity = { name: 'Spectral', primaryKey: 'UID' };

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
        swipeable: false,
        properties: [
            getActivityView(),
            getExperienceView(),
            getVideoView(),
            getTools()
        ]
    }
}


function getTools() {
    return {
        name: 'tools',
        type: 'toolsDataView',
        className: 'divTools',
        tabLabel: '工具',
        detailPageUrl: '/spectral/tools?tabPage=3',
        dataSource: getToolsDataSource()
    }
}

function getToolsDataSource() {
    return [
        addToolsItem('Optical Formula', 'Are you still looking for optical formulas? Here we provide a series of formulas to make your research easy. Just put in the desired data, we will generate the solution for you.'),
        addToolsItem('Grating Tools', 'This spectrometer calculator is very convenient for the users to get spectroscopy parameters after selecting different spectrometers, detectors and gratings.'),
        addToolsItem('Periodical Charts for ICP', 'The periodic table of chemical elements presents complete information on the chemical elements including the chemical element symbol, atomic number, atomic weight and description.Several kinds of descriptive categorizations can be applied broadly to the elements, including consideration of their general physical and chemical properties, their states of matter under familiar conditions, their melting and boiling points, their densities, their crystal structures as solids, and their origins.'),
        addToolsItem('Periodical Charts for XRF', 'XRF spectroscopy is widely used for qualitative and quantitative elemental analysis of environmental, archaeological, geological, biological, industrial and other samples. This periodic table is an excellent reference tool for student and professionals for anyone with an interest in materials analysis.'),
    ]
}


function addToolsItem(title, content) {
    return { title, content }
}

function getVideoView() {
    return {
        name: 'videoView',
        type: 'View',
        tabLabel: '云课堂',
        isDiv: true,
        className: 'divPanelView3',
        properties: getVideoProperties()
    }
}

function getExperienceView() {
    return {
        name: 'experienceView',
        type: 'View',
        tabLabel: '科研经验',
        isDiv: true,
        className: 'divPanelView',
        properties: getExperienceProperties()
    }
}

function getActivityView() {
    return {
        name: 'activityView',
        type: 'View',
        tabLabel: '活动',
        isDiv: true,
        className: 'divPanelView2',
        properties: getActivityProperties()
    }
}

function getActivityProperties() {
    return [
        getActivityConditionView(),
        getTabView('activityDataGridView1', '活动', '/detail/activity?tabPage=0', 'searchQuery', dataActionTypes.searchQuery, {
            Param: { ActivityIndex: "StartDate" },
            Act: 'OpticalSchool_GetActivitiesList'
        }, 'TopActivityItem', 'divDataGridView')
    ]
}

function getExperienceProperties() {
    return [
        getExperienceConditionView(),
        getTabView('experienceDataGridView1', '科研经验', '/detail/experience?tabPage=1', 'searchExperience', dataActionTypes.searchExperience, {
            Param: { ResearchExIndex: "DateTimeDesc" },
            Act: 'OpticalSchool_GetResearchExList'
        }, 'TopEdgeAppItem', 'divDataGridView2')
    ]
}

function getVideoProperties() {
    return [
        getVideoConditionView(),
        getTabView('videoDataGridView1', '云课堂', '/detail/video?tabPage=2', 'searchVideo', dataActionTypes.searchVideo, {
            Param: { VideoIndex: "DateTimeDesc" },
            Act: 'OpticalSchool_GetVideosList'
        }, 'TopClassRoomItem', 'divVideoGridView')
    ]
}

function getActivityConditionView() {
    return {
        name: 'activityConditionView',
        type: 'View',
        isDiv: true,
        className: 'divConditionView',
        properties: getActivityConditionProperties()
    }
}

function getExperienceConditionView() {
    return {
        name: 'experienceConditionView',
        type: 'View',
        isDiv: true,
        className: 'divConditionView',
        properties: getExperienceConditionProperties()
    }
}

function getVideoConditionView() {
    return {
        name: 'videoConditionView',
        type: 'View',
        isDiv: true,
        className: 'divConditionView',
        properties: getVideoConditionProperties()
    }
}

function getActivityConditionProperties() {
    return [
        {
            ...getMoveSelect2('AreaUID', '国家', getAreaServiceDataSource()), isCondition: true, valueChangeEventActionName: 'searchQuery',
            listName: 'List', emptyOption: { value: '', label: '所有国家' }
        },
        {
            ...getMoveSelect('ActivityType', '类型', getActivityTypeDataSource()), isCondition: true, valueChangeEventActionName: 'searchQuery',
            emptyOption: { value: '', label: '所有类型' }
        },
        {
            ...getMoveSelect2('ApplicationUID', '应用领域', getApplicationServiceDataSource()), isCondition: true, valueChangeEventActionName: 'searchQuery',
            listName: 'List', emptyOption: { value: '', label: '所有应用' }
        },
        {
            ...getMoveSelect2('TechniqueUID', '光谱技术', getTechniqueServiceDataSource()), isCondition: true, valueChangeEventActionName: 'searchQuery',
            listName: 'List', emptyOption: { value: '', label: '所有技术' }
        }
    ]
}

function getExperienceConditionProperties() {
    return [{
        ...getMoveSelect2('ApplicationUID', '应用领域', getApplicationServiceDataSource()), isCondition: true, valueChangeEventActionName: 'searchExperience',
        listName: 'List', emptyOption: { value: '', label: '所有应用' }
    },
    {
        ...getMoveSelect2('TechniqueUID', '光谱技术', getTechniqueServiceDataSource()), isCondition: true, valueChangeEventActionName: 'searchExperience',
        listName: 'List', emptyOption: { value: '', label: '所有技术' }
    }]
}

function getVideoConditionProperties() {
    return [{
        ...getMoveSelect('VideoType', '视频分类', getVideoTypeDataSource()), isCondition: true, valueChangeEventActionName: 'searchVideo',
        emptyOption: { value: '', label: '所有分类' }
    },
    {
        ...getMoveSelect2('ApplicationUID', '应用领域', getApplicationServiceDataSource()), isCondition: true, valueChangeEventActionName: 'searchVideo',
        listName: 'List', emptyOption: { value: '', label: '所有应用' }
    },
    {
        ...getMoveSelect2('TechniqueUID', '光谱技术', getTechniqueServiceDataSource()), isCondition: true, valueChangeEventActionName: 'searchVideo',
        listName: 'List', emptyOption: { value: '', label: '所有技术' }
    }
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
        { value: 100, text: '其他' }
    ]
}

function getActivityTypeDataSource() {
    return [
        { value: 1, text: '国际学术会议' },
        { value: 2, text: '学术会议' },
        { value: 3, text: '用户培训班' },
        { value: 4, text: '技术交流会' },
        { value: 5, text: '在线讲座' },
        { value: 6, text: '用户研讨会' },
        { value: 7, text: '行业展会' },
        { value: 8, text: '校园科普' },
        { value: 9, text: '市场调查' }
    ]
}

function getAreaServiceDataSource() {
    return {
        stateName: "getAreas",
        serviceName: "SpectralService",
        actionName: "getAreas",
        valueName: 'UID',
        textName: 'CnName',
        payload: {
            formData: {
                Param: '{}',
                Act: 'Address_GetCountryList'
            }
        }
    }
}


function getApplicationServiceDataSource() {
    return {
        stateName: "getApplications",
        serviceName: "SpectralService",
        actionName: "getApplications",
        valueName: 'UID',
        textName: 'CnName',
        payload: {
            formData: {
                Param: '{}',
                Act: 'Application_GetList'
            }
        }
    }
}

function getTechniqueServiceDataSource() {
    return {
        stateName: "getTechniques",
        serviceName: "SpectralService",
        actionName: "getTechniques",
        valueName: 'UID',
        textName: 'Name',
        payload: {
            formData: {
                Param: '{}',
                Act: 'Technique_GetList'
            }
        }
    }
}

function getEventActions() {
    return [
        {
            name: "searchQuery",
            type: "dataGridView/searchQuery",
            dataGridView: "activityDataGridView1",
            searchView: "activityConditionView"
        },
        {
            name: "searchExperience",
            type: "dataGridView/searchQuery",
            dataGridView: "experienceDataGridView1",
            searchView: "experienceConditionView"
        },
        {
            name: "searchVideo",
            type: "dataGridView/searchQuery",
            dataGridView: "videoDataGridView1",
            searchView: "videoConditionView"
        }
    ]
}

function getTabView(name, tabLabel, detailPageUrl, eventActionName, entitySearchQuery, formData, itemType, className) {
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
        isHideCondition: true,
        detailPageUrl,
        actionName: eventActionName,
        className,
        itemType
    }
}