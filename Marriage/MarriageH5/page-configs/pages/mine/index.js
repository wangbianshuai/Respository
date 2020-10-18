const { getTextBox, getSelect, getSelect2, getButton, getSpanText, regExpress, getHtmlContent, createGuid, getDatePicker } = require('../../common');

//mine/index 2100-2199
const dataActionTypes = {
    //get entity data
    getEntityData: 2100,
    //Save entity data
    saveEntityData: 2101,
    //applyUserAccount
    applyUserAccount: 2102,
    //quitUserAccount
    quitUserAccount: 2103,
    //changePassword
    changePassword: 2104,
    //send sms
    sendSms: 2105,
    //changeCell
    changeCell: 2106,
    //getFavorites
    getFavorites: 2107,
    //获取lab 用户
    getLabUser: 2108,
    //passLabUserApply
    passLabUserApply: 2109,
    //rejectLabUserApply
    rejectLabUserApply: 2110,
    //getCollaborationInfo
    getCollaborationInfo: 2111,
    //savePartnerLab
    savePartnerLab: 2112,
    //searchJob
    searchJob: 2113,
    //getJob
    getJob: 2114,
    //savejob
    saveJob: 2115
};

const entity = { name: 'User', primaryKey: 'UID' };

module.exports = {
    name: "index",
    type: "View",
    dialogViews: getDialogViews(),
    eventActions: getEventActions(),
    properties: [getEditView2()]
}

function getEditView2() {
    return {
        name: "userInfo",
        type: "View",
        entity: entity,
        eventActionName: "getEntityData",
        formData: {
            Param: {},
            Act: 'User_GetInfo'
        },
        getEntityDataActionType: dataActionTypes.getEntityData,
        properties: [getTopInfo(), getTabs()]
    }
}

function getTopInfo() {
    return {
        name: 'userTopInfo',
        type: 'userTopInfo'
    }
}

function getTabs() {
    return {
        name: 'tabs1',
        type: 'Tabs',
        isDiv: true,
        className: 'mineTabs',
        properties: [
            getTabPanel('personInfo', '个人信息', getPersonInfoProperties(), 'divLogin', {
                Act: 'User_UpdateInfo'
            }),
            getTabPanel('instrumentManage', '仪器管理', getInstrumentManageProperties(), 'divLogin'),
            {
                ...getTabPanel('labUserManage', '用户管理', getLabUserManageProperties(), 'divLogin'),
                url: '/mine/index?tabPage=2'
            },
            {
                ...getTabPanel('partnerLab', '合作实验室', getPartnerLabProperties(), 'divLogin', {
                    Param: '{}',
                    Act: 'Opportunity_GetSingleCollaborationInfo'
                }),
                eventActionName: "getCollaborationInfo",
                getEntityDataActionType: dataActionTypes.getCollaborationInfo,
            },
            {
                ...getTabPanel2('jobManage', '工作管理', getJobManageProperties()),
                url: '/mine/index?tabPage=4'
            },
            getTabPanel('upgradeAccount', '升级账号', getUpgradeAccountProperties(), 'divLogin', {
                Act: 'User_ApplyUserAccount'
            }),
            {
                ...getTabPanel('changePasswordView', '修改密码', getChangePasswordProperties(), 'divLogin', {
                    Act: 'User_ChangePassword'
                }),
                successTip: '修改成功', isClear: true
            },
            { ...getTabPanel('changeCellView', '更换手机', getChangePhoneProperties(), 'divLogin'), type: 'RowsColsView' },
            getTabView('favoritesDataGridView1', '我的收藏', 'getFavorites', dataActionTypes.getFavorites, {
                Param: { FavoriteIndex: "DateTimeDesc" },
                Act: 'Favorites_GetList'
            })
        ]
    }
}

function getJobManageProperties() {
    return [{
        name: 'jobManageView',
        type: 'View',
        isDiv: true,
        className: 'divJobList',
        properties: [
            getJobListView(),
            getJobDataGridView(),
            getEditView()
        ]
    }];
}

function getEditView() {
    return {
        name: 'jobEditView',
        type: 'View',
        isList: true,
        entity: { name: 'Job', primaryKey: 'JobUID' },
        formData: {
            Param: {},
            Act: 'Opportunity_GetSingleJobReleaseInfo',
            dataPrimaryKey: 'JobReleaseUID'
        },
        eventActionName: "getJob",
        getEntityDataActionType: dataActionTypes.getJob,
        properties: getJobEditProperties(),
        className: 'divLogin'
    }
}

function getJobEditProperties() {
    return [
        getTextBox2('JobName', '职位名称', 2, 1, '请输入职位名称', 50, false),
        getTextBox2('Address', '公司/院校', 2, 1, '请输入公司/院校', 50, false),
        getTextBox2('ContactPerson', '部门/院系', 2, 1, '请输入部门/院系', 50, false),
        getTextBox2('Email', '邮箱', 5, 1, '请输入邮箱', 50, false),
        { ...getSelectPicker2('CityUID', '城市', getCityServiceDataSource(), 3, 1), isNullable: false, isRed: true, type: 'CountryProvinceCity' },
        getTextBox2('Telephone', '电话', 4, 1, '请输入电话', 20, false),
        getDatePicker2('ExpirationDate', '有效期', '请选择有效期', false),
        { ...getSelect('JobType', '类型', getJobTypeDataSource()), isEdit: true, isNullable: false, isRed: true },
        { ...getTextBox2('Description', '职位描述', 7, 1, '（可选填）'), type: 'Ckeditor4' },
        { ...getTextBox2('CompanyInfo', '公司介绍', 7, 1, '（可选填）'), type: 'Ckeditor4' },
        getJobEditButtonView(),
    ]
}

function getJobTypeDataSource() {
    return [{ value: 10, text: 'Post-Doc position' }, { value: 20, text: '实习生' }]
}

function getJobEditButtonView() {
    return {
        name: 'jobButtonView',
        type: 'RowsColsView',
        isDiv: true,
        className: "divButtonView",
        properties: [
            { ...getButton('saveJob', '保存', 'primary', 1, 1), size: 'small', saveEntityDataActionType: dataActionTypes.saveJob, className: 'button', eventActionName: 'saveJob', rowClassName: "divRow4" },
            { ...getButton('backToJobList', '返回', '', 1, 2), size: 'small', className: 'button', eventActionName: 'backToJobList', rowClassName: "divRow4" }
        ]
    }
}

function getJobDataGridView() {
    return {
        name: 'jobDataGridView',
        type: "DataGridView",
        properties: [],
        entity: { name: 'Job', primaryKey: 'UID' },
        formData: {
            Param: { SelfRelease: true, JobReleaseIndex: "CreatedDateTimeDesc" },
            Act: 'Opportunity_GetJobReleaseList'
        },
        entitySearchQuery: dataActionTypes.searchJob,
        eventActionName: 'searchJob',
        detailPageUrl: '/mine/index?tabPage=4',
        actionName: 'searchJob',
        className: "divDataGridView2",
        itemType: 'JobItem'
    }
}

function getJobListView() {
    return {
        name: 'jobManageView',
        type: 'View',
        isDiv: true,
        className: 'divJobHeader',
        properties: [
            { ...getSpanText('headerInfo', 'divHeader'), text: '您可以通过Wikispectra发布招聘信息，发布前，请确认信息的准确无误。' },
            { ...getButton('addJob', '发布职位', 'ghost'), className: 'addButton', size: 'small', eventActionName: 'addJob' },
            { ...getSpanText('jobLabel', 'divLabel'), text: '职位列表' },
        ]
    };
}

function getPartnerLabProperties() {
    return [
        { ...getTextBox('StatusName', '审核状态', '', 3, 1), isReadOnly: true, isValueVisible: true, style: { color: '#999999' } },
        getTextBox2('Company', '公司/院校', 2, 1, '请输入公司/院校', 50, false),
        { ...getSelectPicker2('CityUID', '城市', getCityServiceDataSource(), 3, 1), isNullable: false, isRed: true, type: 'CountryProvinceCity' },
        getTextBox2('Telephone', '电话', 4, 1, '请输入电话', 20, false),
        getTextBox2('Email', '邮箱', 5, 1, '请输入邮箱', 50, false),
        {
            name: 'Image',
            label: '图片',
            type: 'UploadImage',
            pathName: 'CollaborationImages',
            className: 'divUpdateImage',
            isListItem: true,
            isEdit: true,
            nullTipMessage: "请选择图片",
            x: 6,
            y: 1
        },
        { ...getTextBox2('Description', '描述', 7, 1, '（可选填）'), type: 'Ckeditor4' },
        { ...getButton('savePartnerLab', '保存', 'primary', 8, 1), confirmTip: '确认更新吗，这将需要重新审查。', divClassName: "divRow3", isDiv: true, saveEntityDataActionType: dataActionTypes.savePartnerLab, className: 'loginButton', eventActionName: 'savePartnerLab' }
    ]
}

function getLabUserManageProperties() {
    return [{
        name: 'labUserList', type: 'labUserList', className: 'divLabUser',
        detailPageUrl: '/mine/index?tabPage=2',
        listName: 'List', serviceDataSource: getLabUserServiceDataSource()
    }, getUserDetailView()]
}

function getUserDetailView() {
    return {
        name: "userDetailView",
        type: "View",
        isDiv: true,
        className: 'divDetail2',
        entity: { primaryKey: "UserUID", name: 'LabUser' },
        eventActionName: "getLabUser",
        formData: {
            Param: {},
            Act: 'User_LabAccountGetItsUserInfo',
            dataPrimaryKey: 'UserUID'
        },
        getEntityDataActionType: dataActionTypes.getLabUser,
        properties: getLabUserProperties()
    }
}

function getLabUserProperties() {
    return [
        { ...getLeftRightSpan('UserType', '申请状态'), dataSource: getStatusDataSource() },
        getLeftRightSpan('ApplyUserDate', '申请时间'),
        getLeftRightSpan('FirstName', '名字'),
        getLeftRightSpan('LastName', '姓氏'),
        getLeftRightSpan('Email', '邮箱'),
        getLeftRightSpan('CallNumber', '电话'),
        getButtonView()
    ]
}

function getButtonView() {
    return {
        name: 'buttonView',
        type: 'RowsColsView',
        isVisible: false,
        isDiv: true,
        className: "divButtonView",
        properties: [
            { ...getButton('pass', '通过', 'primary', 1, 1), isVisible: false, size: 'small', saveEntityDataActionType: dataActionTypes.passLabUserApply, className: 'button', eventActionName: 'passLabUserApply', rowClassName: "divRow4" },
            { ...getButton('reject', '驳回', 'ghost', 1, 2), size: 'small', confirmTip: '确认要驳回吗？', saveEntityDataActionType: dataActionTypes.rejectLabUserApply, className: 'button', eventActionName: 'rejectLabUserApply', rowClassName: "divRow4" },
            { ...getButton('back', '返回', '', 1, 3), size: 'small', className: 'button', eventActionName: 'back', rowClassName: "divRow4" }
        ]
    }
}

function getStatusDataSource() {
    return [
        { value: 15, text: '审核中' },
        { value: 20, text: '审核通过' }
    ]
}

function getLeftRightSpan(name, label) {
    return {
        name, label, type: 'LeftRightSpan', className: 'divLeftRightSpan2',
        isListItem: true
    }
}

function getLabUserServiceDataSource() {
    return {
        stateName: "getLabUsers",
        serviceName: "UserService",
        actionName: "getLabUsers",
        isRefresh: true,
        payload: {
            formData: {
                Param: '{}',
                Act: 'User_LabAccountGetItsUserList'
            }
        }
    }
}

function getInstrumentManageProperties() {
    return [{ name: 'salesSupport', type: 'salesSupport', className: 'divLabProduct' },
    { name: 'labProductList', type: 'labProductList', className: 'divLabProduct', recommendActivity: getRecommendActivity(), listName: 'List', serviceDataSource: getLabProductServiceDataSource() }]
}

function getRecommendActivity() {
    return {
        name: 'recommendActivity',
        type: 'productRecommendActivity',
        className: 'divRecommendActivity',
        listName: 'List',
        detailPageUrl: '/detail/activity?tabPage=0',
        serviceDataSource: getTopActivitiesDataSource()
    }
}

function getTopActivitiesDataSource() {
    return {
        stateName: "getRecommendActivities",
        serviceName: "UserService",
        actionName: "getRecommendActivities",
        isRefresh: true,
        payload: {
            formData: {
                Act: 'OpticalSchool_GetActivitiesList'
            }
        }
    }
}

function getLabProductServiceDataSource() {
    return {
        stateName: "getLabProductList",
        serviceName: "UserService",
        actionName: "getLabProductList",
        payload: {
            formData: {
                Param: '{}',
                Act: 'User_GetLabProductList'
            }
        }
    }
}

function getTabView(name, tabLabel, eventActionName, entitySearchQuery, formData) {
    return {
        name,
        tabLabel,
        type: "DataGridView",
        properties: [],
        entity,
        formData,
        entitySearchQuery,
        eventActionName,
        actionName: eventActionName,
        className: "divDataGridView2",
        itemType: 'FavoritesItem'
    }
}

function getChangePhoneProperties() {
    return [
        { ...getSelect2('CountryCode', '地区', getPhoneCodeAreaDataSource(), 1, 1, '86'), rowClassName: "divRow2", isEdit: true, listName: 'List' },
        { ...getTextBox('CallNumber', '新手机', '', 2, 1, '请输入新手机', 11), isEdit: true, rowClassName: "divRow2", clear: true, isNullable: false, regExp: regExpress.noNumber },
        {
            ...getTextBox('ValidationCode', '图形验证码', '', 5, 1, '请输入图形验证码', 6), isEdit: true,
            type: 'ImageVerifyCode', rowClassName: "divRow2", isNullable: false, propertyName2: 'ValidationCodeUID'
        },
        {
            ...getTextBox('CallNumberValidCode', '短信验证码', '', 6, 1, '请输入短信验证码', 6), isEdit: true,
            saveEntityDataActionType: dataActionTypes.sendSms, regExp: regExpress.noNumber,
            type: 'SendVerifyCode', rowClassName: "divRow2", sendSmsEventActionName: 'sendSms', isNullable: true
        },
        { ...getButton('changeCell', '更换手机', 'primary', 7, 1), saveEntityDataActionType: dataActionTypes.changeCell, className: 'loginButton', eventActionName: 'changeCell', rowClassName: "divRow3" }]
}


function getChangePasswordProperties() {
    return [
        { ...getTextBox2('NewPwd', '密码', 2, 1, '请输入密码', 50, false), controlType: 'password' },
        { ...getTextBox2('AgainPwd', '确认密码', 2, 1, '请输入确认密码', 50, false), controlType: 'password' },
        { ...getButton('changePassword', '修改密码', 'primary', 3, 1), divClassName: "divRow3", isDiv: true, saveEntityDataActionType: dataActionTypes.changePassword, className: 'loginButton', eventActionName: 'changePassword' }
    ]
}

function getUpgradeAccountProperties() {
    return [{ ...getSpanText('upgradeRemark', 'divRemark'), isVisible: false, text: '升级成为User账号，可自动查询获取仪器相关信息和资料、参加专业仪器使用培训班、提升仪器使用技能快速获得应用和服务支持等。您可以通过联系您所在实验室的管理人员或者直接与我们联系，获取实验室Lab ID用于加入实验室，升级成为User账号。一旦您所在实验室的管理人员审核通过，您便成功升级为User账号。' },
    { ...getTextBox2('LabAccount', 'Lab ID', 2, 1, '请输入Lab ID', 50, false), isVisible: false },
    { ...getSpanText('remark', 'divRemark2'), isVisible: false },
    { ...getSpanText('LabID', 'divRemark2'), isVisible: false, label: 'Lab ID：' },
    { ...getSpanText('ApproveUserDate', 'divRemark2'), isVisible: false, label: '升级时间：' },
    { ...getButton('applyUserAccount', '申请加入实验室', 'primary', 3, 1), isVisible: false, divClassName: "divRow3", isDiv: true, saveEntityDataActionType: dataActionTypes.applyUserAccount, className: 'loginButton', eventActionName: 'applyUserAccount' },
    { ...getButton('quitUserAccount', '退出申请', 'primary', 4, 1), isVisible: false, divClassName: "divRow3", confirmTip: '确认退出吗？', isDiv: true, saveEntityDataActionType: dataActionTypes.quitUserAccount, className: 'loginButton', eventActionName: 'quitUserAccount' },
    { ...getButton('quitUserAccount2', '退出User帐户', 'primary', 5, 1), isVisible: false, divClassName: "divRow3", confirmTip: '确认退出吗？', isDiv: true, saveEntityDataActionType: dataActionTypes.quitUserAccount, className: 'loginButton', eventActionName: 'quitUserAccount' }

    ]
}

function getPersonInfoProperties() {
    return [
        getTextBox2('FirstName', '名称', 1, 1, '请输入名称', 50, false),
        getTextBox2('LastName', '姓氏', 2, 1, '请输入姓氏', 30, false),
        { ...getTextBox('MyInvitationCode', '我的邀请码', '', 3, 1), isReadOnly: true, style: { color: '#999999' } },
        getTextBox2('Email', '邮箱', 4, 1, '请输入邮箱', 50, false),
        { ...getTextBox('Account', 'Lab ID', '', 5, 1), isReadOnly: true, isVisible: false, style: { color: '#999999' } },
        { ...getTextBox2('CallNumberCode', '手机', 5, 1, '', 20), isReadOnly: true, style: { color: '#999999' } },
        getSelectPicker('Job', '职位', getJobDataSource(), 6, 1),
        getSelectPicker('Degree', '头衔', getDegreeDataSource(), 7, 1),
        getTextBox2('Company', '公司/院校', 8, 1, '可选填', 50, true),
        getTextBox2('Department', '部门/院系', 9, 1, '可选填', 50, true),
        { ...getSelectPicker2('CityUID', '城市', getCityServiceDataSource(), 10, 1), type: 'CountryProvinceCity' },
        { ...getCheckBoxGroup('ApplicationUIDs', '应用领域', getApplicationServiceDataSource(), 12, 1), listName: 'List' },
        { ...getCheckBoxGroup('TechniqueUIDs', '感兴趣的光谱技术', getTechniqueServiceDataSource(), 13, 1), listName: 'List' },

        { ...getButton('save', '保存', 'primary', 14, 1), divClassName: "divRow3", isDiv: true, saveEntityDataActionType: dataActionTypes.saveEntityData, className: 'loginButton', eventActionName: 'saveEntityData' }
    ]
}

function getCheckBoxGroup(name, label, serviceDataSource, x, y) {
    return { name, label, serviceDataSource, x, y, isString: true, isEdit: true, isList: true, type: 'CheckBoxGroup' };
}

function getApplicationServiceDataSource() {
    return {
        stateName: "getApplications",
        serviceName: "LibraryService",
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
        serviceName: "LibraryService",
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

function getCityServiceDataSource() {
    return {
        stateName: "getCountryProvinceCityList",
        serviceName: "UserService",
        actionName: "getCountryProvinceCityList",
        payload: {
            formData: {
                Param: '{}',
                Act: 'Address_GetCountryProvinceCityList'
            }
        }
    }
}

function getDegreeDataSource() {
    return [
        { value: '教授', text: '教授' },
        { value: '博士', text: '博士' },
        { value: '工程师', text: '工程师' },
        { value: '教授助理', text: '教授助理' },
        { value: 'Associated Professor', text: 'Associated Professor' },
        { value: 'Post Doctorate', text: 'Post Doctorate' },
        { value: '高级工程师', text: '高级工程师' },
        { value: '硕士', text: '硕士' }
    ]
}

function getJobDataSource() {
    return [
        { value: '总经理', text: '总经理' },
        { value: '实验室主任', text: '实验室主任' },
        { value: '经理', text: '经理' },
        { value: '运营人员', text: '运营人员' },
        { value: '采购经理', text: '采购经理' },
        { value: '研发经理', text: '研发经理' },
        { value: '研究人员', text: '研究人员' },
        { value: '销售经理', text: '销售经理' },
        { value: '售后经理', text: '售后经理' },
        { value: '普通员工', text: '普通员工' },
        { value: '学生', text: '学生' }
    ]
}

function getTextBox2(name, label, x, y, placeHorder, maxLength, isNullable) {
    return { ...getTextBox(name, label, '', x, y, placeHorder, maxLength), isEdit: true, clear: true, isNullable, isRed: !isNullable }
}

function getDatePicker2(name, label, placeHorder, isNullable) {
    return { ...getDatePicker(name, label), placeHorder, isEdit: true, isNullable, isRed: !isNullable }
}

function getSelectPicker(name, label, dataSource, x, y) {
    return { ...getSelect(name, label, dataSource, x, y), isEdit: true, isNullable: true, emptyOption: { value: '', label: '' } }
}

function getSelectPicker2(name, label, serviceDataSource, x, y) {
    return { ...getSelect2(name, label, serviceDataSource, x, y), isEdit: true, isNullable: true, emptyOption: { value: '', label: '' } }
}

function getTabPanel(name, tabLabel, properties, className, formData) {
    return {
        name,
        tabLabel,
        type: 'View',
        isList: true,
        entity,
        formData,
        properties,
        className: className
    }
}

function getTabPanel2(name, tabLabel, properties, className) {
    return {
        name,
        tabLabel,
        type: 'View',
        properties,
        className: className
    }
}

function getEventActions() {
    return [
        {
            name: "getEntityData",
            type: "entityEdit/getEntityData",
            editView: "userInfo",
            editPropertiyViewList: ['personInfo', 'upgradeAccount'],
            setGetEntityDataLoad: 'setGetEntityDataLoad'
        },
        {
            name: "saveEntityData",
            type: "entityEdit/saveEntityData",
            editView: "personInfo"
        },
        {
            name: "applyUserAccount",
            type: "entityEdit/saveEntityData",
            editView: "upgradeAccount",
            successCallback: 'applyUserAccountCallback'
        },
        {
            name: "quitUserAccount",
            type: "entityEdit/saveEntityData",
            editView: "upgradeAccount",
            successCallback: 'quitUserAccountCallback'
        },
        {
            name: "changePassword",
            type: "entityEdit/saveEntityData",
            editView: "changePasswordView"
        },
        {
            name: "sendSms",
            type: "entityEdit/saveEntityData",
            editView: "changeCellView",
            successCallback: "sendSmsSuccess",
            failedCallback: "sendSmsFailed"
        },
        {
            name: "changeCell",
            type: "entityEdit/saveEntityData",
            editView: "changeCellView",
            successCallback: "changeCellSuccess",
            failedCallback: "sendSmsFailed"
        },
        {
            name: "getFavorites",
            type: "dataGridView/searchQuery",
            dataGridView: "favoritesDataGridView1"
        },
        {
            name: "showSalesInfo",
            type: "dialog/showDialogLookData",
            dialogView: 'infoView',
            lookView: "infoView2"
        },
        {
            name: "showServiceFlow",
            type: "dialog/showDialogLookData",
            dialogView: 'serviceFlowView',
            lookView: "serviceFlowView2"
        },
        {
            name: "getLabUser",
            type: "entityEdit/getEntityData",
            editView: "userDetailView",
            setGetEntityDataLoad: 'setGetLabUserLoad'
        },
        {
            name: "getLabUser",
            type: "entityEdit/getEntityData",
            editView: "userDetailView",
        },
        {
            name: "passLabUserApply",
            type: "entityEdit/saveEntityData",
            editView: "userDetailView",
            successCallback: 'passLabUserApplyCallback'
        },
        {
            name: "rejectLabUserApply",
            type: "entityEdit/saveEntityData",
            editView: "userDetailView",
            successCallback: 'rejectLabUserApplyCallback'
        },
        {
            name: "back",
            type: "page/toPage",
            pageUrl: "/mine/index?tabPage=2"
        },
        {
            name: "backToJobList",
            type: "page/toPage",
            pageUrl: "/mine/index?tabPage=4"
        },
        {
            name: "getCollaborationInfo",
            type: "entityEdit/getEntityData",
            editView: "partnerLab",
            setGetEntityDataLoad: 'setGetCollaborationInfoLoad'
        },
        {
            name: "savePartnerLab",
            type: "entityEdit/saveEntityData",
            editView: "partnerLab",
            successCallback: 'savePartnerLabCallback'
        },
        {
            name: "searchJob",
            type: "dataGridView/searchQuery",
            dataGridView: "jobDataGridView"
        },
        {
            name: "addJob",
            type: "page/toPage",
            pageUrl: "/mine/index?tabPage=4&isAdd=true&title=" + escape('新建发布职位')
        },
        {
            name: "getJob",
            type: "entityEdit/getEntityData",
            editView: "jobEditView",
        },
        {
            name: "saveJob",
            type: "entityEdit/saveEntityData",
            editView: "jobEditView",
            successCallback: 'saveJobCallback'
        },
    ]
}

function getPhoneCodeAreaDataSource() {
    return {
        stateName: "getCountryCodeList",
        serviceName: "UserService",
        actionName: "getCountryCodeList",
        valueName: 'CountryCode',
        textName: 'CountryNameCn',
        payload: {
            formData: {
                Param: '{}',
                Act: 'Other_GetCountryCodeList'
            }
        }
    }
}

function getDialogViews() {
    return [getInfoView(), getServiceFlowView()]
}

function getServiceFlowView() {
    return {
        id: createGuid(),
        dialogId: createGuid(),
        name: "serviceFlowView",
        type: "View",
        className: 'divDialog',
        wrapClassName: 'divWrapDialog',
        dialogTitle: '售后服务流程',
        properties: [getServiceFlowView2()]
    }
}

function getServiceFlowView2() {
    return {
        name: "serviceFlowView2",
        type: "View",
        entity: {},
        isClear: true,
        properties: [
            getHtmlContent('SysValue02', 'divContent')
        ]
    }
}


function getInfoView() {
    return {
        id: createGuid(),
        dialogId: createGuid(),
        name: "infoView",
        type: "View",
        className: 'divDialog',
        wrapClassName: 'divWrapDialog',
        dialogTitle: 'HORIBA售后',
        properties: [getInfoView2()]
    }
}

function getInfoView2() {
    return {
        name: "infoView2",
        type: "View",
        entity: {},
        isClear: true,
        properties: [
            getHtmlContent('SysValue04', 'divContent')
        ]
    }
}
