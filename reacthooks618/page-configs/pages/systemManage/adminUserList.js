const adminUser = require("../../entities/adminUser");
const { getButton, assignProporties, getTextBox } = require("../../Common");

//配置管理/用户 4300-4399
const dataActionTypes = {
    //搜索查询
    searchQuery: 4300,
    //删除实体数据
    deleteEntityData: 4301,
    //Excel导出
    excelExport: 4302
};

const entity = { name: adminUser.name, primaryKey: adminUser.primaryKey, viewName: "ViewAdminUser" }

module.exports = {
    name: "AdminUserList",
    type: "View",
    eventActions: getEventActions(),
    properties: assignProporties({ name: "AdminUserList" }, [getSearchOperationView(), getAlert(), getDataGridView()])
}

function getSearchOperationView() {
    return {
        name: "SearchOperationView1",
        entity: entity,
        type: "RowsColsView",
        className: "divLeftRightView",
        properties: assignProporties({ name: "AdminUserList" }, [{ eventActionName: "ToEditPage", ...getButton("ToEditPage", "新增", "primary", 1, 1) },
        { eventActionName: "EditAdminUser", colStyle: { paddingLeft: 0 }, ...getButton("EditAdminUser", "修改", "default", 1, 2) },
        {
            eventActionName: "DeleteAdminUser",
            colStyle: { paddingLeft: 0 },
            dataActionType: dataActionTypes.deleteEntityData,
            SuccessTip: "删除成功！",
            ConfirmTip: "请确认是否删除当前用户？",
            ...getButton("DeleteAdminUser", "删除", "default", 1, 4)
        },
        getKeyword()
        ])
    }
}

function getKeyword() {
    const p = getTextBox("Keyword", "", "Search", 2, 3, "请输入关键字")
    p.colStyle = { paddingRight: 8, paddingLeft: 2 };
    p.isCondition = true;
    p.propertyName = "LoginName,AdminUserName";
    p.operateLogic = "like";
    p.eventActionName = "searchQuery";
    p.pressEnterEventActionName = "searchQuery";
    p.colStyle = { width: 240 }
    return p;
}

function getAlert() {
    return {
        name: "alertMessage",
        type: "Alert"
    }
}

function getDataGridView() {
    return {
        name: "DataGridView1",
        entity: entity,
        type: "dataGridView",
        entitySearchQuery: dataActionTypes.searchQuery,
        eventActionName: "searchQuery",
        isDiv: true,
        className: "divInfoView3",
        isRowSelection: true,
        isSingleSelection: true,
        properties: assignProporties(adminUser, ["LoginName", "UserName", "LastLoginDate", { name: "CreateDate", OrderByType: "desc" }, { name: "RowVersion", isVisible: false }])
    }
}


function getEventActions() {
    return [{
        name: "searchQuery",
        type: "dataGridView/searchQuery",
        searchView: "SearchOperationView1",
        searchButton: "Keyword",
        dataGridView: "DataGridView1",
        alertMessage: "alertMessage"
    },
    {
        name: "ToEditPage",
        type: "Page/ToPage",
        pageUrl: "/systemManage/AdminUserEdit"
    },
    {
        name: "EditAdminUser",
        type: "dataGridView/SelectRowToPage",
        dataGridView: "DataGridView1",
        alertMessage: "alertMessage",
        pageUrl: "/systemManage/AdminUserEdit?AdminUserId=#{AdminUserId}&MenuName=" + escape("修改")
    },
    {
        name: "DeleteAdminUser",
        type: "DataGrid/BatchUpdateRowDataList",
        dataGridView: "DataGridView1",
        alertMessage: "alertMessage"
    }]
}
