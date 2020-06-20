const appAccount = require("../../entities/appAccount");
const { getButton, assignProporties, getTextBox, getSelect } = require("../../Common");

//systemManage/appAccountList 100-199
const dataActionTypes = {
    //搜索查询
    searchQuery: 100,
    //删除实体数据
    deleteEntityData: 101,
    //Excel导出
    excelExport: 102,
    //更新状态
    updateAppAccountStatus: 103
};

const { name, primaryKey, viewName } = appAccount;
const entity = { name, primaryKey, viewName };

module.exports = {
    name: "appAccountList",
    type: "View",
    eventActions: getEventActions(),
    properties: assignProporties({ name: "appAccountList" }, [getSearchOperationView(), getDataGridView()])
}

function getSearchOperationView() {
    return {
        name: "searchOperationView1",
        entity: entity,
        type: "RowsColsView",
        className: "divSerachView",
        properties: assignProporties({ name: "appAccountList" }, [
            getEditSelect("Status", "状态", appAccount.StatusDataSource, 1, 1),
            {
                ...getTextBox2("keyword", "关键字", 1, 3, "", "访问路径/公司名/联系人/手机"), propertyName: "PathName,CompanyName,Linkman,Phone",
                operateLogic: "like", pressEnterEventActionName: "searchQuery"
            },
            { ...getButton("search", "搜索", "primary", 1, 4), isFormItem: true, Icon: "search", eventActionName: "searchQuery", pressEnterEventActionName: "searchQuery" },
            { ...getButton("clearQuery", "清空", "default", 1, 5), isFormItem: true, eventActionName: "clearQuery" },
            { eventActionName: "toEditPage", ...getButton("toEditPage", "新增", "primary", 2, 1), style: { marginLeft: 16, marginBottom: 16 } },
            { eventActionName: "editAppAccount", colStyle: { paddingLeft: 0 }, ...getButton("editAppAccount", "修改", "default", 2, 2) },
            {
                eventActionName: "deleteAppAccount",
                colStyle: { paddingLeft: 0 },
                dataActionType: dataActionTypes.deleteEntityData,
                successTip: "删除成功！",
                confirmTip: "请确认是否删除当前App账号？",
                ...getButton("deleteAppAccount", "删除", "default", 2, 4)
            },
            { eventActionName: "excelExport", title: "App账号", ...getButton("excelExport", "Excel导出", "default", 2, 5), Icon: "download", colStyle: { paddingLeft: 0 } }
        ])
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
        colSpan: 8,
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
        properties: assignProporties(appAccount, ["CompanyName", "PathName", "Address", "Linkman", "Phone", "statusName",
            { name: "CreateDate", OrderByType: "desc" }, getOperation(), { name: "RowVersion", isVisible: false }, { name: "Status", isVisible: false }])
    }
}

function getOperation() {
    return {
        name: "operation",
        label: "操作",
        isData: false,
        actionList: assignProporties(appAccount, [getUpdateAppAccountStatusAction(1), getUpdateAppAccountStatusAction(2)])
    }
}

function getUpdateAppAccountStatusAction(status) {
    return {
        name: "updateAppAccountStatus",
        valueName: "Status",
        dataValue: status,
        label: status === 1 ? "关闭" : "启用",
        eventActionName: "updateAppAccountStatus",
        type: "Popconfirm",
        dataActionType: dataActionTypes.updateAppAccountStatus,
        successTip: "操作成功！",
        title: "请确认是否" + (status === 1 ? "关闭" : "启用") + "当前App账号？"
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
        pageUrl: "/systemManage/appAccountEdit"
    },
    {
        name: "editAppAccount",
        type: "dataGridView/selectRowToPage",
        dataGridView: "dataGridView1",
        pageUrl: "/systemManage/appAccountEdit?AppAccountId=#{AppAccountId}&menuName=" + escape("修改")
    },
    {
        name: "updateAppAccountStatus",
        type: "dataGrid/batchUpdateRowDataList",
        dataGridView: "dataGridView1"
    },
    {
        name: "deleteAppAccount",
        type: "dataGrid/batchUpdateRowDataList",
        dataGridView: "dataGridView1"
    }]
}
