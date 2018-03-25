(function () {
    window.configs.ProcessType = {
        Name: "ProcessType",
        Title: "加工类型",
        EntityName: "ProcessType",
        PrimaryKey: "Id",
        TemplateName: "EntityListPage",
        SelectNames: ["Id", "RowVersion", "Name", "FeeValue", "UnitTypeName", "Remark", "CreateDate"],
        SearchNames: ["Name"],
        DataColumnNames: ["Name", "FeeValue", "UnitTypeName", "Remark", "CreateDate"],
        EditNames: ["Name", "FeeValue", "UnitType", "Remark"],
        OrderByList: [{ Name: "CreateDate", IsDesc: true }],
        Properties: GetProperties()
    };

    function GetProperties() {
        return [{ Label: "名称", Name: "Name", DataType: "string", MaxLength: 50, IsNullable: false },
        { Label: "费用", Max: 100000000, Min: 0.01, Step: 0.01, Scale: 2, Type: "TextBox", ControlType: "InputNumber", Name: "FeeValue", DataType: "decimal", MaxLength: 10, IsNullable: false },
        {
            Label: "单位", Name: "UnitType", Type: "Radio", IsButton: true, DefaultValue: "1", ButtonWidth: 145,
            DataType: "int", DataSource: GeDataSource()
        },
        { Label: "备注", Name: "Remark", DataType: "string", MaxLength: 200, IsNullable: true },
        { Label: "单位", Name: "UnitTypeName" },
        { Label: "创建时间", Name: "CreateDate", DataType: "DateTime" }]
    }

    function GeDataSource() {
        return [{ Value: "1", Text: "金额" },
        { Value: "2", Text: "百分比" }]
    }

})();