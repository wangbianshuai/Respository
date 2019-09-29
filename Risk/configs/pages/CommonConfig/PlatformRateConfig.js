const PlatformRate =require( "../../entities/PlatformRate");
const { GetButton, AssignProporties, GetRadio, GetEntityProperty } =require( "../../Common");

//公共配置/平台费率配置 2100-2199
const DataActionTypes = {
    //搜索查询
    SearchQuery: 2100,
    DeleteEntityData: 2101,
};

module.exports= {
    Name: "PlatformRateConfig",
    Type: "View",
    EventActions: GetEventActions(),
    Properties: AssignProporties({Name:"PlatformRateConfig"}, [GetSearchOperationView(), GetAlert(), GetDataGridView()])
}

function GetSearchOperationView() {
    return {
        Name: "SearchOperationView1",
        Type: "RowsColsView",
        ClassName: "DivLeftRightView",
        Properties: AssignProporties({Name:"PlatformRateConfig"}, [{ EventActionName: "ToEditPage", ...GetButton("ToEditPage", "新增", "primary", 1, 1) },
        {
            EventActionName: "DeletePlatformRate",
            DataActionType: DataActionTypes.DeleteEntityData,
            ColStyle: { paddingLeft: 0 },
            SuccessTip: "删除成功！",
            ConfirmTip: "请确认是否删除当前利率？",
            ...GetButton("DeletePlatformRate", "删除", "default", 1, 4)
        },
        GetRateType()
        ])
    }
}

function GetRateType() {
    const p = GetRadio("RateType", "", GetRateTypeDataSource(), 2, 1, "01", 120);
    p.Justify = "end";
    p.ValueChangeEventActionName = "SearchQuery";
    p.IsCondition = true;
    p.IsLoadValue = true;
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
        Name: "DataGridView1",
        Entity: PlatformRate,
        Type: "DataGridView",
        EntitySearchQuery: DataActionTypes.SearchQuery,
        EventActionName: "SearchQuery",
        Title: "客户信息",
        IsRowSelection: true,
        IsSingleSelection: true,
        Properties: AssignProporties(PlatformRate, ["Name", "ManageRateName", GetServiceRate(), GetFineRate(), "CollectionTypeName", "CollectionMethodName", "Remark"])
    }
}

function GetServiceRate() {
    return {
        ...GetEntityProperty(PlatformRate, "ServiceRateName"),
        IsVisible: false,
    }
}

function GetFineRate() {
    return {
        ...GetEntityProperty(PlatformRate, "FineRateName"),
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

/*费用类型	01	信息管理费
	02	信息服务费
	03	罚息*/
function GetRateTypeDataSource() {
    return [{ Value: "01", Text: "信息管理费率" }, { Value: "02", Text: "信息服务费率" }, { Value: "03", Text: "罚息费率" }]
}
