import PlatformRate from "../../entities/PlatformRate";
import { GetButton, AssignProporties, CreateGuid, GetRadio, GetEntityProperty } from "../Common";

//公共配置/平台费率配置 2100-2199
const DataActionTypes = {
    //搜索查询
    SearchQuery: 2100,
    DeleteEntityData: 2101,
};

export default {
    Name: "PlatformRateConfig",
    Type: "View",
    EventActions: GetEventActions(),
    Properties: AssignProporties(PlatformRate, [GetSearchOperationView(), GetAlert(), GetDataGridView()])
}

function GetSearchOperationView() {
    return {
        Id: CreateGuid(),
        Name: "SearchOperationView1",
        Entity: PlatformRate,
        Type: "RowsColsView",
        ClassName: "DivLeftRightView",
        Properties: AssignProporties(PlatformRate, [{ EventActionName: "ToEditPage", ...GetButton("ToEditPage", "新增", "primary", 1, 1) },
        {
            EventActionName: "DeletePlatformRate",
            DataActionType: DataActionTypes.DeleteEntityData,
            SuccessTip: "删除成功！",
            ConfirmTip: "请确认是否删除当前利率？",
            ...GetButton("DeletePlatformRate", "删除", "default", 1, 4)
        },
        GetRateType()
        ])
    }
}

function GetRateType() {
    const p = GetRadio("RateType", "", GetRateTypeDataSource(), 2, 1, "1", 120);
    p.Justify = "end";
    p.IsCondition = true;
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
        Entity: PlatformRate,
        Type: "DataGridView",
        EntitySearchQuery: DataActionTypes.SearchQuery,
        EventActionName: "SearchQuery",
        Title: "客户信息",
        IsRowSelection: true,
        IsSingleSelection: true,
        Properties: AssignProporties(PlatformRate, ["Name", "ManageRate", GetServiceRate(), GetFineRate(), "CollectionType", "CollectionMethod", "Remark", "UpdateDate"])
    }
}

function GetServiceRate() {
    return {
        ...GetEntityProperty(PlatformRate, "ServiceRate"),
        IsVisible: false,
    }
}

function GetFineRate() {
    return {
        ...GetEntityProperty(PlatformRate, "FineRate"),
        IsVisible: false,
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
        Name: "EditPlatformRate",
        Type: "DataGridView/SelectRowToPage",
        DataGridView: "DataGridView1",
        AlertMessage: "AlertMessage",
        PageUrl: "/Customer/PlatformRateEdit?PlatformRateId=#{PlatformRateId}&MenuName=" + escape("修改")
    },
    {
        Name: "DeletePlatformRate",
        Type: "DataGrid/BatchUpdateRowDataList",
        DataGridView: "DataGridView1",
        AlertMessage: "AlertMessage"
    }]
}

function GetRateTypeDataSource() {
    return [{ Value: "1", Text: "信息管理费率" }, { Value: "2", Text: "信息管理费率" }, { Value: "3", Text: "罚息费率" }]
}
