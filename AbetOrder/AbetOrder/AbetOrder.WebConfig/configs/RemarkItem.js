(function () {
    window.configs.RemarkItem = {
        Name: "RemarkItem",
        Title: "加工选项",
        EntityName: "RemarkItem",
        PrimaryKey: "Id",
        TemplateName: "EntityListPage",
        SelectNames: ["Id", "RowVersion", "Name", "DisplayIndex"],
        SearchNames: ["Name"],
        DataColumnNames: ["Name", "DisplayIndex"],
        EditNames: ["Name", "DisplayIndex"],
        OrderByList: [{ Name: "CreateDate", IsDesc: true }],
        Properties: GetProperties()
    };

    function GetProperties() {
        return [{ Label: "名称", Name: "Name", DataType: "string", MaxLength: 50, IsNullable: false },
        { Label: "显示顺序", Max: 10000, Min: 1, Type: "TextBox", ControlType: "InputNumber", Name: "DisplayIndex", DataType: "int", MaxLength: 5, IsNullable: false }]
    }

})();