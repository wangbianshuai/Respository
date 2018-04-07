(function () {
    window.configs.ProcessOrderList = {
        Name: "ProcessOrderList",
        Title: "订单列表",
        EntityName: "ProcessOrder",
        PrimaryKey: "OrderId",
        TemplateName: "EntityListPage",
        SelectNames: ["OrderId", "OrderCode", "OrderDate", "DeliveryDate", "SaleUserName", "UpdateUserName", "UpdateDate"],
        SearchNames: ["OrderCode", "SaleUser", "StartDate", "EndDate", "StartDate2", "EndDate2"],
        DataColumnNames: ["OrderCode", "OrderDate", "DeliveryDate", "SaleUserName", "UpdateUserName", "UpdateDate"],
        OrderByList: [{ Name: "OrderDate", IsDesc: true }],
        ActionList: GetActionList(),
        Properties: GetProperties(),
        IsNewAdd: false,
        IsUpdate: false,
        IsDelete: false
    };

    function GetActionList() {
        return [{
            ActionName: "GetUserList", StateName: "UserList",
            Url: "ViewUser?$select=UserId,UserName&$orderby=CreateDate", DataKey: "ViewUser", Method: "GET"
        }]
    }

    function GetProperties() {
        return [{
            Label: "销售员", Name: "SaleUser", X: 2, Y: 2,
            DataType: "Guid", Type: "Select", ServiceDataSource: GetUserDataSource(), OperateLogic: "=", AllowClear: true, ColSpan: 5
        },
        { Label: "订单编号", Name: "OrderCode", DataType: "string", ColSpan: 5, X: 2, Y: 1, MaxLength: 50, IsNullable: true },
        { Label: "订单日期", Type: "Date", IsDate: true, Name: "OrderDate", DataType: "DateTime", MaxLength: 20, IsNullable: true },
        { Label: "订单日期", Type: "Date", X: 1, Y: 1, ColSpan: 5, OperateLogic: ">=", PropertyName: "OrderDate", Name: "StartDate", PlaceHolder: "大于或等于其值", DataType: "DateTime", MaxLength: 20, IsNullable: true },
        { Label: "至", Type: "Date", ColSpan: 5, X: 1, Y: 2, OperateLogic: "<", PropertyName: "OrderDate", Name: "EndDate", PlaceHolder: "小于或等于其值", DataType: "DateTime", MaxLength: 20, IsNullable: true },
        { Label: "发货日期", Type: "Date", ColSpan: 5, OperateLogic: ">=", X: 1, Y: 3, PropertyName: "DeliveryDate", Name: "StartDate2", PlaceHolder: "大于或等于其值", DataType: "DateTime", MaxLength: 20, IsNullable: true },
        { Label: "至", Type: "Date", ColSpan: 5, OperateLogic: "<", X: 1, Y: 4, PropertyName: "DeliveryDate", Name: "EndDate2", PlaceHolder: "小于或等于其值", DataType: "DateTime", MaxLength: 20, IsNullable: true },
        { Label: "修改人", Name: "UpdateUserName" },
        { Label: "销售员", Name: "SaleUserName" },
        { Label: "发货日期", Name: "DeliveryDate", IsDate: true },
        { Label: "修改时间", Name: "UpdateDate", DataType: "DateTime" }]
    }

    function GetUserDataSource() {
        return {
            ActionName: "GetUserList",
            ValueName: "UserId",
            TextName: "UserName"
        }
    }

})();

