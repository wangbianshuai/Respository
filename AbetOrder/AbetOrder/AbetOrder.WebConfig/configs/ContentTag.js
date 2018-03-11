(function () {
    window.configs.ContentTag = {
        Name: "ContentTag",
        Title: "内容标签",
        EntityName: "ContentTag",
        PrimaryKey: "Id",
        TemplateName: "EntityListPage",
        SelectNames: ["Id", "RowVersion", "Name", "Remark", "CreateDate"],
        SearchNames: ["Name"],
        DataColumnNames: ["Name", "Remark", "CreateDate"],
        EditNames: ["Name", "Remark", "WebApiUrl", "SqlStatement"],
        OrderByList: [{ Name: "CreateDate", IsDesc: true }],
        Properties: GetProperties(),
        EditViewWidth: 900,
        NoNullableGroupNames: [{ Names: ["WebApiUrl", "SqlStatement"], Message: "WebApi地址与Sql语句不能同时为空！" }]
    };

    function GetProperties() {
        return [{ Label: "名称", Name: "Name", DataType: "string", MaxLength: 50, EditProperty: GetEditProperty(), IsNullable: false },
        { Label: "备注", Name: "Remark", DataType: "string", MaxLength: 100, EditProperty: GetEditProperty(), IsNullable: true },
        { Label: "WebApi地址", Name: "WebApiUrl", DataType: "string", MaxLength: 500, EditProperty: GetEditProperty(), IsNullable: true },
        { Label: "Sql语句", Name: "SqlStatement", DataType: "string", Rows: 10, ControlType: "TextArea", EditProperty: GetEditProperty(), IsNullable: true },
        { Label: "创建时间", Name: "CreateDate", DataType: "DateTime" }]
    }

    function GetEditProperty() {
        return { ColSpan: 22, LabelCol: 3, WrapperCol: 21 }
    }
    
    function GetEditProperty() {
        return { ColSpan: 22, LabelCol: 3, WrapperCol: 21 }
    }

})();