const Product =require( "../../entities/Product");
const { GetButton, AssignProporties, GetTextBox } =require( "../../Common");

//公共配置/产品配置 2200-2299
const DataActionTypes = {
    //搜索查询
    SearchQuery: 2200
}

module.exports= {
    Name: "ProductConfig",
    Type: "View",
    EventActions: GetEventActions(),
    Properties: AssignProporties({Name:"ProductConfig"}, [GetSearchOperationView(), GetAlert(), GetDataGridView()])
}

function GetSearchOperationView() {
    return {
        Name: "SearchOperationView1",
        Type: "RowsColsView",
        ClassName: "DivLeftRightView",
        Properties: AssignProporties({Name:"ProductConfig"}, [{ EventActionName: "ToEditPage", ...GetButton("ToEditPage", "新增", "primary", 1, 1) },
        { EventActionName: "EditProduct", ColStyle: { paddingLeft: 0 }, ...GetButton("EditProduct", "修改", "default", 1, 2) },
        GetKeyword()
        ])
    }
}

function GetKeyword() {
    const p = GetTextBox("Keyword", "", "Search", 2, 3, "请输入")
    p.ColStyle = { paddingRight: 8, paddingLeft: 2 };
    p.IsCondition = true;
    p.EventActionName = "SearchQuery";
    p.PressEnterEventActionName = "SearchQuery";
    p.ColStyle = { width: 240 }
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
        Entity: Product,
        Type: "DataGridView",
        EntitySearchQuery: DataActionTypes.SearchQuery,
        EventActionName: "SearchQuery",
        Title: "产品列表",
        IsRowSelection: true,
        IsSingleSelection: true,
        Properties: AssignProporties(Product, ["ProductTypeName", "ProductName", "ProductCode", "MinMaxLoanAmount", "BackMethodName"])
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
        PageUrl: "/CommonConfig/ProductEdit"
    },
    {
        Name: "EditProduct",
        Type: "DataGridView/SelectRowToPage",
        DataGridView: "DataGridView1",
        AlertMessage: "AlertMessage",
        IsLocalData: true,
        PageUrl: "/CommonConfig/ProductEdit?ProductId=#{productId}&MenuName=" + escape("修改")
    }]
}