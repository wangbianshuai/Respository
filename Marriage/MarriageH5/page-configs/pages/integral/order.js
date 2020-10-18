const { getHtmlContent } = require('../../common');

//integral/order 2800-2899
const dataActionTypes = {
    //get entity data
    getEntityData: 2800,
    //Save entity data
    saveEntityData: 2801,
};

const entity = { name: 'Order', primaryKey: 'UID' };

module.exports = {
    name: "order",
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
        name: "orderEdit",
        type: "View",
        isDiv: true,
        className: 'divDetail2',
        entity: entity,
        eventActionName: "getEntityData",
        formData: {
            Param: {},
            Act: 'Gifts_GetSingleGiftBillInfo',
            dataPrimaryKey: 'GiftBillUID'
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
        tabs: [{ title: '礼品中心', url: "/gift/index?tabPage=0" },
        { title: '购物车', url: "/gift/index?tabPage=1" },
        { title: '订单中心', url: "/gift/index?tabPage=2" }]
    }
}

function getProperties() {
    return [
        { name: 'Gifts', type: 'giftDetail' },
        { ...getLeftRightSpan('Status', '状态', false), dataSource: getStatusDataSource() },
        getLeftRightSpan('Recipient', '收件人', false),
        getLeftRightSpan('CityName', '城市', false),
        getLeftRightSpan('Address', '地址', false),
        getLeftRightSpan('Phone', '电话', false),
        getLeftRightSpan('Remark', '备注', false),
        { name: 'whiteSpace30', type: 'WhiteSpace', className: 'whiteSpace30', style: { marginBottom: '2rem' } }
    ]
}

function getStatusDataSource() {
    return [
        { value: 0, text: '审核中' },
        { value: 10, text: '审核不通过' },
        { value: 100, text: '审核通过' }
    ]
}

function getLeftRightSpan(name, label, isVisible) {
    return {
        name, label, type: 'LeftRightSpan', className: 'divLeftRightSpan',
        isListItem: true, isVisible
    }
}


function getEventActions() {
    return [{
        name: "getEntityData",
        type: "entityEdit/getEntityData",
        editView: "orderEdit",
        setGetEntityDataLoad: 'setGetEntityDataLoad'
    }]
}

