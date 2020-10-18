const sendTemplateMessage = require("../../entities/sendTemplateMessage");
const { getButton, assignProporties, getTextBox, getSelect, getSelect2 } = require("../../Common");

//weChatManage/sendTemplateMessageList 1700-1799
const dataActionTypes = {
    //搜索查询
    searchQuery: 1700,
    //删除实体数据
    deleteEntityData: 1701,
    //Excel导出
    excelExport: 1702
};

const { name, primaryKey, viewName } = sendTemplateMessage;
const entity = { name, primaryKey, viewName };

module.exports = {
    name: "sendTemplateMessageList",
    type: "View",
    eventActions: getEventActions(),
    properties: assignProporties({ name: "sendTemplateMessageList" }, [getSearchOperationView(), getDataGridView()])
}

function getSearchOperationView() {
    return {
        name: "searchOperationView1",
        entity: entity,
        type: "RowsColsView",
        className: "divSerachView",
        properties: assignProporties({ name: "sendTemplateMessageList" }, [
            getEditSelect2("TemplateId", "微信消息模板", sendTemplateMessage.weChatTemplateDataSource, 1, 1),
            { ...getEditSelect2("UserTagIds", "粉丝标签", sendTemplateMessage.userTagDataSource, 1, 2), operateLogic: 'like' },
            getEditSelect("Status", "状态", sendTemplateMessage.statusDataSource, 2, 1),
            {
                ...getTextBox2("keyword", "关键字", 2, 2, "", "字体颜色/备注"), propertyName: "Color,Remark",
                operateLogic: "like", pressEnterEventActionName: "searchQuery", pressEnterEventPropertyName: "search",
            },
            { ...getButton("search", "搜索", "primary", 2, 3), isFormItem: true, icon: "search", eventActionName: "searchQuery", pressEnterEventActionName: "searchQuery" },
            { ...getButton("clearQuery", "清空", "default", 2, 4), isFormItem: true, eventActionName: "clearQuery" },
            { eventActionName: "toEditPage", ...getButton("toEditPage", "新增", "primary", 3, 1), style: { marginLeft: 16, marginBottom: 16 } },
            { eventActionName: "editEntityData", colStyle: { paddingLeft: 0 }, ...getButton("editEntityData", "修改", "default", 3, 2) },
            {
                eventActionName: "deleteEntityData",
                colStyle: { paddingLeft: 0 },
                dataActionType: dataActionTypes.deleteEntityData,
                successTip: "删除成功！",
                confirmTip: "请确认是否删除当前发送模板消息？",
                ...getButton("deleteEntityData", "删除", "default", 3, 4)
            },
            { eventActionName: "excelExport", title: "发送模板消息", ...getButton("excelExport", "Excel导出", "default", 3, 5), icon: "download", colStyle: { paddingLeft: 0 } }
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
        properties: assignProporties(sendTemplateMessage, ["WeChatTemplateName", "UserTagNames", "Color", "Remark", "StatusName",
            { name: "CreateDate", OrderByType: "desc" }, { name: "RowVersion", isVisible: false }])
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
        name: "excelExport",
        type: "dataGridView/excelExport",
        dataGridView: "dataGridView1"
    },
    {
        name: "toEditPage",
        type: "page/toPage",
        pageUrl: "/weChatManage/sendTemplateMessageEdit"
    },
    {
        name: "editEntityData",
        type: "dataGridView/selectRowToPage",
        dataGridView: "dataGridView1",
        pageUrl: "/weChatManage/sendTemplateMessageEdit?SendTemplateMessageId=#{SendTemplateMessageId}&menuName=" + escape("修改")
    },
    {
        name: "deleteEntityData",
        type: "dataGrid/batchUpdateRowDataList",
        dataGridView: "dataGridView1"
    }]
}
