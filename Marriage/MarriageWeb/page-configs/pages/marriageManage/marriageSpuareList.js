const marriageSquare2 = require("../../entities/marriageSquare2");
const { getButton, assignProporties, getTextBox, createGuid } = require("../../Common");

//marriageManage/marriageSquareList 1400-1499
const dataActionTypes = {
    //搜索查询
    searchQuery: 1400,
    //删除实体数据
    deleteEntityData: 1401,
    //Excel导出
    excelExport: 1402,
    //创建相亲安排
    createMarriageArrange: 1403
};

const { name, primaryKey, viewName } = marriageSquare2;
const entity = { name, primaryKey, viewName };

module.exports = {
    name: "marriageSquare2List",
    type: "View",
    dialogViews: getDialogViews(),
    eventActions: getEventActions(),
    properties: assignProporties({ name: "marriageSquare2List" }, [getSearchOperationView(), getDataGridView()])
}

function getSearchOperationView() {
    return {
        name: "searchOperationView1",
        entity: entity,
        type: "RowsColsView",
        className: "divSerachView",
        properties: assignProporties({ name: "marriageSquare2List" }, [
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
        properties: assignProporties(marriageSquare2, ["ManUserName", "ManMatchmakerName", "RoseCount", "UpdateDate",
            "WomanUserName", "WomanMatchmakerName", "RoseCount2", "UpdateDate2", "ArrangeId",
            { name: "UpdateDate3", OrderByType: "desc", isVisible: false }, getOperation(),])
    }
}

function getOperation() {
    return {
        name: "operation",
        label: "操作",
        eventActionName: "createMarriageArrange",
        type: "AButton"
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
    }]
}

function getDialogViews() {
    return [
        getCreateMarriageArrangeView()
    ]
}

function getCreateMarriageArrangeView() {
    return {
        id: createGuid(),
        dialogId: createGuid(),
        name: "createMarriageArrangeView",
        entity,
        type: "RowsColsView",
        dialogTitle: "创建相亲安排",
        dialogWidth: 600,
        className: "divView2",
        setSelectValuesOkActionType: dataActionTypes.createMarriageArrange,
        dialogStyle: { height: 460, overflow: "auto" },
        properties: assignProporties(marriageSquare2, [
            getTextBox4("ManMatchmakerName", "男方红娘", 1, 1, true),
            getTextBox4("WomanMatchmakerName", "女方红娘", 3, 1, true),
        ])
    }
}
