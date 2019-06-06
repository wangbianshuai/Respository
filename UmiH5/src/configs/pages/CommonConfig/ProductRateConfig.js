import ProductRate from "../../entities/ProductRate";
import { GetButton, AssignProporties, CreateGuid, GetTextBox } from "../Common";

//公共配置/产品利率配置 2300-2399
const DataActionTypes = {
    //搜索查询
    SearchQuery: 2300,
    DeleteEntityData: 2301
}

export default {
    Name: "ProductRateConfig",
    Type: "View",
    EventActions: GetEventActions(),
    Properties: AssignProporties(ProductRate, [GetSearchOperationView(), GetAlert(), GetDataGridView()])
}

function GetSearchOperationView() {
    return {
        Id: CreateGuid(),
        Name: "SearchOperationView1",
        Entity: ProductRate,
        Type: "RowsColsView",
        ClassName: "DivLeftRightView",
        Properties: AssignProporties(ProductRate, [{ EventActionName: "ToEditPage", ...GetButton("ToEditPage", "新增", "primary", 1, 1) },
        {
            EventActionName: "DeleteProductRate",
            DataActionType: DataActionTypes.DeleteEntityData,
            SuccessTip: "删除成功！",
            ConfirmTip: "请确认是否删除当前产品利率？",
            ...GetButton("DeleteProductRate", "删除", "default", 1, 2)
        },
        GetKeyword()
        ])
    }
}

function GetKeyword() {
    const p = GetTextBox("Keyword", "", "Search", 2, 3, "请输入")
    p.ColStyle = { paddingRight: 8, paddingLeft: 2 };
    p.IsCondition = true;
    p.EventActionName = "SearchQuery";
    p.ColStyle = { width: 300 };
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
        Entity: ProductRate,
        Type: "DataGridView",
        EntitySearchQuery: DataActionTypes.SearchQuery,
        EventActionName: "SearchQuery",
        Title: "产品利率列表",
        IsRowSelection: true,
        IsSingleSelection: true,
        Properties: AssignProporties(ProductRate, ["ProductName", "ProductPeriod", "YearRate", "CreateUser", "CreateDate"])
    }
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
        PageUrl: "/CommonConfig/ProductRateEdit"
    },
    {
        Name: "DeleteProductRate",
        Type: "DataGrid/BatchUpdateRowDataList",
        DataGridView: "DataGridView1",
        AlertMessage: "AlertMessage"
    }]
}