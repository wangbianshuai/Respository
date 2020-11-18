const marriageMakePair2 = require("../../entities/marriageMakePair2");
const { getButton, assignProporties, getTextBox, createGuid, getSelect2, getDatePicker } = require("../../Common");

//marriageManage/marriageMakePairList 1600-1699
const dataActionTypes = {
    //搜索查询
    searchQuery: 1600,
    //删除实体数据
    deleteEntityData: 1601,
    //Excel导出
    excelExport: 1602,
    //创建相亲安排
    createMarriageArrange: 1603,
    //获取实体数据
    getMarriageMakePairsDetails: 1604,
    //获取实体数据
    getMarriageMakePairsDetails2: 1605
};

const { name, primaryKey, viewName } = marriageMakePair2;
const entity = { name, primaryKey, viewName };

const detailItem = { name: "MarriageMakePairDetail", primaryKey: 'DetailId' }

module.exports = {
    name: "marriageMakePair2List",
    type: "View",
    dialogViews: getDialogViews(),
    eventActions: getEventActions(),
    properties: assignProporties({ name: "marriageMakePair2List" }, [getSearchOperationView(), getDataGridView()])
}

function getSearchOperationView() {
    return {
        name: "searchOperationView1",
        entity: entity,
        type: "RowsColsView",
        className: "divSerachView",
        properties: assignProporties({ name: "marriageMakePair2List" }, [
            {
                ...getTextBox2("keyword", "关键字", 1, 2, "", "男方/女方/红娘/编号"), propertyName: "ManUserName,WomanUserName,ManMatchmakerName,WomanMatchmakerName,ArrangeId",
                operateLogic: "like", pressEnterEventActionName: "searchQuery", pressEnterEventPropertyName: "search",
            },
            { ...getButton("search", "搜索", "primary", 1, 3), isFormItem: true, icon: "search", eventActionName: "searchQuery", pressEnterEventActionName: "searchQuery" },
            { ...getButton("clearQuery", "清空", "default", 1, 4), isFormItem: true, eventActionName: "clearQuery" }
        ])
    }
}

function getTextBox2(name, label, x, y, contorlType, placeHolder, maxLength) {
    return {
        ...getTextBox(name, label, contorlType, x, y, placeHolder, maxLength || 50),
        isFormItem: true,
        colSpan: 8,
        labelCol: 8,
        wrapperCol: 16,
        isNullable: true,
        isCondition: true
    }
}

function getDataGridView() {
    return {
        name: "dataGridView1",
        entity,
        type: "DataGridView",
        entitySearchQuery: dataActionTypes.searchQuery,
        eventActionName: "searchQuery",
        isDiv: true,
        className: "divInfoView3",
        properties: assignProporties(marriageMakePair2, ["ManUserName", "ManMatchmakerName", getPercentValue(),
            "WomanUserName", "WomanMatchmakerName", getPercentValue2(), "PercentValue3", { name: "CreateDate3", OrderByType: "desc" }, "ArrangeId",
            { name: 'ManUserId', isVisible: false }, { name: 'WomanUserId', isVisible: false },
            { name: 'MakePairId2', isVisible: false },
            { name: 'ManMatchmakerId', isVisible: false }, { name: 'WomanMatchmakerId', isVisible: false },
            , getOperation(),])
    }
}

function getPercentValue() {
    return {
        name: "PercentValue",
        label: "女方匹配男方(%)",
        action: {
            name: "lookMakePairDetail",
            eventActionName: "lookMakePairDetail",
            type: "AButton"
        }

    }
}

function getPercentValue2() {
    return {
        name: "PercentValue2",
        label: "男方匹配女方(%)",
        action: {
            name: "lookMakePairDetail2",
            eventActionName: "lookMakePairDetail2",
            type: "AButton"
        }

    }
}

function getOperation() {
    return {
        name: "ArrangeLabel",
        label: "操作",
        action: {
            name: "createMarriageArrange",
            eventActionName: "createMarriageArrange",
            type: "AButton"
        }

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
        name: "createMarriageArrange",
        type: "dialog/showDialogEditEntityData",
        dialogView: "createMarriageArrangeView",
        dataGridView: "dataGridView1",
        editView: 'createMarriageArrangeView'
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
        name: "lookMakePairDetail",
        type: "dialog/showDialogLookData",
        dialogView: "lookMakePairDetailView",
        lookView: "lookMakePairDetailView"
    },
    {
        name: "getMarriageMakePairsDetails",
        type: "entityEdit/getEntityData",
        editView: "lookMakePairDetailView"
    },
    {
        name: "lookMakePairDetail2",
        type: "dialog/showDialogLookData",
        dialogView: "lookMakePairDetailView2",
        lookView: "lookMakePairDetailView2"
    },
    {
        name: "getMarriageMakePairsDetails2",
        type: "entityEdit/getEntityData",
        editView: "lookMakePairDetailView2"
    }]
}

function getDialogViews() {
    return [
        getCreateMarriageArrangeView(),
        getLookMakePairDetailView(),
        getLookMakePairDetailView2()
    ]
}

function getCreateMarriageArrangeView() {
    return {
        id: createGuid(),
        dialogId: createGuid(),
        name: "createMarriageArrangeView",
        entity: { name: 'MarriageArrange', primaryKey: 'MarriageArrangeId' },
        type: "RowsColsView",
        dialogTitle: "创建相亲安排",
        dialogWidth: 600,
        isSetData: true,
        className: "divView2",
        saveEntityDataActionType: dataActionTypes.createMarriageArrange,
        dialogStyle: { height: 560, overflow: "auto" },
        properties: assignProporties(marriageMakePair2, [
            getTextBox4("ManUserName", "男方", 1, 1, true),
            getTextBox4("WomanUserName", "女方", 2, 1, true),
            getEditSelect2("AppMatchmakerId", "平台红娘", 3, 1, marriageMakePair2.appMatchmakerDataSource, false, "请输入平台红娘"),
            getDatePicker2("MarriageDate", "相亲时间", 4, 1, "", "请选择相亲时间", 10, false),
            getTextBox4("MarriageAddress", "相亲地点", 5, 1, false, true, "相亲地址", '', 100),
            getTextArea("MarriageContent", "相亲情况", 6, 1, '相亲情况', 500),
            getTextArea("Remark", "备注", 7, 1, '备注', 200),
        ])
    }
}

function getTextArea(name, label, x, y, placeHolder, maxLength) {
    return {
        ...getTextBox(name, label, "TextArea", x, y),
        isFormItem: true,
        isNullable: true,
        isEdit: true,
        colSpan: 24,
        Rows: 3,
        maxLength,
        placeHolder,
        labelCol: 5,
        wrapperCol: 18,
    }
}

function getDatePicker2(name, label, x, y, isNullable, placeHolder, defaultValue) {
    return {
        ...getDatePicker(name, label, x, y, defaultValue),
        isFormItem: true,
        colSpan: 24,
        labelCol: 5,
        wrapperCol: 18,
        isNullable,
        placeHolder,
        isEdit: true,
        isCurrentDay: true
    }
}

function getEditSelect2(name, label, x, y, serviceDataSrouce, isNullable, placeHolder) {
    return {
        ...getSelect2(name, label, serviceDataSrouce, x, y),
        isFormItem: true,
        colSpan: 24,
        labelCol: 5,
        wrapperCol: 18,
        isNullable,
        placeHolder,
        isEdit: true
    }
}

function getTextBox4(name, label, x, y, isReadOnly, isNullable, placeHolder, dataType, maxLength, contorlType) {
    return {
        ...getTextBox(name, label, contorlType, x, y, placeHolder, maxLength || 50),
        isFormItem: true,
        isEdit: true,
        colSpan: 24,
        dataType,
        labelCol: 5,
        isNullable,
        wrapperCol: 18,
        isReadOnly
    }
}

function getLookMakePairDetailView() {
    return {
        id: createGuid(),
        dialogId: createGuid(),
        name: "lookMakePairDetailView",
        entity,
        type: "View",
        dialogTitle: "#{ManUserName}与#{WomanUserName}匹配详情",
        dialogWidth: 1060,
        eventActionName: "getMarriageMakePairsDetails",
        getEntityDataActionType: dataActionTypes.getMarriageMakePairsDetails,
        dialogStyle: { height: 520, overflow: "auto" },
        properties: assignProporties(marriageMakePair2, [
            getComplexView()
        ])
    }
}

function getLookMakePairDetailView2() {
    return {
        id: createGuid(),
        dialogId: createGuid(),
        name: "lookMakePairDetailView2",
        entity: { name: 'MarriageMakePair2', primaryKey: 'MakePairId2' },
        type: "View",
        dialogTitle: "#{WomanUserName}与#{ManUserName}匹配详情",
        dialogWidth: 1060,
        eventActionName: "getMarriageMakePairsDetails2",
        getEntityDataActionType: dataActionTypes.getMarriageMakePairsDetails2,
        dialogStyle: { height: 520, overflow: "auto" },
        properties: assignProporties(marriageMakePair2, [
            getComplexView()
        ])
    }
}

function getComplexView() {
    return {
        name: "Details",
        type: "DataGridView",
        x: 1,
        y: 1,
        isComplexEntity: true,
        isPaging: false,
        entity: detailItem,
        isDiv: true,
        className: "divInfoView3",
        properties: assignProporties(detailItem, [{ name: 'ConditionTypeName', label: '类型' },
        { name: 'ConditionItemTitle', label: '标题' },
        { name: 'SelfSelectValue', label: '择偶标准选择值' },
        { name: 'OtherSideSelectValue', label: '对方条件选择值' },
        { name: 'PercentValueName', label: '匹配度(%)' }
        ])
    }
}