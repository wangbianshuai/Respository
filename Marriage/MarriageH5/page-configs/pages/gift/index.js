const { getTextBox, getSelect2, getButton } = require('../../common');

//gift/index 2600-2699
const dataActionTypes = {
    //搜索查询 全部
    searchQuery: 2600,
    //订单
    searchOrder: 2601,
    //创建订单
    createOrder: 2602
};

const entity = { name: 'Gift', primaryKey: 'UID' };

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
            getTabView('giftDataGridView1', '礼品中心', 'searchQuery', dataActionTypes.searchQuery, {
                Param: { GiftIndex: "DateTimeDesc" },
                Act: 'Gifts_GetGiftsList'
            }, '/integral/gift?tabPage=0', 'GiftItem', 'divGiftGridView'),
            getCartView(),
            getTabView('orderDataGridView1', '订单中心', 'searchOrder', dataActionTypes.searchOrder, {
                Param: {},
                Act: 'Gifts_GetGiftBillList'
            }, '/integral/order?tabPage=2', 'OrderItem', 'divDataGridView2'),
        ]
    }
}

function getCartView() {
    return {
        name: "cartView",
        type: 'View',
        isDiv: true,
        className: 'divCartView',
        tabLabel: '购物车',
        properties: [getCart(), getBookView()]
    }
}

function getBookView() {
    return {
        name: "bookView",
        type: "View",
        entity,
        isVisible: false,
        isList: true,
        className: 'divLogin',
        properties: getBookProperties()
    }
}

function getBookProperties() {
    return [
        {
            name: 'NeedDelivery', type: 'CheckBox', isListItem: true, dataType: 'bool', defaultValue: 1, text: '需要快递', isEdit: true, rowClassName: "divRow2", x: 1, y: 1,
            valueVisibleProperties: { 0: ['Remark'], 1: ['Recipient', 'CityUID', 'Address', 'Phone', 'Remark'] }
        },
        getTextBox2('Recipient', '收件人', '', 1, 1, '请输入收件人', 50, false),
        { ...getSelectPicker2('CityUID', '城市', getCityServiceDataSource(), 10, 1), type: 'CountryProvinceCity' },
        getTextBox2('Address', '地址', '', 1, 1, '请输入地址', 100, false),
        getTextBox2('Phone', '电话', '', 1, 1, '请输入电话', 50, false),
        getTextBox2('Remark', '备注', 'textarea', 1, 1, '可选填', 500, true),
        { ...getButton('save', '确认', 'primary', 14, 1), divClassName: "divRow3", isDiv: true, saveEntityDataActionType: dataActionTypes.createOrder, className: 'loginButton', eventActionName: 'createOrder' }
    ]
}

function getSelectPicker2(name, label, serviceDataSource, x, y) {
    return { ...getSelect2(name, label, serviceDataSource, x, y), isEdit: true, isNullable: false, isRed: true }
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

function getTextBox2(name, label, controlType, x, y, placeHorder, maxLength, isNullable) {
    return { ...getTextBox(name, label, controlType, x, y, placeHorder, maxLength), isEdit: true, clear: true, isNullable, isRed: !isNullable }
}

function getCart() {
    return {
        name: 'cart',
        type: 'giftCart',
        listName: 'List',
        serviceDataSource: getGiftCartServiceDataSource()
    }
}

function getGiftCartServiceDataSource() {
    return {
        stateName: "getGiftCart",
        serviceName: "GiftService",
        actionName: "getGiftCart",
        isRefresh: true,
        payload: {
            formData: {
                Param: '{}',
                Act: 'Gifts_GetGiftsListInCart'
            }
        }
    }
}

function getEventActions() {
    return [
        {
            name: "searchQuery",
            type: "dataGridView/searchQuery",
            dataGridView: "giftDataGridView1"
        },
        {
            name: "searchOrder",
            type: "dataGridView/searchQuery",
            dataGridView: "industryDataGridView1"
        },
        {
            name: "createOrder",
            type: "entityEdit/saveEntityData",
            editView: "bookView",
            successCallback: 'createOrderSuccess'
        }
    ]
}

function getTabView(name, tabLabel, eventActionName, entitySearchQuery, formData, detailPageUrl, itemType, className) {
    return {
        name,
        tabLabel,
        type: "DataGridView",
        properties: [],
        entity,
        formData,
        entitySearchQuery,
        eventActionName,
        detailPageUrl,
        actionName: eventActionName,
        className,
        itemType
    }
}