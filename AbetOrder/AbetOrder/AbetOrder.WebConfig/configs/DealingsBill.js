(function () {
    window.configs.DealingsBill = {
        Name: "DealingsBill",
        Title: "业务往来",
        EntityName: "DealingsBill",
        PrimaryKey: "Id",
        TemplateName: "EntityListPage",
        InsertUrl: "DealingsBill/Insert2",
        UpdateUrl: "DealingsBill/Update2",
        UpdateStatusUrl: "DealingsBill/UpdateStatus",
        SelectNames: ["Id", "RowVersion", "Amount2", "BillTypeName", "BillStatus", "CreateUser", "IncomePaymentName", "BillStatusName", "CreateUserName", "BillDate", "Remark"],
        SearchNames: ["IncomePayment", "BillTypeId", "CreateUser", "BillStatus", "StartDate", "EndDate", "Remark"],
        DataColumnNames: ["BillDate", "BillTypeName", "IncomePaymentName", "Amount2", "BillStatusName"],
        EditNames: ["BillTypeId", "DealingsUser", "Amount", "BillDate", "Remark"],
        OrderByList: [{ Name: "BillDate", IsDesc: true }],
        ActionList: GetActionList(),
        Properties: GetProperties(),
        GroupByInfoHtml: GetGroupByInfoHtml(),
        DefaultConditions: GetDefaultConditions(),
        QueryUrl: "ViewDealingsBill/Select2",
        IsGroupByInfo: true,
        IsSelfOpeartion: true,
        SelfPropertyName: "CreateUser",
        DataViewComponentName: "DealingsBillDataView",
        EditViewWidth: 700,
        IsInitQuery: false,
        TableWidth: 1000
    };

    function GetDefaultConditions() {
        return [{
            Name: "CreateUser2",
            Type: "Guid",
            IsCurrentUser: true
        },
        {
            Name: "DealingsUser2",
            Type: "Guid"
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
            ActionName: "GetDealingsUserList", StateName: "DealingsUserList", IsUrlParams: true, DataKey: "ViewDealingsBillUser", Method: "GET"
        },
        {
            ActionName: "GetUserList", StateName: "UserList",
            Url: "ViewUser?$select=UserId,UserName&$orderby=CreateDate&$filter=DataRight ne 3", DataKey: "ViewUser", Method: "GET"
        }]
    }

    function GetProperties() {
        return [{
            Label: "收支", Name: "IncomePayment", EditProperty: { Type: "Radio", ChildNames: ["BillTypeId"], IsButton: true, DefaultValue: "2", ButtonWidth: 202 },
            DataType: "int", Type: "Select", DataSource: GetDataSource(), OperateLogic: "=", AllowClear: true, SearchProperty: { ColSpan: 5 }
        },
        {
            Label: "类型", Name: "BillTypeId", AllowClear: true, EditProperty: { AllowClear: false }, OperateLogic: "=",
            DataType: "Guid", Type: "Select", ServiceDataSource: GetBillTypeDataSource(), IsNullable: false, SearchProperty: { ColSpan: 5 }
        },
        { Label: "金额", Max: 100000000, Min: 0.01, Step: 0.01, Scale: 2, IsCurrency: true, Type: "TextBox", ControlType: "InputNumber", Name: "Amount", DataType: "decimal", MaxLength: 10, IsNullable: false },
        {
            Label: "业务往来人", Name: "DealingsUser", IsNullable: false,
            DataType: "Guid", Type: "Select", ServiceDataSource: GetUserDataSource(), AllowClear: true
        },
        {
            Label: "状态", Name: "BillStatus", ColSpan: 5, X: 1, Y: 4,
            DataType: "int", Type: "Select", DataSource: GetStatusDataSource(), OperateLogic: "=", AllowClear: true, SearchProperty: { ColSpan: 5 }
        },
        { Label: "日期", Type: "Date", IsDate: true, IsDefaultNow: true, Name: "BillDate", PlaceHolder: "默认系统当前时间", DataType: "DateTime", MaxLength: 20, IsNullable: true },
        { Label: "开始日期", Type: "Date", SearchProperty: { ColSpan: 5 }, OperateLogic: ">=", PropertyName: "BillDate", Name: "StartDate", PlaceHolder: "大于或等于其值", DataType: "DateTime", MaxLength: 20, IsNullable: true },
        { Label: "至", Type: "Date", SearchProperty: { ColSpan: 5 }, OperateLogic: "<", PropertyName: "BillDate", Name: "EndDate", PlaceHolder: "小于其值", DataType: "DateTime", MaxLength: 20, IsNullable: true },
        { Label: "备注", Name: "Remark", DataType: "string", Rows: 3, SearchProperty: { ColSpan: 5, X: 2, Y: 4 }, EditProperty: { ControlType: "TextArea" }, MaxLength: 200, IsNullable: true },
        { Label: "类型", Name: "BillTypeName" },
        { Label: "收支", Name: "IncomePaymentName" },
        { Label: "状态", Name: "BillStatusName" },
        { Label: "金额", Name: "Amount2", Scale: 2, IsCurrency: true }]
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

})();

