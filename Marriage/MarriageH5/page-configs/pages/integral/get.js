const { getSpanText, getButton } = require('../../common');

//integral/get 2400-2499
const dataActionTypes = {
    //搜索查询 全部
    searchQuery: 2400,
    //searchGet
    searchGet: 2401,
    //searchQuestionnaire
    searchQuestionnaire: 2402,
    //searchExperience
    searchExperience: 2403,
    //searchDocument
    searchDocument: 2404
};

const entity = { name: 'Integral', primaryKey: 'PointRequireUID' };

module.exports = {
    name: "get",
    type: "View",
    eventActions: getEventActions(),
    properties: [getTabs()]
}

function getTabs() {
    return {
        name: 'tabs1',
        type: 'Tabs',
        properties: [
            getDocumentView(),
            getExperienceView(),
            getQuestionnaireView(),
            getOtherView()
        ]
    }
}

function getOtherView() {
    return {
        name: 'otherView',
        tabLabel: '其它',
        type: 'View',
        isDiv: true,
        className: 'divOtherList',
        properties: [getOtherListView(), getDataGridView('integralDataGridView1', 'searchGet', dataActionTypes.searchGet, {
            Param: { PointRequireIndex: "DateTimeDesc" },
            Act: 'Points_GetRequireList'
        })]
    }
}

function getOtherListView() {
    return {
        name: 'oherListView',
        type: 'View',
        isDiv: true,
        className: 'divOtherHeader',
        properties: [
            { ...getSpanText('headerInfo', 'divHeader'), text: 'You may apply point by other way of supporting us. i.e. help us to make presentations etc. For how the policy is, please check the Points policy of us , or contact us for detail by e-mail to info-sci.cn@horiba.com, thanks.' },
            { ...getButton('addOther', '索取积分', 'ghost'), className: 'addButton', size: 'small', eventActionName: 'addOther' },
            { ...getSpanText('otherLabel', 'divLabel'), text: '索取列表' },
        ]
    };
}

function getQuestionnaireView() {
    return {
        name: 'questionnaireView',
        tabLabel: '调查问卷',
        type: 'View',
        isDiv: true,
        className: 'divQuestionnaireList',
        properties: [getQuestionnaireListView(), getDataGridView('questionnaireDataGridView1', 'searchQuestionnaire', dataActionTypes.searchQuestionnaire, {
            Param: { ActivityIndex: "StartDateDesc", ActivityType: 9 },
            Act: 'OpticalSchool_GetActivitiesList'
        }, 'QuestionnaireHeaderItem', 'QuestionnaireItem')]
    }
}

function getQuestionnaireListView() {
    return {
        name: 'questionnaireListView',
        type: 'View',
        isDiv: true,
        className: 'divQuestionnaireHeader',
        properties: [
            { ...getSpanText('headerInfo', 'divHeader'), text: '参与问卷调查，获取积分。' },
        ]
    };
}

function getExperienceView() {
    return {
        name: 'experienceView',
        tabLabel: '科研经验',
        type: 'View',
        isDiv: true,
        className: 'divExperienceList',
        properties: [getExperienceListView(), {
            ...getDataGridView('experienceDataGridView1', 'searchExperience', dataActionTypes.searchExperience, {
                Param: { ResearchExIndex: "DateTimeDesc", OnlyListMyResearchEx: true },
                Act: 'OpticalSchool_GetResearchExList'
            }), detailPageUrl: '/integral/experienceEdit?tabPage=1', primaryKey: 'ResearchExUID'
        }]
    }
}

function getExperienceListView() {
    return {
        name: 'experienceListView',
        type: 'View',
        isDiv: true,
        className: 'divExperienceHeader',
        properties: [
            { ...getSpanText('headerInfo', 'divHeader'), text: '分享科研经验，获取积分。' },
            { ...getButton('addExperience', '新建', 'ghost'), className: 'addButton', size: 'small', eventActionName: 'addExperience' },
            { ...getSpanText('experienceLabel', 'divLabel'), text: '我的科研经验' },
        ]
    };
}

function getDocumentView() {
    return {
        name: 'documentView',
        tabLabel: '文献',
        type: 'View',
        isDiv: true,
        className: 'divDocumentList',
        properties: [getDocumentListView(), {
            ...getDataGridView('documentDataGridView1', 'searchDocument', dataActionTypes.searchDocument, {
                Param: { ClientDocumentsIndex: "DateTimeDesc"},
                Act: 'ClientDocuments_GetList'
            }), detailPageUrl: '/integral/documentEdit?tabPage=0', primaryKey: 'ClientDocumentsUID'
        }]
    }
}

function getDocumentListView() {
    return {
        name: 'documentListView',
        type: 'View',
        isDiv: true,
        className: 'divDocumentHeader',
        properties: [
            { ...getSpanText('headerInfo', 'divHeader'), text: '通过提交发表在SCI或者EI上的Paper（内附HORIBA仪器的测试结果），你将获得25积分。' },
            { ...getSpanText('headerInfo', 'divHeader'), text: '文章中请高亮标注“HORIBA”"Jobin Yvon"，工作人员将在3个工作日内完成审核并给予积分。' },
            { ...getButton('addDocument', '上传', 'ghost'), className: 'addButton', size: 'small', eventActionName: 'addDocument' },
            { ...getSpanText('experienceLabel', 'divLabel'), text: '我的文献' },
        ]
    };
}

function getEventActions() {
    return [
        {
            name: "searchGet",
            type: "dataGridView/searchQuery",
            dataGridView: "integralDataGridView1"
        },
        {
            name: "searchQuestionnaire",
            type: "dataGridView/searchQuery",
            dataGridView: "questionnaireDataGridView1"
        },
        {
            name: "searchExperience",
            type: "dataGridView/searchQuery",
            dataGridView: "experienceDataGridView1"
        },
        {
            name: "searchDocument",
            type: "dataGridView/searchQuery",
            dataGridView: "documentDataGridView1"
        },
        {
            name: "addDocument",
            type: "page/toPage",
            pageUrl: "/integral/documentEdit?tabPage=0&title=" + escape('新建文献')
        },
        {
            name: "addExperience",
            type: "page/toPage",
            pageUrl: "/integral/experienceEdit?tabPage=1&title=" + escape('新建科研经验')
        },
        {
            name: "addOther",
            type: "page/toPage",
            pageUrl: "/integral/getEdit?title=" + escape('新增索取积分')
        }]
}

function getDataGridView(name, eventActionName, entitySearchQuery, formData, headerItemType, itemType) {
    return {
        name,
        type: "DataGridView",
        properties: [],
        entity,
        formData,
        entitySearchQuery,
        eventActionName,
        headerItemType: headerItemType || 'IntegralGetHeaderItem',
        actionName: eventActionName,
        className: "divDataGridView2",
        itemType: itemType || 'IntegralGetItem'
    }
}