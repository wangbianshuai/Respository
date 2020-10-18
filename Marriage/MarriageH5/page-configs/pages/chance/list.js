const { getButton, getMoveSelect } = require('../../common');

//chance/index 1300-1399
const dataActionTypes = {
    //合作伙伴
    searchQuery: 1300,
    //人才招募
    searchJob: 1301,
};

const entity = { name: 'Chance', primaryKey: 'UID' };

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
            getTabView('partnerDataGridView1', '合作伙伴', '/chance/partner?tabPage=0', 'searchQuery', dataActionTypes.searchQuery, {
                Param: { ApplicationIndex: "PointsDesc" },
                Act: 'Opportunity_GetCollaborationList'
            }, 'TopPartnerItem', 'divPartnerDataGridView'),
            getPanelView('jobDataView', '人才招募', 'jobDataConditionView', 'searchJob', {
                ...getTabView('jobDataGridView1', '人才招募', '/chance/job?tabPage=1', 'searchJob', dataActionTypes.searchJob, {
                    Param: { JobReleaseIndex: "CreatedDateTimeDesc" },
                    Act: 'Opportunity_GetJobReleaseList'
                }, 'TopJobItem', 'divJobDataGridView'), isHideCondition: true
            }),
            getTechnicalView()
        ]
    }
}

function getPanelView(panelViewName, tabLabel, conditionViewName, valueChangeEventActionName, tabView) {
    return {
        name: panelViewName,
        type: 'View',
        isDiv: true,
        className: 'divPanelView4',
        tabLabel,
        properties: getPanelProperties(conditionViewName, valueChangeEventActionName, tabView)
    }
}

function getPanelProperties(conditionViewName, valueChangeEventActionName, tabView) {
    return [
        getConditionView(conditionViewName, valueChangeEventActionName),
        tabView
    ]
}

function getConditionView(name, valueChangeEventActionName) {
    return {
        name: name,
        type: 'View',
        isDiv: true,
        className: 'divConditionView',
        properties: getConditionProperties(valueChangeEventActionName)
    }
}

function getConditionProperties(valueChangeEventActionName) {
    return [
        { ...getMoveSelect('JobType', '所有类型', getJobTypeDataSource()), isCondition: true, valueChangeEventActionName, listName: 'List', emptyOption: { value: '', label: '所有类型' } }
    ]
}

function getJobTypeDataSource() {
    return [
        { value: 10, text: '博士后' },
        { value: 20, text: '科研助理' },
        { value: 30, text: '其他' }
    ]
}

function getTechnicalView() {
    return {
        name: 'technicalView',
        type: 'View',
        tabLabel: '技术转让',
        properties: getTechnicalProperties()
    }
}

function getTechnicalProperties() {
    return [
        { name: 'technicalInfo', type: 'technicalInfo' },
        getBottomButtonView()
    ]
}

function getBottomButtonView() {
    return {
        name: 'bottomButtonView',
        type: 'View',
        isDiv: true,
        className: 'divDetailBottom',
        properties: [{ ...getButton('apply', '申请', 'primary'), size: 'small', className: "button", eventActionName: 'openUrl' }]
    }
}

function getEventActions() {
    return [
        {
            name: "searchQuery",
            type: "dataGridView/searchQuery",
            dataGridView: "partnerDataGridView1",
            searchView: "partnerConditionView"
        },
        {
            name: "searchJob",
            type: "dataGridView/searchQuery",
            dataGridView: "jobDataGridView1",
            searchView: "jobDataConditionView"
        },
        {
            name: 'openUrl',
            type: 'page/openUrl',
            pageUrl: 'https://horiba.jinshuju.net/f/FCPGGZ'
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
        isChance: true,
        detailPageUrl,
        actionName: eventActionName,
        className,
        itemType
    }
}