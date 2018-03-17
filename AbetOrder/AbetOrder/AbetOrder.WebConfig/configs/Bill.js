(function () {
    window.configs.Bill = {
        Name: "Bill",
        Title: "收支明细",
        EntityName: "Bill",
        PrimaryKey: "Id",
        TemplateName: "EntityListPage",
        InsertUrl: "Bill/Insert2",
        UpdateUrl: "Bill/Update2",
        SelectNames: ["Id", "RowVersion", "Amount2", "BillTypeName", "IncomePaymentName", "BillUserName", "CreateUserName", "UpdateUserName", "BillType", "BillDate", "UpdateDate", "Remark", "CreateDate"],
        SearchNames: ["IncomePayment", "BillTypeId", "BillUser", "StartDate", "EndDate", "Remark"],
        DataColumnNames: ["BillTypeName", "IncomePaymentName", "Amount2", "BillUserName", "BillDate", "Remark", "CreateUserName", "UpdateUserName", "CreateDate", "UpdateDate"],
        EditNames: ["IncomePayment", "BillTypeId", , "Amount", "BillUser", "BillDate", "Remark"],
        OrderByList: [{ Name: "BillDate", IsDesc: true }],
        ActionList: GetActionList(),
        Properties: GetProperties(),
        EditViewWidth: 700
    };

    function GetActionList() {
        return [{
            ActionName: "GetBillTypeList", StateName: "BillTypeList",
            Url: "ViewBillType?$select=Id,IncomePayment,Name&$orderby=CreateDate", DataKey: "ViewBillType", Method: "GET"
        },
        {
            ActionName: "GetUserList", StateName: "UserList",
            Url: "ViewUser?$select=UserId,UserName&$orderby=CreateDate", DataKey: "ViewUser", Method: "GET"
        }]
    }

    function GetProperties() {
        return [{
            Label: "收支", Name: "IncomePayment", EditProperty: { Type: "Radio", ChildNames: ["BillTypeId"], IsButton: true, DefaultValue: "1", ButtonWidth: 200 },
            DataType: "int", Type: "Select", DataSource: GeDataSource(), OperateLogic: "=", AllowClear: true
        },
        {
            Label: "类型", Name: "BillTypeId", AllowClear: true, EditProperty: { AllowClear: false, ParentName: "IncomePayment", ParentPropertyName: "IncomePayment" }, OperateLogic: "=",
            DataType: "Guid", Type: "Select", ServiceDataSource: GetBillTypeDataSource(), IsNullable: false
        },
        { Label: "金额", Max: 100000000, Min: 0.01, Step: 0.01, Scale: 2, IsCurrency: true, Type: "TextBox", ControlType: "InputNumber", Name: "Amount", DataType: "decimal", MaxLength: 10, IsNullable: false },
        {
            Label: "经手人", Name: "BillUser", EditProperty: { PlaceHolder: "默认当前用户" },
            DataType: "Guid", Type: "Select", ServiceDataSource: GetUserDataSource(), OperateLogic: "=", AllowClear: true
        },
        { Label: "时间", Type: "Date", IsShowTime: true, IsDefaultNow: true, Name: "BillDate", PlaceHolder: "默认系统当前时间", DataType: "DateTime", MaxLength: 20, IsNullable: true },
        { Label: "开始时间", Type: "Date", IsShowTime: true, OperateLogic: ">=", PropertyName: "BillDate", Name: "StartDate", PlaceHolder: "大于或等于时间", DataType: "DateTime", MaxLength: 20, IsNullable: true },
        { Label: "结束时间", Type: "Date", IsShowTime: true, OperateLogic: "<=", PropertyName: "BillDate", Name: "EndDate", PlaceHolder: "小于或等于时间", DataType: "DateTime", MaxLength: 20, IsNullable: true },
        { Label: "备注", Name: "Remark", DataType: "string", Rows: 3, EditProperty: { ControlType: "TextArea" }, MaxLength: 200, IsNullable: true },
        { Label: "类型", Name: "BillTypeName" },
        { Label: "收支", Name: "IncomePaymentName" },
        { Label: "创建人", Name: "CreateUserName" },
        { Label: "修改人", Name: "UpdateUserName" },
        { Label: "经手人", Name: "BillUserName" },
        { Label: "金额", Name: "Amount2", Scale: 2, IsCurrency: true },
        { Label: "创建时间", Name: "CreateDate", DataType: "DateTime" },
        { Label: "修改时间", Name: "UpdateDate", DataType: "DateTime" }]
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

    function GetUserDataSource() {
        return {
            ActionName: "GetUserList",
            ValueName: "UserId",
            TextName: "UserName"
        }
    }

})();
