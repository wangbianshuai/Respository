(function () {
    window.configs.ContentChannel = {
        Name: "ContentChannel",
        Title: "内容频道",
        EntityName: "Channel",
        PrimaryKey: "Id",
        TemplateName: "EntityListPage",
        SelectNames: ["Id", "RowVersion", "Name", "Remark", "CreateDate"],
        SearchNames: ["Name"],
        DataColumnNames: ["Name", "Remark", "CreateDate"],
        EditNames: ["Name", "Remark"],
        OrderByList: [{ Name: "CreateDate", IsDesc: true }],
        Properties: GetProperties()
    };

    function GetProperties() {
        return [{ Label: "名称", Name: "Name", DataType: "string", MaxLength: 50, IsNullable: false },
        { Label: "备注", Name: "Remark", DataType: "string", MaxLength: 100, IsNullable: true },
        { Label: "创建时间", Name: "CreateDate", DataType: "DateTime" }]
    }
})();