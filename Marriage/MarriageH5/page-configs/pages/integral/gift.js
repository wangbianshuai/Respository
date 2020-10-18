const {getHtmlContent } = require('../../common');

//integral/gift 2700-2799
const dataActionTypes = {
    //get entity data
    getEntityData: 2700,
    //Save entity data
    saveEntityData: 2701,
    //addCart
    addCart: 2702
};

const entity = { name: 'Gift', primaryKey: 'UID' };

module.exports = {
    name: "gift",
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
        name: "giftEdit",
        type: "View",
        isDiv: true,
        className: 'divDetail2',
        entity: entity,
        eventActionName: "getEntityData",
        formData: {
            Param: {},
            Act: 'Gifts_GetSingleGiftInfo',
            dataPrimaryKey: 'GiftUID'
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
        { name: 'giftInfo', type: 'giftInfo', addCartEventActionName: 'addCart', saveEntityDataActionType: dataActionTypes.addCart },
        getHtmlContent('Contents', 'divContent')
    ]
}

function getEventActions() {
    return [{
        name: "getEntityData",
        type: "entityEdit/getEntityData",
        editView: "giftEdit"
    },
    {
        name: "addCart",
        type: "entityEdit/saveEntityData",
        editView: "giftEdit",
        successCallback: 'addCartSuccess'
    }]
}

