(function () {
    window.configs.DictionaryConfig = {
        Name: "DictionaryConfig",
        Title: "键值配置",
        EntityName: "DictionaryConfig",
        PrimaryKey: "Id",
        TemplateName: "EntityListPage",
        SelectNames: ["Id", "RowVersion", "Name", "Value", "Remark", "CreateDate"],
        SearchNames: ["Name"],
        DataColumnNames: ["Name", "Value", "Remark", "CreateDate"],
        EditNames: ["Name", "Value", "Remark"],
        OrderByList: [{ Name: "CreateDate", IsDesc: true }],
        Properties: GetProperties(),
        EditViewWidth: 900
    };

    function GetProperties() {
        return [{ Label: "名称", Name: "Name", DataType: "string", MaxLength: 50, EditProperty: GetEditProperty(), IsNullable: false },
        { Label: "备注", Name: "Remark", DataType: "string", MaxLength: 100, EditProperty: GetEditProperty(), IsNullable: true },
        { Label: "值", Name: "Value", DataType: "string", Rows: 4, MaxLength: 2000, ControlType: "TextArea", EditProperty: GetEditProperty(), IsNullable: false },
        { Label: "创建时间", Name: "CreateDate", DataType: "DateTime" }]
    }

    function GetEditProperty() {
        return { ColSpan: 22, LabelCol: 3, WrapperCol: 21 }
    }

})();