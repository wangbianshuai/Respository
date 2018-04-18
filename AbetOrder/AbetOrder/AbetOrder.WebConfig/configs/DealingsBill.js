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
        SelectNames: ["Id", "RowVersion", "Amount2", "OrderName2", "ProcessPdfPath", "DataId", "OrderSaleUser", "BillTypeName", "ApproveUserName", "BillStatus", "IncomePayment", "CreateUser2", "CreateUser", "IncomePaymentName", "BillStatusName", "CreateUserName", "BillDate", "Remark"],
        SearchNames: ["BillTypeId", "CreateUser", "BillStatus", "StartDate", "EndDate", "Remark"],
        DataColumnNames: ["BillDate", "OrderName2", "BillTypeName", "Amount2", "BillStatusName", "CreateUserName", "ApproveUserName"],
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

        html.push("进账：<span style=\"color:#1890ff;\">{TotalIncome}</span>，");
        html.push("出账：<span style=\"color:red;\">{TotalPayment}</span>，");
        html.push("结余：<span style=\"color:{TotalBalanceColor};\">{TotalBalance}</span>");

        return html.join("");
    }

    function GetActionList() {
        return [{
            ActionName: "GetDealingsBillTypeList", StateName: "DealingsBillTypeList",
            Url: "ViewDealingsBillType?$select=Id,Name&$orderby=CreateDate", DataKey: "ViewDealingsBillType", Method: "GET"
        },
        {
            ActionName: "GetDealingsUserList", StateName: "DealingsUserList", IsUrlParams: true, DataKey: "ViewDealingsBillUser", Method: "GET"
        },
        {
            ActionName: "GetUserList", StateName: "UserList",
            Url: "ViewDealingsUser?$select=UserId,UserName&$orderby=UserType,UserId", DataKey: "ViewDealingsUser", Method: "GET"
        }]
    }

    function GetProperties() {
        return [{
            Label: "类型", Name: "BillTypeId", AllowClear: true, EditProperty: { AllowClear: false }, OperateLogic: "=",
            DataType: "Guid", Type: "Select", ServiceDataSource: GetDealingsBillTypeList(), IsNullable: false, SearchProperty: { ColSpan: 5 }
        },
        { Label: "金额", Max: 100000000, Min: 0.01, Step: 0.01, Scale: 2, IsCurrency: true, Type: "TextBox", ControlType: "InputNumber", Name: "Amount", DataType: "decimal", MaxLength: 10, IsNullable: false },
        {
            Label: "业务往来人", Name: "DealingsUser", IsNullable: false,
            DataType: "Guid", Type: "Select", ServiceDataSource: GetUserDataSource(), AllowClear: true
        },
        {
            Label: "状态", Name: "BillStatus", ColSpan: 5, X: 1, Y: 2,
            DataType: "int", Type: "Select", DataSource: GetStatusDataSource(), OperateLogic: "=", AllowClear: true, SearchProperty: { ColSpan: 5 }
        },
        { Label: "日期", Type: "Date", IsDate: true, IsDefaultNow: true, Name: "BillDate", PlaceHolder: "默认系统当前日期", DataType: "DateTime", MaxLength: 20, IsNullable: true },
        { Label: "开始日期", Type: "Date", SearchProperty: { ColSpan: 5 }, OperateLogic: ">=", PropertyName: "BillDate", Name: "StartDate", PlaceHolder: "大于或等于其值", DataType: "DateTime", MaxLength: 20, IsNullable: true },
        { Label: "至", Type: "Date", SearchProperty: { ColSpan: 5 }, OperateLogic: "<", PropertyName: "BillDate", Name: "EndDate", PlaceHolder: "小于其值", DataType: "DateTime", MaxLength: 20, IsNullable: true },
        { Label: "备注", Name: "Remark", DataType: "string", Rows: 3, SearchProperty: { ColSpan: 5, X: 1, Y: 3 }, EditProperty: { ControlType: "TextArea" }, MaxLength: 200, IsNullable: true },
        { Label: "类型", Name: "BillTypeName" },
        { Label: "状态", Name: "BillStatusName" },
        { Label: "记账人", Name: "CreateUserName" },
        { Label: "审核人", Name: "ApproveUserName" },
        { Label: "订单", Name: "OrderName2", IsOpenPage: true, IsRandom: false, PropertyName: "ProcessPdfPath", PageUrl: "{ProcessPdfPath}", DataType: "string" },
        { Label: "金额", Name: "Amount2", Scale: 2, IsCurrency: true, FontColor: "#1890ff" }]
    }

    function GetStatusDataSource() {
        return [{ Value: "0", Text: "未确认" }, { Value: "1", Text: "已确认" }]
    }

    function GetDealingsBillTypeList() {
        return {
            ActionName: "GetDealingsBillTypeList",
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

