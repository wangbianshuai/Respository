(function () {
    window.configs.OrderList = {
        Name: "OrderList",
        Title: "订单列表",
        EntityName: "Order",
        PrimaryKey: "Id",
        TemplateName: "EntityListPage",
        SelectNames: ["Id", "RowVersion", "OrderCode", "OrderDate", "DeliveryDate", "CustomerName", "SaleUserName", "ActualAmount", "OrderStatusName", "UpdateUserName", "UpdateDate"],
        SearchNames: ["OrderCode", "CustomerId", "SaleUser", "OrderStatus", "StartDate", "EndDate", "StartDate2", "EndDate2"],
        DataColumnNames: ["OrderCode", "OrderDate", "DeliveryDate", "CustomerName", "ActualAmount", "OrderStatusName", "SaleUserName", "UpdateUserName", "UpdateDate"],
        OrderByList: [{ Name: "OrderDate", IsDesc: true }],
        ActionList: GetActionList(),
        Properties: GetProperties(),
        EditPageUrl: "/OrderEdit"
    };

    function GetActionList() {
        return [{
            ActionName: "GetCustomerList", StateName: "CustomerList",
            Url: "ViewCustomer?$select=Id,Name&$orderby=CreateDate", DataKey: "ViewCustomer", Method: "GET"
        },
        {
            ActionName: "GetUserList", StateName: "UserList",
            Url: "ViewUser?$select=UserId,UserName&$orderby=CreateDate", DataKey: "ViewUser", Method: "GET"
        }]
    }

    function GetProperties() {
        return [
            { Label: "订单日期", Type: "Date", Name: "OrderDate", DataType: "DateTime", MaxLength: 20, IsNullable: true },
            { Label: "订单日期", Type: "Date", X: 1, Y: 1, ColSpan: 5, OperateLogic: ">=", PropertyName: "OrderDate", Name: "StartDate", PlaceHolder: "大于或等于其值", DataType: "DateTime", MaxLength: 20, IsNullable: true },
            { Label: "至", Type: "Date", X: 1, Y: 2, ColSpan: 5, OperateLogic: "<", PropertyName: "OrderDate", Name: "EndDate", PlaceHolder: "小于或等于其值", DataType: "DateTime", MaxLength: 20, IsNullable: true },
            { Label: "发货日期", Type: "Date", ColSpan: 5, OperateLogic: ">=", X: 1, Y: 3, PropertyName: "DeliveryDate", Name: "StartDate2", PlaceHolder: "大于或等于其值", DataType: "DateTime", MaxLength: 20, IsNullable: true },
            { Label: "至", Type: "Date", ColSpan: 5, OperateLogic: "<", X: 1, Y: 4, PropertyName: "DeliveryDate", Name: "EndDate2", PlaceHolder: "小于或等于其值", DataType: "DateTime", MaxLength: 20, IsNullable: true },
            {
                Label: "订单状态", Name: "OrderStatus",
                DataType: "int", Type: "Select", DataSource: GeDataSource(), OperateLogic: "=", AllowClear: true, ColSpan: 5, X: 2, Y: 4
            },
            {
                Label: "客户", Name: "CustomerId", AllowClear: true, OperateLogic: "=", X: 2, Y: 2,
                DataType: "Guid", Type: "Select", ServiceDataSource: GetCustomerListDataSource(), IsNullable: false, ColSpan: 5
            },
            {
                Label: "销售员", Name: "SaleUser", X: 2, Y: 3,
                DataType: "Guid", Type: "Select", ServiceDataSource: GetUserDataSource(), OperateLogic: "=", AllowClear: true, ColSpan: 5
            },
            { Label: "订单编号", Name: "OrderCode", DataType: "string", X: 2, Y: 1, ColSpan: 5, MaxLength: 50, IsNullable: true },
            { Label: "订单状态", Name: "OrderStatusName" },
            { Label: "修改人", Name: "UpdateUserName" },
            { Label: "客户", Name: "CustomerName" },
            { Label: "销售员", Name: "SaleUserName" },
            { Label: "发货日期", Name: "DeliveryDate" },
            { Label: "订单金额", Name: "ActualAmount" },
            { Label: "修改时间", Name: "UpdateDate", DataType: "DateTime" }]
    }

    function GeDataSource() {
        return [{ Value: "0", Text: "未提交" },
        { Value: "1", Text: "待加工" },
        { Value: "2", Text: "待交付" },
        { Value: "3", Text: "已完成" }]
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

