(function () {
    window.configs.TemplateHtml = {
        Name: "TemplateHtml",
        Title: "订单模板",
        EntityName: "TemplateHtml",
        PrimaryKey: "Id",
        TemplateName: "EntityListPage",
        SelectNames: ["Id", "RowVersion", "Name", "Remark"],
        SearchNames: ["Name"],
        DataColumnNames: ["Name", "Remark"],
        EditNames: ["Name", "Remark", "Content"],
        OrderByList: [{ Name: "CreateDate", IsDesc: true }],
        Properties: GetProperties(),
        EditViewWidth: 900
    };

    function GetProperties() {
        return [{ Label: "名称", Name: "Name", DataType: "string", MaxLength: 50, EditProperty: GetEditProperty(), IsNullable: false },
        { Label: "备注", Name: "Remark", DataType: "string", MaxLength: 100, EditProperty: GetEditProperty(), IsNullable: true },
        { Label: "内容", Name: "Content", DataType: "string", Rows: 15, ControlType: "TextArea", EditProperty: GetEditProperty(), IsNullable: false }]
    }

    function GetEditProperty() {
        return { ColSpan: 22, LabelCol: 3, WrapperCol: 21 }
    }

})();