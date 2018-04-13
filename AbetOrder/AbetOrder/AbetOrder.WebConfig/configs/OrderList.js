(function () {
    window.configs.OrderList = {
        Name: "OrderList",
        Title: "订单列表",
        EntityName: "Order",
        PrimaryKey: "OrderId",
        TemplateName: "EntityListPage",
        SelectNames: ["OrderId", "RowVersion", "OrderStatus", "OrderCode", "OrderDate", "DeliveryDate", "CustomerName", "SaleUserName", "ActualAmount", "CostAmount2", "ProcessAmount2", "Profit", "PaidDeposit", "ShouldPayBalance", "OrderStatusName"],
        SearchNames: ["OrderCode", "CustomerId", "SaleUser", "OrderStatus", "StartDate", "EndDate", "StartDate2", "EndDate2"],
        DataColumnNames: ["OrderCode", "OrderDate", "OrderStatusName", "CustomerName", "ActualAmount", "CostAmount2", "ProcessAmount2", "Profit", "PaidDeposit", "ShouldPayBalance", "DeliveryDate", "SaleUserName"],
        EditNames: ["CostAmount", "PaidDeposit"],
        OrderByList: [{ Name: "OrderDate", IsDesc: true }],
        ActionList: GetActionList(),
        Properties: GetProperties(),
        EditPageUrl: "/OrderEdit",
        UpdateStatusUrl: "Order/UpdateStatus",
        UpdateStatusActionName: "UpdateStatus",
        TableWidth: 1600,
        OperationColumnWidth: 240,
        OperationColumnFixed: "right",
        GroupByInfoHtml: GetGroupByInfoHtml(),
        QueryUrl: "ViewOrder/Select2",
        UpdateUrl: "Order/Update3",
        IsGroupByInfo: true
    };

    function GetGroupByInfoHtml() {
        var html = [];

        html.push("订单金额：<span style=\"color:#1890ff;\">{TotalActualAmount}</span>，");
        html.push("成本金额：<span style=\"color:red;\">{TotalCostAmount2}</span>，");
        html.push("加工费：<span style=\"color:red;\">{TotalProcessAmount2}</span>，");
        html.push("利润：<span style=\"color:{TotalProfitColor};\">{TotalProfit}</span>，");
        html.push("已收金额：<span style=\"color:#1890ff;\">{TotalPaidDeposit}</span>，");
        html.push("应收余额：<span style=\"color:#1890ff;\">{TotalShouldPayBalance}</span>");

        return html.join("");
    }

    function GetActionList() {
        return [{
            ActionName: "GetCustomerList", StateName: "CustomerList",
            Url: "ViewCustomer?$select=Id,Name&$orderby=CreateDate", DataKey: "ViewCustomer", Method: "GET"
        },
        {
            ActionName: "UpdateStatus", StateName: "UpdateStatusInfo", DataKey: "", Method: "PUT"
        },
        {
            ActionName: "GetUserList", StateName: "UserList",
            Url: "ViewUser?$select=UserId,UserName&$orderby=CreateDate&$filter=DataRight eq 1", DataKey: "ViewUser", Method: "GET"
        }]
    }

    function GetProperties() {
        return [
            { Label: "订单日期", Type: "Date", ColumnWidth: 110, IsDate: true, Name: "OrderDate", DataType: "DateTime", MaxLength: 20, IsNullable: true },
            { Label: "订单日期", Type: "Date", X: 1, Y: 1, ColSpan: 5, OperateLogic: ">=", PropertyName: "OrderDate", Name: "StartDate", PlaceHolder: "大于或等于其值", DataType: "DateTime", MaxLength: 20, IsNullable: true },
            { Label: "至", Type: "Date", X: 1, Y: 2, ColSpan: 5, OperateLogic: "<", PropertyName: "OrderDate", Name: "EndDate", PlaceHolder: "小于或等于其值", DataType: "DateTime", MaxLength: 20, IsNullable: true },
            { Label: "发货日期", Type: "Date", ColSpan: 5, OperateLogic: ">=", X: 1, Y: 3, PropertyName: "DeliveryDate", Name: "StartDate2", PlaceHolder: "大于或等于其值", DataType: "DateTime", MaxLength: 20, IsNullable: true },
            { Label: "至", Type: "Date", ColSpan: 5, OperateLogic: "<", X: 1, Y: 4, PropertyName: "DeliveryDate", Name: "EndDate2", PlaceHolder: "小于或等于其值", DataType: "DateTime", MaxLength: 20, IsNullable: true },
            {
                Label: "订单状态", Name: "OrderStatus",
                DataType: "int", Type: "Select", DataSource: GetDataSource(), OperateLogic: "=", AllowClear: true, ColSpan: 5, X: 2, Y: 4
            },
            {
                Label: "客户", Name: "CustomerId", AllowClear: true, OperateLogic: "=", X: 2, Y: 2,
                DataType: "Guid", Type: "Select", ServiceDataSource: GetCustomerListDataSource(), IsNullable: false, ColSpan: 5
            },
            {
                Label: "销售员", Name: "SaleUser", X: 2, Y: 3,
                DataType: "Guid", Type: "Select", ServiceDataSource: GetUserDataSource(), OperateLogic: "=", AllowClear: true, ColSpan: 5
            },
            { Label: "订单编号", Name: "OrderCode", IsOpenPage: true, IsRandom: false, PropertyName: "OrderPdfPath", PageUrl: "{OrderPdfPath}", ColumnWidth: 100, DataType: "string", X: 2, Y: 1, ColSpan: 5, MaxLength: 50, IsNullable: true },
            { Label: "订单状态", Name: "OrderStatusName", ColumnWidth: 90 },
            { Label: "客户", Name: "CustomerName", ColumnWidth: 120, IsTooltip: true },
            { Label: "销售员", Name: "SaleUserName", ColumnWidth: 90 },
            { Label: "发货日期", Name: "DeliveryDate", IsDate: true, ColumnWidth: 110 },
            { Label: "订单金额", Name: "ActualAmount", ColumnWidth: 120, IsCurrency: true, IsFixed2: false, FontColor: "#1890ff" },
            { Label: "成本金额", Name: "CostAmount2", ColumnWidth: 120, IsCurrency: true, IsFixed2: false, FontColor: "#1890ff" },
            { Label: "加工费", Name: "ProcessAmount2", ColumnWidth: 120, IsCurrency: true, IsFixed2: false, FontColor: "#1890ff" },
            { Label: "利润", Name: "Profit", ColumnWidth: 120, IsCurrency: true, IsFixed2: false, FontColor: "#1890ff" },
            { Label: "已收金额", Name: "PaidDeposit", ColumnWidth: 120, IsCurrency: true, IsFixed2: false, FontColor: "#1890ff", Max: 100000000, Min: 1, Step: 1, Type: "TextBox", ControlType: "InputNumber", DataType: "decimal", MaxLength: 10 },
            { Label: "成本金额", Name: "CostAmount", Max: 100000000, Min: 1, Step: 1, Type: "TextBox", ControlType: "InputNumber", DataType: "decimal", MaxLength: 10, IsNullable: false },
            { Label: "应收余额", Name: "ShouldPayBalance", ColumnWidth: 120, IsCurrency: true, IsFixed2: false, FontColor: "#1890ff" },
            { Label: "修改时间", Name: "UpdateDate", DataType: "DateTime" }]
    }

    function GetDataSource() {
        return [{ Value: "0", Text: "未确认" },
        { Value: "1", Text: "已确认" },
        { Value: "2", Text: "已完成" }]
    }

    function GetCustomerListDataSource() {
        return {
            ActionName: "GetCustomerList",
            ValueName: "Id",
            TextName: "Name"
        }
    }

    function GetUserDataSource() {
        return {
            ActionName: "GetUserList",
            ValueName: "UserId",
            TextName: "UserName"
        }
    }

})();

