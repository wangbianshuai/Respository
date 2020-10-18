const user = require("../../entities/user");
const { getButton, assignProporties, getTextBox, getSelect, getSelect2, createGuid } = require("../../Common");

//systemManage/userList 1500-1599
const dataActionTypes = {
    //搜索查询
    searchQuery: 1500,
    //删除实体数据
    deleteEntityData: 1501,
    //Excel导出
    excelExport: 1502,
    //setUserTag打标签
    setUserTag: 1503,
    //cancelUserTag:取消标签
    cancelUserTag: 1504,
    //syncWeChatUser同步微信
    syncWeChatUser: 1505
};

const { name, primaryKey, viewName } = user;
const entity = { name, primaryKey, viewName, expandMethods: { searchQuery: 'Select2', excelExport: "ExcelExport" } };

module.exports = {
    name: "userList",
    type: "View",
    dialogViews: getDialogViews(),
    eventActions: getEventActions(),
    properties: assignProporties({ name: "userList" }, [getSearchOperationView(), getDataGridView()])
}

function getSearchOperationView() {
    return {
        name: "searchOperationView1",
        entity: entity,
        type: "RowsColsView",
        className: "divSerachView",
        properties: assignProporties({ name: "userList" }, [
            getEditSelect("Sex", "性别", user.sexDataSource, 1, 1),
            getEditSelect2("UserTagId", "标签", user.userTagDataSource, 1, 2),
            {
                ...getTextBox2("OpenId", "OpenID", 1, 3, "", ""), pressEnterEventActionName: "searchQuery", pressEnterEventPropertyName: "search",
            },
            {
                ...getTextBox2("UnionId", "UnionID", 2, 1, "", ""), pressEnterEventActionName: "searchQuery", pressEnterEventPropertyName: "search",
            },
            {
                ...getTextBox2("keyword", "关键字", 2, 2, "", "昵称/省份/城市"), propertyName: "NickName,Province,City",
                operateLogic: "like", pressEnterEventActionName: "searchQuery", pressEnterEventPropertyName: "search",
            },
            { ...getButton("search", "搜索", "primary", 2, 3), isFormItem: true, icon: "search", eventActionName: "searchQuery", pressEnterEventActionName: "searchQuery" },
            { ...getButton("clearQuery", "清空", "default", 2, 4), isFormItem: true, eventActionName: "clearQuery" },
            { eventActionName: "setUserTag", ...getButton("setUserTag", "打标签", "primary", 3, 1), icon: 'tags', style: { marginLeft: 16, marginBottom: 16 } },
            { eventActionName: "cancelUserTag", colStyle: { paddingLeft: 0 }, ...getButton("cancelUserTag", "取消标签", "default", 3, 2), icon: 'delete' },
            { eventActionName: "excelExport", title: "粉丝用户", ...getButton("excelExport", "Excel导出", "default", 3, 4), icon: "download", colStyle: { paddingLeft: 0 } },
            {
                eventActionName: "syncWeChatUser", ...getButton("syncWeChatUser", "同步微信", "default", 3, 5), icon: "sync", confirmTip: '确定要同步微信用户列表数据吗？',
                dataActionType: dataActionTypes.syncWeChatUser, colStyle: { paddingLeft: 0 }, successTip: '同步成功！'
            }
        ])
    }
}


function getEditSelect2(name, label, dataSource, x, y, defaultValue) {
    return {
        ...getSelect2(name, label, dataSource, x, y, defaultValue),
        isFormItem: true,
        colSpan: 6,
        labelCol: 8,
        wrapperCol: 15,
        operateLogic: "=",
        isNullable: true,
        allowClear: true,
        isCondition: true
    }
}

function getEditSelect(name, label, dataSource, x, y, defaultValue) {
    return {
        ...getSelect(name, label, dataSource, x, y, defaultValue),
        isFormItem: true,
        colSpan: 6,
        labelCol: 8,
        wrapperCol: 15,
        operateLogic: "=",
        isNullable: true,
        allowClear: true,
        isCondition: true
    }
}

function getTextBox2(name, label, x, y, contorlType, placeHolder, maxLength) {
    return {
        ...getTextBox(name, label, contorlType, x, y, placeHolder, maxLength || 50),
        isFormItem: true,
        colSpan: 6,
        labelCol: 8,
        wrapperCol: 15,
        isNullable: true,
        isCondition: true
    }
}

function getDataGridView() {
    return {
        name: "dataGridView1",
        entity: entity,
        type: "DataGridView",
        entitySearchQuery: dataActionTypes.searchQuery,
        entityExcelExport: dataActionTypes.excelExport,
        eventActionName: "searchQuery",
        isDiv: true,
        className: "divInfoView3",
        isRowSelection: true,
        isSingleSelection: true,
        properties: assignProporties(user, [{ name: "HeadImgUrl", label: "头像", isImage: true, imageWidth: 100 }, "NickName", "SexName", "Province", "City", "OpenId", "UnionId", "UserTagNames", "Remark",
        { name: "UpdateDate", OrderByType: "desc" }])
    }
}

function getEventActions() {
    return [{
        name: "searchQuery",
        type: "dataGridView/searchQuery",
        searchView: "searchOperationView1",
        searchButton: "search",
        dataGridView: "dataGridView1"
    },
    {
        name: "clearQuery",
        type: "dataGridView/searchQuery",
        searchView: "searchOperationView1",
        searchButton: "clearQuery",
        dataGridView: "dataGridView1",
        isClearQuery: true
    },
    {
        name: "setUserTag",
        type: "dialog/selectViewDataToList",
        dialogView: "setUserTagView",
        dataProperties: ["UserTagId"],
        dataGridView: "dataGridView1"
    },
    {
        name: "cancelUserTag",
        type: "dialog/selectViewDataToList",
        dialogView: "cancelUserTagView",
        dataProperties: ["UserTagIds"],
        dataGridView: "dataGridView1"
    },
    {
        name: "syncWeChatUser",
        type: "dataGridView/syncData",
        dataGridView: "dataGridView1"
    },
    {
        name: "excelExport",
        type: "dataGridView/excelExport",
        dataGridView: "dataGridView1"
    }]
}


function getDialogViews() {
    return [
        getAddUserTagView(),
        getRemoveUserTagView()
    ]
}

function getAddUserTagView() {
    return {
        id: createGuid(),
        dialogId: createGuid(),
        name: "setUserTagView",
        entity,
        type: "RowsColsView",
        dialogTitle: "粉丝用户设置标签",
        dialogWidth: 400,
        successTip: "操作成功",
        className: "divView2",
        setSelectValuesOkActionType: dataActionTypes.setUserTag,
        dialogStyle: { height: 100, overflow: "auto" },
        properties: assignProporties(entity, [
            { ...getEditSelect3("UserTagId", "标签", user.userTagDataSource, 1, 2) }
        ])
    }
}

function getRemoveUserTagView() {
    return {
        id: createGuid(),
        dialogId: createGuid(),
        name: "cancelUserTagView",
        entity,
        type: "RowsColsView",
        dialogTitle: "取消粉丝用户标签",
        dialogWidth: 600,
        successTip: "操作成功",
        className: "divView2",
        setSelectValuesOkActionType: dataActionTypes.cancelUserTag,
        dialogStyle: { height: 400, overflow: "auto" },
        properties: assignProporties(entity, [
            getSignUserTag()
        ])
    }
}

function getSignUserTag() {
    return {
        name: "UserTagIds",
        type: "CheckBoxGroup",
        label: "已标记标签",
        isFormItem: true,
        colSpan: 24,
        labelCol: 4,
        wrapperCol: 20,
        isNullable: false,
        valueName: "UserTagId",
        textName: "Name",
        className: 'checkBoxGroup',
        nullTipMessage: "请选择需取消标签",
        isEdit: true,
    }
}

function getEditSelect3(name, label, dataSource, x, y, defaultValue) {
    return {
        ...getSelect2(name, label, dataSource, x, y, defaultValue),
        isFormItem: true,
        colSpan: 22,
        labelCol: 4,
        wrapperCol: 20,
        isEdit: true,
        isNullable: false,
    }
}