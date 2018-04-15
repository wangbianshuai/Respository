(function () {
    window.configs.ProcessOrderList = {
        Name: "ProcessOrderList",
        Title: "加工订单",
        EntityName: "ProcessOrder",
        PrimaryKey: "OrderId",
        TemplateName: "EntityListPage",
        SelectNames: ["OrderId", "OrderCode", "OrderName", "ProcessAmount", "ProcessPdfPath", "BillStatus", "BillStatusName", "OrderDate", "DeliveryDate", "CreateUserName"],
        SearchNames: ["OrderCode", "CreateUser", "StartDate", "EndDate", "StartDate2", "EndDate2", "BillStatus"],
        DataColumnNames: ["OrderCode", "OrderName", "OrderDate", "DeliveryDate", "CreateUserName", "ProcessAmount", "BillStatusName"],
        OrderByList: [{ Name: "OrderDate", IsDesc: true }],
        ActionList: GetActionList(),
        Properties: GetProperties(),
        IsNewAdd: false,
        EditNames: ["ProcessAmount"],
        IsUpdate: true,
        IsDelete: false,
        TableWidth: 1000,
        QueryUrl: "ViewProcessOrder/Select2",
        IsGroupByInfo: true,
        UpdateUrl: "ProcessOrder/Update2",
        DefaultConditions: GetDefaultConditions(),
        GroupByInfoHtml: GetGroupByInfoHtml()
    };

    function GetDefaultConditions() {
        return [{
            Name: "CreateUser2",
            Type: "Guid",
            IsCurrentUser: true
        }]
    }

    function GetGroupByInfoHtml() {
        var html = [];

        html.push("加工费：<span style=\"color:#1890ff;\">{TotalProcessAmount}</span>");

        return html.join("");
    }

    function GetActionList() {
        return [{
            ActionName: "GetUserList", StateName: "UserList",
            Url: "ViewUser?$select=UserId,UserName&$orderby=CreateDate&$filter=DataRight eq 1", DataKey: "ViewUser", Method: "GET"
        }]
    }

    function GetProperties() {
        return [{
            Label: "销售员", Name: "CreateUser", X: 2, Y: 2,
            DataType: "Guid", Type: "Select", ServiceDataSource: GetUserDataSource(), OperateLogic: "=", AllowClear: true, ColSpan: 5
        },
        {
            Label: "状态", Name: "BillStatus", ColSpan: 5, X: 2, Y: 3,
            DataType: "int", Type: "Select", DataSource: GetStatusDataSource(), OperateLogic: "=", AllowClear: true, SearchProperty: { ColSpan: 5 }
        },
        { Label: "订单编号", Name: "OrderCode", IsOpenPage: true, IsRandom: false, PropertyName: "ProcessPdfPath", PageUrl: "ProcessPdfPath", DataType: "string", ColSpan: 5, X: 2, Y: 1, MaxLength: 50, IsNullable: true },
        { Label: "订单日期", Type: "Date", IsDate: true, Name: "OrderDate", DataType: "DateTime", MaxLength: 20, IsNullable: true },
        { Label: "订单日期", Type: "Date", X: 1, Y: 1, ColSpan: 5, OperateLogic: ">=", PropertyName: "OrderDate", Name: "StartDate", PlaceHolder: "大于或等于其值", DataType: "DateTime", MaxLength: 20, IsNullable: true },
        { Label: "至", Type: "Date", ColSpan: 5, X: 1, Y: 2, OperateLogic: "<", PropertyName: "OrderDate", Name: "EndDate", PlaceHolder: "小于或等于其值", DataType: "DateTime", MaxLength: 20, IsNullable: true },
        { Label: "发货日期", Type: "Date", ColSpan: 5, OperateLogic: ">=", X: 1, Y: 3, PropertyName: "DeliveryDate", Name: "StartDate2", PlaceHolder: "大于或等于其值", DataType: "DateTime", MaxLength: 20, IsNullable: true },
        { Label: "至", Type: "Date", ColSpan: 5, OperateLogic: "<", X: 1, Y: 4, PropertyName: "DeliveryDate", Name: "EndDate2", PlaceHolder: "小于或等于其值", DataType: "DateTime", MaxLength: 20, IsNullable: true },
        { Label: "销售员", Name: "CreateUserName" },
        { Label: "门板花式", Name: "OrderName" },
        { Label: "状态", Name: "BillStatusName" },
        { Label: "加工费", Name: "ProcessAmount", Max: 100000000, Min: 1, Step: 1, IsCurrency: true, IsFixed2: false, FontColor: "#1890ff", Type: "TextBox", ControlType: "InputNumber", DataType: "decimal", MaxLength: 10, IsNullable: false },
        { Label: "发货日期", Name: "DeliveryDate", IsDate: true }]
    }

    function GetUserDataSource() {
        return {
            ActionName: "GetUserList",
            ValueName: "UserId",
            TextName: "UserName"
        }
    }

    function GetStatusDataSource() {
        return [{ Value: "0", Text: "未确认" }, { Value: "1", Text: "已确认" }]
    }

})();

