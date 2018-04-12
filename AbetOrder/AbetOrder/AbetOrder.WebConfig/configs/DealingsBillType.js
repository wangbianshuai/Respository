(function () {
    window.configs.DealingsBillType = {
        Name: "DealingsBillType",
        Title: "账目类型",
        EntityName: "DealingsBillType",
        PrimaryKey: "Id",
        TemplateName: "EntityListPage",
        SelectNames: ["Id", "RowVersion", "Name", "Remark"],
        SearchNames: ["Name"],
        DataColumnNames: ["Name", "Remark"],
        EditNames: ["Name", "Remark"],
        OrderByList: [{ Name: "CreateDate", IsDesc: true }],
        Properties: GetProperties()
    };

    function GetProperties() {
        return [{ Label: "名称", Name: "Name", DataType: "string", MaxLength: 50, IsNullable: false },
        { Label: "备注", Name: "Remark", DataType: "string", MaxLength: 100, IsNullable: true }]
    }

})();