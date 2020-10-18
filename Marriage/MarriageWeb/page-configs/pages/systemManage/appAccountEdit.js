const appAccount = require('../../entities/appAccount');
const { assignProporties, getTextBox, getButton } = require('../../Common');

//systemManage/appAccountEdit 200-299
const dataActionTypes = {
    //get entity data
    getEntityData: 200,
    //Save entity data
    saveEntityData: 201
}

const { name, primaryKey } = appAccount;
const entity = { name, primaryKey };

module.exports = {
    name: 'appAccountEdit',
    type: 'View',
    eventActions: getEventActions(),
    properties: assignProporties({ name: 'appAccountEdit' }, [getEditView()])
}

function getEditView() {
    return {
        name: 'appAccountEdit2',
        type: 'RowsColsView',
        entity: entity,
        isForm: true,
        eventActionName: 'getEntityData',
        isClear: true,
        saveEntityDataActionType: dataActionTypes.saveEntityData,
        getEntityDataActionType: dataActionTypes.getEntityData,
        properties: assignProporties(appAccount, getProperties())
    }
}

function getButtonProperties() {
    return [{
        name: 'leftSpace1',
        type: 'WhiteSpace',
        className: 'ant-col ant-col-10 ant-form-item-label'
    },
    { ...getButton('saveEntityData', '保存', 'primary'), eventActionName: 'saveEntityData', style: { width: 84 } },
    { ...getButton('backToLast', '返回', ''), eventActionName: 'backToLast', style: { marginLeft: 10 } }]
}

function getProperties() {
    return [
        getTextBox2('CompanyName', '公司名称', 1, 1, '', '请输入公司名称', 50, false),
        getTextBox2('AccessPathName', '访问路径名', 1, 2, '', '请输入访问路径名', 50, false),
        getTextBox2('LogoImageUrl', '公司Logo地址', 2, 1, '', '', 200, true),
        { ...getTextBox2('LogoImageDisplayWidth', 'Logo显示宽度', 2, 2, '', '', 3, true), dataType: 'int' },
        getTextBox2('SiteTitle', '站点标题', 3, 1, '', '', 50, true),
        getTextBox2('Address', '地址', 3, 2, '', '', 200, true),
        getTextBox2('Linkman', '联系人', 4, 1, '', '', 50, true),
        getTextBox2('Phone', '手机', 4, 2, '', '', 50, true),
        getTextBox2('AppId', '微信AppId', 5, 1, '', '请输入微信AppId', 50, false),
        { ...getTextBox2('ApiUrl', '服务地址', 5, 2, '', '', 50, true), isReadOnly: true },
        { ...getTextArea('Secret', '微信Secret', 6, 1, '请输入微信Secret', 100), isNullable: false },
        getTextArea('Remark', '备注', 6, 2, '', 200),
        getButtonView()
    ]
}
function getTextBox2(name, label, x, y, contorlType, placeHolder, maxLength, isNullable, isVisible, validateNames, validateTipMessage) {
    return {
        ...getTextBox(name, label, contorlType, x, y, placeHolder, maxLength || 50),
        validateNames, validateTipMessage,
        isFormItem: true,
        colSpan: 11,
        labelCol: 6,
        wrapperCol: 18,
        isNullable,
        isVisible,
        isEdit: true
    }
}

function getButtonView() {
    return {
        name: 'buttonView',
        type: 'View',
        className: 'divCenterButton',
        isDiv: true,
        isFormItem: true,
        colSpan: 24,
        x: 11,
        y: 1,
        properties: assignProporties({ name: 'appAccountEdit' }, getButtonProperties())
    }
}

function getTextArea(name, label, x, y, placeHolder, maxLength) {
    return {
        ...getTextBox(name, label, 'TextArea', x, y, placeHolder, maxLength),
        isFormItem: true,
        isNullable: true,
        isEdit: true,
        Rows: 3,
        colSpan: 11,
        labelCol: 6,
        wrapperCol: 18,
    }
}

function getEventActions() {
    return [{
        name: 'backToLast',
        type: 'page/toPage',
        pageUrl: '/systemManage/appAccountList',
        expandSetPageUrl: 'expandSetPageUrl'
    },
    {
        name: 'saveEntityData',
        type: 'entityEdit/saveEntityData',
        editView: 'appAccountEdit2',
        expandSetEntityData: 'expandSetEntityData'
    },
    {
        name: 'getEntityData',
        type: 'entityEdit/getEntityData',
        editView: 'appAccountEdit2'
    }]
}