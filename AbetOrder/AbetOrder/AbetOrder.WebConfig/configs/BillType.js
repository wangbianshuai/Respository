(function () {
    window.configs.BillType = {
        Name: "BillType",
        Title: "账目类型",
        EntityName: "BillType",
        PrimaryKey: "Id",
        TemplateName: "EntityListPage",
        SelectNames: ["Id", "RowVersion", "Name", "IncomePaymentName", "Remark"],
        SearchNames: ["Name"],
        DataColumnNames: ["Name", "IncomePaymentName", "Remark"],
        EditNames: ["Name", "IncomePayment", "Remark"],
        OrderByList: [{ Name: "CreateDate", IsDesc: true }],
        Properties: GetProperties()
    };

    function GetProperties() {
        return [{ Label: "名称", Name: "Name", DataType: "string", MaxLength: 50, IsNullable: false },
        {
            Label: "收支", Name: "IncomePayment", Type: "Radio", IsButton: true, DefaultValue: "2", ButtonWidth: 145,
            DataType: "int", IsUpdate: false, DataSource: GeDataSource()
        },
        { Label: "备注", Name: "Remark", DataType: "string", MaxLength: 100, IsNullable: true },
        { Label: "收支", Name: "IncomePaymentName" }]
    }

    function GeDataSource() {
        return [{ Value: "2", Text: "支出" },
        { Value: "1", Text: "收入" }]
    }

})();