import Blacklist from "../../entities/Blacklist";
import { GetButton, AssignProporties, CreateGuid, GetTextBox, GetRadio, GetSelect, GetEntityProperty } from "../Common";

//客户管理/黑名单配置 2400-2499
const DataActionTypes = {
    //搜索查询
    SearchQuery: 2400,
    DeleteEntityData: 2401,
};

export default {
    Name: "BlacklistManage",
    Type: "View",
    EventActions: GetEventActions(),
    Properties: AssignProporties(Blacklist, [GetSearchOperationView(), GetAlert(), GetDataGridView()])
}

function GetSearchOperationView() {
    return {
        Id: CreateGuid(),
        Name: "SearchOperationView1",
        Entity: Blacklist,
        Type: "RowsColsView",
        ClassName: "DivLeftRightView",
        Properties: AssignProporties(Blacklist, [{ EventActionName: "ToEditPage", ...GetButton("ToEditPage", "新增", "primary", 1, 1) },
        { EventActionName: "EditBlacklist", ...GetButton("EditBlacklist", "修改", "default", 1, 2) },
        {
            EventActionName: "DeleteBlacklist",
            DataActionType: DataActionTypes.DeleteEntityData,
            SuccessTip: "删除成功！",
            ConfirmTip: "请确认是否删除当前客户？",
            ...GetButton("DeleteBlacklist", "删除", "default", 1, 4)
        },
        GetUserType(),
        GetQueryName(),
        GetQueryName2(),
        GetKeyword()
        ])
    }
}

function GetUserType() {
    const p = GetRadio("UserType", "", GetUserTypeDataSource(), 2, 1, "1");
    p.Justify = "end";
    p.ValueVisibleProperties = { "1": ["QueryName"], "2": ["QueryName2"] };
    p.IsCondition = true;
    return p;
}

function GetKeyword() {
    const p = GetTextBox("Keyword", "", "Search", 2, 3, "请输入")
    p.ColStyle = { paddingRight: 8, paddingLeft: 2 };
    p.IsCondition = true;
    p.EventActionName = "SearchQuery";
    return p;
}

function GetQueryName() {
    const p = GetSelect("QueryName", "", GetQueryNameDataSource(), 2, 2, "Name");
    p.ColStyle = { paddingRight: 0, paddingLeft: 8 };
    p.Width = 160;
    p.IsCondition = true;
    return p;
}
function GetQueryName2() {
    const p = GetSelect("QueryName2", "", GetQueryNameDataSource2(), 2, 2, "CompanyName");
    p.ColStyle = { paddingRight: 0, paddingLeft: 8 };
    p.Width = 160;
    p.IsCondition = true;
    p.IsVisible = false;
    return p;
}

function GetAlert() {
    return {
        Name: "AlertMessage",
        Type: "Alert"
    }
}

function GetDataGridView() {
    return {
        Id: CreateGuid(),
        Name: "DataGridView1",
        Entity: Blacklist,
        Type: "DataGridView",
        EntitySearchQuery: DataActionTypes.SearchQuery,
        EventActionName: "SearchQuery",
        Title: "客户信息",
        IsRowSelection: true,
        IsSingleSelection: true,
        Properties: AssignProporties(Blacklist, ["Name", "IdNumber", GetCompanyName(), GetCompanyIdNumber(), "Phone", "Remark", "UpdateDate"])
    }
}

function GetCompanyName() {
    return {
        ...GetEntityProperty(Blacklist, "CompanyName"),
        IsVisible: false,
    }
}

function GetCompanyIdNumber() {
    return {
        ...GetEntityProperty(Blacklist, "CompanyIdNumber"),
        IsVisible: false,
    }
}

function GetQueryNameDataSource() {
    return [{ Value: "Name", Text: "姓名" }, { Value: "IdNumber", Text: "身份证号" }, { Value: "Phone", Text: "手机号" }]
}

function GetQueryNameDataSource2() {
    return [{ Value: "CompanyName", Text: "企业名称" }, { Value: "CompanyIdNumber", Text: "统一社会信用代码" }]
}

function GetEventActions() {
    return [{
        Name: "SearchQuery",
        Type: "DataGridView/SearchQuery",
        SearchView: "SearchOperationView1",
        SearchButton: "Keyword",
        DataGridView: "DataGridView1",
        AlertMessage: "AlertMessage"
    },
    {
        Name: "ToEditPage",
        Type: "Page/ToPage",
        PageUrl: "/Customer/BlacklistEdit"
    },
    {
        Name: "EditBlacklist",
        Type: "DataGridView/SelectRowToPage",
        DataGridView: "DataGridView1",
        AlertMessage: "AlertMessage",
        PageUrl: "/Customer/BlacklistEdit?BlacklistId=#{BlacklistId}&MenuName=" + escape("修改")
    },
    {
        Name: "DeleteBlacklist",
        Type: "DataGrid/BatchUpdateRowDataList",
        DataGridView: "DataGridView1",
        AlertMessage: "AlertMessage"
    }]
}

function GetUserTypeDataSource() {
    return [{ Value: "1", Text: "个人" }, { Value: "2", Text: "企业" }]
}
