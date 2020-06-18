const AppAccount = require("../../entities/AppAccount");
const { GetButton, AssignProporties, GetTextBox, GetSelect } = require("../../Common");

//SystemManage/AppAccountList 100-199
const DataActionTypes = {
    //搜索查询
    SearchQuery: 100,
    //删除实体数据
    DeleteEntityData: 101,
    //Excel导出
    ExcelExport: 102,
    //更新状态
    UpdateAppAccountStatus: 103
};

const Entity = { Name: AppAccount.Name, PrimaryKey: AppAccount.PrimaryKey, ViewName: "ViewAppAccount" }

module.exports = {
    Name: "AppAccountList",
    Type: "View",
    EventActions: GetEventActions(),
    Properties: AssignProporties({ Name: "AppAccountList" }, [GetSearchOperationView(), GetDataGridView()])
}

function GetSearchOperationView() {
    return {
        Name: "SearchOperationView1",
        Entity: Entity,
        Type: "RowsColsView",
        ClassName: "DivSerachView",
        Properties: AssignProporties({ Name: "AppAccountList" }, [
            GetEditSelect("Status", "状态", AppAccount.StatusDataSource, 1, 1),
            {
                ...GetTextBox2("Keyword", "关键字", 1, 3, "", "访问路径/公司名/联系人/手机"), PropertyName: "PathName,CompanyName,Linkman,Phone",
                OperateLogic: "like", PressEnterEventActionName: "SearchQuery"
            },
            { ...GetButton("Search", "搜索", "primary", 1, 4), IsFormItem: true, Icon: "search", EventActionName: "SearchQuery", PressEnterEventActionName: "SearchQuery" },
            { ...GetButton("ClearQuery", "清空", "default", 1, 5), IsFormItem: true, EventActionName: "ClearQuery" },
            { EventActionName: "ToEditPage", ...GetButton("ToEditPage", "新增", "primary", 2, 1), Style: { marginLeft: 16, marginBottom: 16 } },
            { EventActionName: "EditAppAccount", ColStyle: { paddingLeft: 0 }, ...GetButton("EditAppAccount", "修改", "default", 2, 2) },
            {
                EventActionName: "DeleteAppAccount",
                ColStyle: { paddingLeft: 0 },
                DataActionType: DataActionTypes.DeleteEntityData,
                SuccessTip: "删除成功！",
                ConfirmTip: "请确认是否删除当前App账号？",
                ...GetButton("DeleteAppAccount", "删除", "default", 2, 4)
            },
            { EventActionName: "ExcelExport", Title: "App账号", ...GetButton("ExcelExport", "Excel导出", "default", 2, 5), Icon: "download", ColStyle: { paddingLeft: 0 } }
        ])
    }
}

function GetEditSelect(Name, Label, DataSource, X, Y, DefaultValue) {
    return {
        ...GetSelect(Name, Label, DataSource, X, Y, DefaultValue),
        IsFormItem: true,
        ColSpan: 6,
        LabelCol: 8,
        WrapperCol: 15,
        OperateLogic: "=",
        IsNullable: true,
        AllowClear: true,
        IsCondition: true
    }
}

function GetTextBox2(Name, Label, X, Y, ContorlType, PlaceHolder, MaxLength) {
    return {
        ...GetTextBox(Name, Label, ContorlType, X, Y, PlaceHolder, MaxLength || 50),
        IsFormItem: true,
        ColSpan: 8,
        LabelCol: 8,
        WrapperCol: 15,
        IsNullable: true,
        IsCondition: true
    }
}

function GetDataGridView() {
    return {
        Name: "DataGridView1",
        Entity: Entity,
        Type: "DataGridView",
        EntitySearchQuery: DataActionTypes.SearchQuery,
        EntityExcelExport: DataActionTypes.ExcelExport,
        EventActionName: "SearchQuery",
        IsDiv: true,
        ClassName: "DivInfoView3",
        IsRowSelection: true,
        IsSingleSelection: true,
        Properties: AssignProporties(AppAccount, ["CompanyName", "PathName", "Address", "Linkman", "Phone", "StatusName",
            { Name: "CreateDate", OrderByType: "desc" }, GetOperation(), { Name: "RowVersion", IsVisible: false }, { Name: "Status", IsVisible: false }])
    }
}

function GetOperation() {
    return {
        Name: "Operation",
        Label: "操作",
        IsData: false,
        ActionList: AssignProporties(AppAccount, [GetUpdateAppAccountStatusAction(1), GetUpdateAppAccountStatusAction(2)])
    }
}

function GetUpdateAppAccountStatusAction(status) {
    return {
        Name: "UpdateAppAccountStatus",
        ValueName: "Status",
        DataValue: status,
        Label: status === 1 ? "关闭" : "启用",
        EventActionName: "UpdateAppAccountStatus",
        Type: "Popconfirm",
        DataActionType: DataActionTypes.UpdateAppAccountStatus,
        SuccessTip: "操作成功！",
        Title: "请确认是否" + (status === 1 ? "关闭" : "启用") + "当前App账号？"
    }
}

function GetEventActions() {
    return [{
        Name: "SearchQuery",
        Type: "DataGridView/SearchQuery",
        SearchView: "SearchOperationView1",
        SearchButton: "Search",
        DataGridView: "DataGridView1"
    },
    {
        Name: "ClearQuery",
        Type: "DataGridView/SearchQuery",
        SearchView: "SearchOperationView1",
        SearchButton: "ClearQuery",
        DataGridView: "DataGridView1",
        IsClearQuery: true
    },
    {
        Name: "ExcelExport",
        Type: "DataGridView/ExcelExport",
        DataGridView: "DataGridView1"
    },
    {
        Name: "ToEditPage",
        Type: "Page/ToPage",
        PageUrl: "/SystemManage/AppAccountEdit"
    },
    {
        Name: "EditAppAccount",
        Type: "DataGridView/SelectRowToPage",
        DataGridView: "DataGridView1",
        PageUrl: "/SystemManage/AppAccountEdit?AppAccountId=#{AppAccountId}&MenuName=" + escape("修改")
    },
    {
        Name: "UpdateAppAccountStatus",
        Type: "DataGrid/BatchUpdateRowDataList",
        DataGridView: "DataGridView1"
    },
    {
        Name: "DeleteAppAccount",
        Type: "DataGrid/BatchUpdateRowDataList",
        DataGridView: "DataGridView1"
    }]
}
