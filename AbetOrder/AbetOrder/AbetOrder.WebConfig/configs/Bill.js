(function () {
    window.configs.Bill = {
        Name: "Bill",
        Title: "收支明细",
        EntityName: "Bill",
        PrimaryKey: "Id",
        TemplateName: "EntityListPage",
        InsertUrl: "Bill/Insert2",
        UpdateUrl: "Bill/Update2",
        UpdateStatusUrl: "Bill/UpdateStatus",
        SelectNames: ["Id", "RowVersion", "Amount2", "BillTypeName", "DataId", "DataType", "BillStatus", "CreateUser", "OrderName2", "IncomePaymentName", "BillStatusName", "CreateUserName", "BillDate", "Remark"],
        SearchNames: ["IncomePayment", "BillTypeId", "CreateUser", "BillStatus", "StartDate", "EndDate", "OrderName2", "Remark"],
        DataColumnNames: ["BillDate", "BillTypeName", "OrderName2", "IncomePaymentName", "Amount2", "CreateUserName", "BillStatusName"],
        EditNames: ["IncomePayment", "BillTypeId", "DataId", "Amount", "BillDate", "Remark"],
        OrderByList: [{ Name: "BillDate", IsDesc: true }],
        ActionList: GetActionList(),
        Properties: GetProperties(),
        GroupByInfoHtml: GetGroupByInfoHtml(),
        QueryUrl: "ViewBill/Select2",
        IsGroupByInfo: true,
        IsSelfOpeartion: true,
        SelfPropertyName: "CreateUser",
        DefaultConditions: GetDefaultConditions(),
        EditViewWidth: 700,
        TableWidth: 1000
    };

    function GetDefaultConditions() {
        return [{
            Name: "DataRight",
            Type: "int",
            IsCurrentUser: true,
            PropertyName: "DataRight"
        }]
    }

    function GetGroupByInfoHtml() {
        var html = [];

        html.push("收入：<span style=\"color:#1890ff;\">{TotalIncome}</span>，");
        html.push("支出：<span style=\"color:red;\">{TotalPayment}</span>，");
        html.push("结余：<span style=\"color:{TotalBalanceColor};\">{TotalBalance}</span>");

        return html.join("");
    }

    function GetActionList() {
        return [{
            ActionName: "GetBillTypeList", StateName: "BillTypeList",
            Url: "ViewBillType?$select=Id,IncomePayment,Name&$orderby=CreateDate", DataKey: "ViewBillType", Method: "GET"
        },
        {
            ActionName: "GetOrderList", StateName: "OrderList",
            Url: "ViewOrder2?$select=OrderId,OrderName2&$orderby=OrderDate desc", DataKey: "ViewOrder2", Method: "GET"
        },
        {
            ActionName: "GetUserList", StateName: "UserList",
            Url: "ViewUser?$select=UserId,UserName&$orderby=CreateDate&$filter=DataRight eq 1", DataKey: "ViewUser", Method: "GET"
        }]
    }

    function GetProperties() {
        return [{
            Label: "收支", Name: "IncomePayment", EditProperty: { Type: "Radio", ChildNames: ["BillTypeId"], IsButton: true, DefaultValue: "2", ButtonWidth: 202 },
            DataType: "int", Type: "Select", DataSource: GetDataSource(), OperateLogic: "=", AllowClear: true, SearchProperty: { ColSpan: 5 }
        },
        {
            Label: "类型", Name: "BillTypeId", AllowClear: true, EditProperty: { AllowClear: false, ParentName: "IncomePayment", ParentPropertyName: "IncomePayment" }, OperateLogic: "=",
            DataType: "Guid", Type: "Select", ServiceDataSource: GetBillTypeDataSource(), IsNullable: false, SearchProperty: { ColSpan: 5 }
        },
        {
            Label: "订单", Name: "DataId", AllowClear: true,
            DataType: "Guid", Type: "Select", ServiceDataSource: GetOrderDataSource(), IsNullable: true
        },
        { Label: "金额", Max: 100000000, Min: 0.01, Step: 0.01, Scale: 2, IsCurrency: true, Type: "TextBox", ControlType: "InputNumber", Name: "Amount", DataType: "decimal", MaxLength: 10, IsNullable: false },
        {
            Label: "经手人", Name: "CreateUser",
            DataType: "Guid", Type: "Select", ServiceDataSource: GetUserDataSource(), OperateLogic: "=", AllowClear: true, SearchProperty: { ColSpan: 5 }
        },
        {
            Label: "状态", Name: "BillStatus", ColSpan: 5, X: 1, Y: 4,
            DataType: "int", Type: "Select", DataSource: GetStatusDataSource(), OperateLogic: "=", AllowClear: true, SearchProperty: { ColSpan: 5 }
        },
        { Label: "日期", Type: "Date", IsDate: true, IsDefaultNow: true, Name: "BillDate", PlaceHolder: "默认系统当前日期", DataType: "DateTime", MaxLength: 20, IsNullable: true },
        { Label: "开始日期", Type: "Date", SearchProperty: { ColSpan: 5 }, OperateLogic: ">=", PropertyName: "BillDate", Name: "StartDate", PlaceHolder: "大于或等于其值", DataType: "DateTime", MaxLength: 20, IsNullable: true },
        { Label: "至", Type: "Date", SearchProperty: { ColSpan: 5 }, OperateLogic: "<", PropertyName: "BillDate", Name: "EndDate", PlaceHolder: "小于其值", DataType: "DateTime", MaxLength: 20, IsNullable: true },
        { Label: "订单", Name: "OrderName2", PropertyName: "DataId", SearchProperty: { PropertyName: "" }, IsOpenPage: true, IsAddToken: false, PageUrl: "Order.aspx?Name=B17DC2B1-AF38-4C79-AAE3-3C784CAC6F98&Id={DataId}", DataType: "string", ColSpan: 5, X: 2, Y: 3, MaxLength: 20, IsNullable: true, PlaceHolder: "模糊匹配订单编号或门板花式" },
        { Label: "备注", Name: "Remark", DataType: "string", Rows: 3, SearchProperty: { ColSpan: 5, X: 2, Y: 4 }, EditProperty: { ControlType: "TextArea" }, MaxLength: 200, IsNullable: true },
        { Label: "类型", Name: "BillTypeName" },
        { Label: "收支", Name: "IncomePaymentName" },
        { Label: "经手人", Name: "CreateUserName" },
        { Label: "状态", Name: "BillStatusName" },
        { Label: "金额", Name: "Amount2", Scale: 2, IsCurrency: true, FontColor: "#1890ff" }]
    }

    function GetStatusDataSource() {
        return [{ Value: "0", Text: "未确认" }, { Value: "1", Text: "已确认" }]
    }

    function GetDataSource() {
        return [{ Value: "2", Text: "支出" }, { Value: "1", Text: "收入" }]
    }

    function GetBillTypeDataSource() {
        return {
            ActionName: "GetBillTypeList",
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

    function GetOrderDataSource() {
        return {
            ActionName: "GetOrderList",
            ValueName: "OrderId",
            TextName: "OrderName2"
        }
    }

})();

