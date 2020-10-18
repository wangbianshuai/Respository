const userTag = require("../../entities/userTag");
const { getButton, assignProporties, getTextBox } = require("../../Common");

//weChatManage/userTag 1300-1399
const dataActionTypes = {
    //搜索查询
    searchQuery: 1300,
    //删除实体数据
    deleteEntityData: 1301,
    //Excel导出
    excelExport: 1302
};

const { name, primaryKey, viewName } = userTag;
const entity = { name, primaryKey, viewName };

module.exports = {
    name: "userTagList",
    type: "View",
    eventActions: getEventActions(),
    properties: assignProporties({ name: "userTagList" }, [getSearchOperationView(), getAlert(), getDataGridView()])
}

function getSearchOperationView() {
    return {
        name: "searchOperationView1",
        entity: entity,
        type: "RowsColsView",
        className: "divLeftRightView",
        properties: assignProporties({ name: "userTagList" }, [{ eventActionName: "toEditPage", ...getButton("toEditPage", "新增", "primary", 1, 1) },
        { eventActionName: "editEntityData", colStyle: { paddingLeft: 0 }, ...getButton("editEntityData", "修改", "default", 1, 2) },
        {
            eventActionName: "deleteEntityData",
            colStyle: { paddingLeft: 0 },
            dataActionType: dataActionTypes.deleteEntityData,
            successTip: "删除成功！",
            confirmTip: "请确认是否删除当前粉丝标签？",
            ...getButton("deleteEntityData", "删除", "default", 1, 4)
        },
        getKeyword()
        ])
    }
}

function getKeyword() {
    const p = getTextBox("keyword", "", "Search", 2, 3, "请输入关键字")
    p.colStyle = { paddingRight: 8, paddingLeft: 2 };
    p.isCondition = true;
    p.propertyName = "Name,Remark";
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
        properties: assignProporties(userTag, ["Name", "Remark", { name: "CreateDate", OrderByType: "desc" }, { name: "RowVersion", isVisible: false }])
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
        pageUrl: "/weChatManage/userTagEdit"
    },
    {
        name: "editEntityData",
        type: "dataGridView/selectRowToPage",
        dataGridView: "dataGridView1",
        alertMessage: "alertMessage",
        pageUrl: "/weChatManage/userTagEdit?UserTagId=#{UserTagId}&menuName=" + escape("修改")
    },
    {
        name: "deleteEntityData",
        type: "dataGrid/batchUpdateRowDataList",
        dataGridView: "dataGridView1",
        alertMessage: "alertMessage"
    }]
}
