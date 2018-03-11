(function () {
    window.configs.TemplateHtml = {
        Name: "TemplateHtml",
        Title: "HTML模板",
        EntityName: "TemplateHtml",
        PrimaryKey: "Id",
        TemplateName: "EntityListPage",
        SelectNames: ["Id", "RowVersion", "Name", "Remark", "CreateDate"],
        SearchNames: ["Name"],
        DataColumnNames: ["Name", "Remark", "CreateDate"],
        EditNames: ["Name", "Remark", "Content"],
        OrderByList: [{ Name: "CreateDate", IsDesc: true }],
        Properties: GetProperties(),
        EditViewWidth: 900
    };

    function GetProperties() {
        return [{ Label: "名称", Name: "Name", DataType: "string", MaxLength: 50, EditProperty: GetEditProperty(), IsNullable: false },
        { Label: "备注", Name: "Remark", DataType: "string", MaxLength: 100, EditProperty: GetEditProperty(), IsNullable: true },
        { Label: "内容", Name: "Content", DataType: "string", Rows: 15, ControlType: "TextArea", EditProperty: GetEditProperty(), IsNullable: false },
        { Label: "创建时间", Name: "CreateDate", DataType: "DateTime" }]
    }

    function GetEditProperty() {
        return { ColSpan: 22, LabelCol: 3, WrapperCol: 21 }
    }

})();