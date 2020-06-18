const AppAccount = require("../../entities/AppAccount");
const { getButton, assignProporties, getTextBox, getSelect } = require("../../Common");

//systemManage/AppAccountList 100-199
const dataActionTypes = {
    //搜索查询
    searchQuery: 100,
    //删除实体数据
    deleteEntityData: 101,
    //Excel导出
    excelExport: 102,
    //更新状态
    UpdateAppAccountStatus: 103
};

const entity = { name: AppAccount.name, primaryKey: AppAccount.primaryKey, viewName: "ViewAppAccount" }

module.exports = {
    name: "AppAccountList",
    type: "view",
    eventActions: getEventActions(),
    properties: assignProporties({ name: "AppAccountList" }, [getSearchOperationView(), getDataGridView()])
}

function getSearchOperationView() {
    return {
        name: "SearchOperationView1",
        entity: entity,
        type: "RowsColsView",
        className: "DivSerachView",
        properties: assignProporties({ name: "AppAccountList" }, [
            getEditSelect("Status", "状态", AppAccount.StatusDataSource, 1, 1),
            {
                ...getTextBox2("Keyword", "关键字", 1, 3, "", "访问路径/公司名/联系人/手机"), propertyName: "PathName,CompanyName,Linkman,Phone",
                operateLogic: "like", pressEnterEventActionName: "searchQuery"
            },
            { ...getButton("Search", "搜索", "primary", 1, 4), isFormItem: true, Icon: "search", eventActionName: "searchQuery", pressEnterEventActionName: "searchQuery" },
            { ...getButton("ClearQuery", "清空", "default", 1, 5), isFormItem: true, eventActionName: "ClearQuery" },
            { eventActionName: "ToEditPage", ...getButton("ToEditPage", "新增", "primary", 2, 1), style: { marginLeft: 16, marginBottom: 16 } },
            { eventActionName: "EditAppAccount", colStyle: { paddingLeft: 0 }, ...getButton("EditAppAccount", "修改", "default", 2, 2) },
            {
                eventActionName: "DeleteAppAccount",
                colStyle: { paddingLeft: 0 },
                dataActionType: dataActionTypes.deleteEntityData,
                SuccessTip: "删除成功！",
                ConfirmTip: "请确认是否删除当前App账号？",
                ...getButton("DeleteAppAccount", "删除", "default", 2, 4)
            },
            { eventActionName: "excelExport", Title: "App账号", ...getButton("excelExport", "Excel导出", "default", 2, 5), Icon: "download", colStyle: { paddingLeft: 0 } }
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
        name: "DataGridView1",
        entity: entity,
        type: "dataGridView",
        entitySearchQuery: dataActionTypes.searchQuery,
        EntityExcelExport: dataActionTypes.excelExport,
        eventActionName: "searchQuery",
        isDiv: true,
        className: "DivInfoView3",
        isRowSelection: true,
        isSingleSelection: true,
        properties: assignProporties(AppAccount, ["CompanyName", "PathName", "Address", "Linkman", "Phone", "StatusName",
            { name: "CreateDate", OrderByType: "desc" }, getOperation(), { name: "RowVersion", isVisible: false }, { name: "Status", isVisible: false }])
    }
}

function getOperation() {
    return {
        name: "Operation",
        label: "操作",
        isData: false,
        actionList: assignProporties(AppAccount, [getUpdateAppAccountStatusAction(1), getUpdateAppAccountStatusAction(2)])
    }
}

function getUpdateAppAccountStatusAction(status) {
    return {
        name: "UpdateAppAccountStatus",
        ValueName: "Status",
        DataValue: status,
        label: status === 1 ? "关闭" : "启用",
        eventActionName: "UpdateAppAccountStatus",
        type: "Popconfirm",
        dataActionType: dataActionTypes.UpdateAppAccountStatus,
        SuccessTip: "操作成功！",
        Title: "请确认是否" + (status === 1 ? "关闭" : "启用") + "当前App账号？"
    }
}

function getEventActions() {
    return [{
        name: "searchQuery",
        type: "dataGridView/searchQuery",
        searchView: "SearchOperationView1",
        searchButton: "Search",
        dataGridView: "DataGridView1"
    },
    {
        name: "ClearQuery",
        type: "dataGridView/searchQuery",
        searchView: "SearchOperationView1",
        searchButton: "ClearQuery",
        dataGridView: "DataGridView1",
        isClearQuery: true
    },
    {
        name: "excelExport",
        type: "dataGridView/excelExport",
        dataGridView: "DataGridView1"
    },
    {
        name: "ToEditPage",
        type: "Page/ToPage",
        pageUrl: "/systemManage/AppAccountEdit"
    },
    {
        name: "EditAppAccount",
        type: "dataGridView/SelectRowToPage",
        dataGridView: "DataGridView1",
        pageUrl: "/systemManage/AppAccountEdit?AppAccountId=#{AppAccountId}&MenuName=" + escape("修改")
    },
    {
        name: "UpdateAppAccountStatus",
        type: "DataGrid/BatchUpdateRowDataList",
        dataGridView: "DataGridView1"
    },
    {
        name: "DeleteAppAccount",
        type: "DataGrid/BatchUpdateRowDataList",
        dataGridView: "DataGridView1"
    }]
}
