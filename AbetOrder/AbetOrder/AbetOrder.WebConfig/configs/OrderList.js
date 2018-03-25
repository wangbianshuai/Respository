(function () {
    window.configs.OrderList = {
        Name: "OrderList",
        Title: "订单列表",
        EntityName: "Order",
        PrimaryKey: "Id",
        TemplateName: "EntityListPage",
        SelectNames: ["Id", "RowVersion", "Amount2", "BillTypeName", "IncomePaymentName", "BillUserName", "CreateUserName", "UpdateUserName", "BillType", "BillDate", "UpdateDate", "Remark", "CreateDate"],
        SearchNames: ["IncomePayment", "BillTypeId", "BillUser", "Remark", "StartDate", "EndDate", "BillYear", "BillMonth", "BillDay"],
        DataColumnNames: ["BillDate", "BillTypeName", "IncomePaymentName", "Amount2", "BillUserName", "Remark", "CreateUserName", "UpdateUserName", "CreateDate", "UpdateDate"],
        OrderByList: [{ Name: "BillDate", IsDesc: true }],
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
            ActionName: "GetOrderYearList", StateName: "OrderYearList",
            Url: "ViewOrderYear?$select=OrderYear&$orderby=OrderYear", DataKey: "ViewOrderYear", Method: "GET"
        },
        {
            ActionName: "GetUserList", StateName: "UserList",
            Url: "ViewUser?$select=UserId,UserName&$orderby=CreateDate", DataKey: "ViewUser", Method: "GET"
        }]
    }

    function GetProperties() {
        return [{
            Label: "收支", Name: "IncomePayment", EditProperty: { Type: "Radio", ChildNames: ["BillTypeId"], IsButton: true, DefaultValue: "1", ButtonWidth: 202 },
            DataType: "int", Type: "Select", DataSource: GeDataSource(), OperateLogic: "=", AllowClear: true, SearchProperty: { ColSpan: 5 }
        },
        {
            Label: "类型", Name: "BillTypeId", AllowClear: true, EditProperty: { AllowClear: false, ParentName: "IncomePayment", ParentPropertyName: "IncomePayment" }, OperateLogic: "=",
            DataType: "Guid", Type: "Select", ServiceDataSource: GetBillTypeDataSource(), IsNullable: false, SearchProperty: { ColSpan: 5 }
        },
        { Label: "金额", Max: 100000000, Min: 0.01, Step: 0.01, Scale: 2, IsCurrency: true, Type: "TextBox", ControlType: "InputNumber", Name: "Amount", DataType: "decimal", MaxLength: 10, IsNullable: false },
        {
            Label: "经手人", Name: "BillUser", EditProperty: { PlaceHolder: "默认当前用户" },
            DataType: "Guid", Type: "Select", ServiceDataSource: GetUserDataSource(), OperateLogic: "=", AllowClear: true, SearchProperty: { ColSpan: 5 }
        },
        { Label: "时间", Type: "Date", IsShowTime: true, IsDefaultNow: true, Name: "BillDate", PlaceHolder: "默认系统当前时间", DataType: "DateTime", MaxLength: 20, IsNullable: true },
        { Label: "开始时间", Type: "Date", IsShowTime: true, SearchProperty: { ColSpan: 5 }, OperateLogic: ">=", PropertyName: "BillDate", Name: "StartDate", PlaceHolder: "大于或等于其值", DataType: "DateTime", MaxLength: 20, IsNullable: true },
        { Label: "结束时间", Type: "Date", IsShowTime: true, SearchProperty: { ColSpan: 5 }, OperateLogic: "<=", PropertyName: "BillDate", Name: "EndDate", PlaceHolder: "小于其值", DataType: "Time", MaxLength: 20, IsNullable: true },
        { Label: "备注", Name: "Remark", DataType: "string", Rows: 3, SearchProperty: { ColSpan: 5, X: 1, Y: 4 }, EditProperty: { ControlType: "TextArea" }, MaxLength: 200, IsNullable: true },
        { Label: "类型", Name: "BillTypeName" },
        { Label: "收支", Name: "IncomePaymentName" },
        { Label: "创建人", Name: "CreateUserName" },
        { Label: "修改人", Name: "UpdateUserName" },
        { Label: "经手人", Name: "BillUserName" },
        {
            Label: "年", Name: "BillYear", AllowClear: true, OperateLogic: "=",
            DataType: "int", Type: "Select", ServiceDataSource: GetBillYearListDataSource(), SearchProperty: { ColSpan: 3, X: 2, Y: 3 }
        },
        {
            Label: "月", Name: "BillMonth", AllowClear: true, OperateLogic: "=",
            DataType: "int", Type: "Select", DataSource: GetBillMonthDataSource(), SearchProperty: { ColSpan: 3, X: 2, Y: 4 }
        },
        {
            Label: "日", Name: "BillDay", AllowClear: true, OperateLogic: "=",
            DataType: "int", Type: "Select", DataSource: GetBillDayDataSource(), SearchProperty: { ColSpan: 3, X: 2, Y: 5 }
        },
        { Label: "金额", Name: "Amount2", Scale: 2, IsCurrency: true },
        { Label: "创建时间", Name: "CreateDate", DataType: "DateTime" },
        { Label: "修改时间", Name: "UpdateDate", DataType: "DateTime" }]
    }

    function GetBillDayDataSource() {
        var list = []
        for (var i = 1; i <= 31; i++) list.push({ Value: i, Text: i });
        return list;
    }

    function GetBillMonthDataSource() {
        var list = []
        for (var i = 1; i <= 12; i++) list.push({ Value: i, Text: i });
        return list;
    }

    function GeDataSource() {
        return [{ Value: "1", Text: "收入" },
        { Value: "2", Text: "支出" }]
    }

    function GetBillTypeDataSource() {
        return {
            ActionName: "GetBillTypeList",
            ValueName: "Id",
            TextName: "Name"
        }
    }

    function GetBillYearListDataSource() {
        return {
            ActionName: "GetBillYearList",
            ValueName: "BillYear",
            TextName: "BillYear"
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
