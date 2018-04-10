(function () {
    window.configs.PersonBill = {
        Name: "PersonBill",
        Title: "个人账目",
        EntityName: "PersonBill",
        PrimaryKey: "Id",
        TemplateName: "EntityListPage",
        InsertUrl: "PersonBill/Insert2",
        UpdateUrl: "PersonBill/Update2",
        SelectNames: ["Id", "RowVersion", "Amount2", "BillTypeName", "IncomePaymentName", "BillType", "BillDate", "Remark"],
        SearchNames: ["IncomePayment", "BillTypeId", "StartDate", "EndDate", "Remark"],
        DataColumnNames: ["BillDate", "BillTypeName", "IncomePaymentName", "Amount2", "Remark"],
        EditNames: ["IncomePayment", "BillTypeId", "Amount", "BillDate", "Remark"],
        OrderByList: [{ Name: "BillDate", IsDesc: true }],
        ActionList: GetActionList(),
        Properties: GetProperties(),
        GroupByInfoHtml: GetGroupByInfoHtml(),
        QueryUrl: "ViewPersonBill/Select2",
        IsGroupByInfo: true,
        EditViewWidth: 700,
        TableWidth: 1300
    };

    function GetGroupByInfoHtml() {
        var html = [];

        html.push("收入：<span style=\"color:#1890ff;\">{TotalIncome}</span>，");
        html.push("支出：<span style=\"color:#1890ff;\">{TotalPayment}</span>，");
        html.push("结余：<span style=\"color:{TotalBalanceColor};\">{TotalBalance}</span>");

        return html.join("");
    }

    function GetActionList() {
        return [{
            ActionName: "GetBillTypeList", StateName: "BillTypeList",
            Url: "ViewBillType?$select=Id,IncomePayment,Name&$orderby=CreateDate", DataKey: "ViewBillType", Method: "GET"
        }]
    }

    function GetProperties() {
        return [{
            Label: "收支", Name: "IncomePayment", EditProperty: { Type: "Radio", ChildNames: ["BillTypeId"], IsButton: true, DefaultValue: "2", ButtonWidth: 202 },
            DataType: "int", Type: "Select", DataSource: GetDataSource(), OperateLogic: "=", AllowClear: true, SearchProperty: { ColSpan: 5 }
        },
        {
            Label: "类型", Name: "BillTypeId", AllowClear: true, EditProperty: { AllowClear: false, ParentName: "IncomePayment", ParentPropertyName: "IncomePayment" }, OperateLogic: "=",
            DataType: "Guid", Type: "Select", ServiceDataSource: GetBillTypeDataSource(), IsNullable: false, SearchProperty: { ColSpan: 5, X: 2, Y: 1 }
        },
        { Label: "金额", Max: 100000000, Min: 0.01, Step: 0.01, Scale: 2, IsCurrency: true, Type: "TextBox", ControlType: "InputNumber", Name: "Amount", DataType: "decimal", MaxLength: 10, IsNullable: false },
        { Label: "日期", Type: "Date", IsDate: true, IsDefaultNow: true, Name: "BillDate", PlaceHolder: "默认系统当前时间", DataType: "DateTime", MaxLength: 20, IsNullable: true },
        { Label: "开始日期", Type: "Date", SearchProperty: { ColSpan: 5 }, OperateLogic: ">=", PropertyName: "BillDate", Name: "StartDate", PlaceHolder: "大于或等于其值", DataType: "DateTime", MaxLength: 20, IsNullable: true },
        { Label: "至", Type: "Date", SearchProperty: { ColSpan: 5, X: 1, Y: 3 }, OperateLogic: "<", PropertyName: "BillDate", Name: "EndDate", PlaceHolder: "小于其值", DataType: "DateTime", MaxLength: 20, IsNullable: true },
        { Label: "备注", Name: "Remark", DataType: "string", IsTooltip: true, ColumnWidth: 600, Rows: 3, SearchProperty: { ColSpan: 5, X: 2, Y: 4 }, EditProperty: { ControlType: "TextArea" }, MaxLength: 200, IsNullable: true },
        { Label: "类型", Name: "BillTypeName" },
        { Label: "收支", Name: "IncomePaymentName" },
        { Label: "金额", Name: "Amount2", Scale: 2, IsCurrency: true }]
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

})();

