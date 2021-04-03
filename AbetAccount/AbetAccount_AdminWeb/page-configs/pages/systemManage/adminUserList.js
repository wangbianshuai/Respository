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

const { name, primaryKey, viewName } = adminUser;
const entity = { name, primaryKey, viewName };

module.exports = {
    name: "adminUserList",
    type: "View",
    eventActions: getEventActions(),
    properties: assignProporties({ name: "adminUserList" }, [getSearchOperationView(), getAlert(), getDataGridView()])
}

function getSearchOperationView() {
    return {
        name: "searchOperationView1",
        entity: entity,
        type: "RowsColsView",
        className: "divLeftRightView",
        properties: assignProporties({ name: "adminUserList" }, [{ eventActionName: "toEditPage", ...getButton("toEditPage", "新增", "primary", 1, 1) },
        { eventActionName: "editAdminUser", colStyle: { paddingLeft: 0 }, ...getButton("editAdminUser", "修改", "default", 1, 2) },
        {
            eventActionName: "deleteAdminUser",
            colStyle: { paddingLeft: 0 },
            dataActionType: dataActionTypes.deleteEntityData,
            successTip: "删除成功！",
            confirmTip: "请确认是否删除当前用户？",
            ...getButton("deleteAdminUser", "删除", "default", 1, 4)
        },
        getKeyword()
        ])
    }
}

function getKeyword() {
    const p = getTextBox("keyword", "", "Search", 2, 3, "请输入关键字")
    p.colStyle = { paddingRight: 8, paddingLeft: 2 };
    p.isCondition = true;
    p.propertyName = "LoginName,UserName";
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
        name: "dataGridView1",
        entity: entity,
        type: "DataGridView",
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
        searchView: "searchOperationView1",
        searchButton: "keyword",
        dataGridView: "dataGridView1",
        alertMessage: "alertMessage"
    },
    {
        name: "toEditPage",
        type: "page/toPage",
        pageUrl: "/systemManage/adminUserEdit"
    },
    {
        name: "editAdminUser",
        type: "dataGridView/selectRowToPage",
        dataGridView: "dataGridView1",
        alertMessage: "alertMessage",
        pageUrl: "/systemManage/adminUserEdit?UserId=#{UserId}&menuName=" + encodeURIComponent("修改")
    },
    {
        name: "deleteAdminUser",
        type: "dataGrid/batchUpdateRowDataList",
        dataGridView: "dataGridView1",
        alertMessage: "alertMessage"
    }]
}
