(function () {
    window.configs.StaticSource = {
        Name: "StaticSource",
        Title: "静态资源",
        EntityName: "StaticSource",
        PrimaryKey: "Id",
        TemplateName: "EntityListPage",
        SelectNames: ["Id", "RowVersion", "Name", "FileName", "FileType", "FileSize", "FilePath", "CreateDate"],
        SearchNames: ["FileType", "Name",],
        DataColumnNames: ["Name", "FileName", "FileType", "FileSize", "FilePath", "CreateDate"],
        EditNames: ["Name", "FileType", "FileUpload", "FileName", "FileSize", "FilePath"],
        OrderByList: [{ Name: "CreateDate", IsDesc: true }],
        Properties: GetProperties(),
        EditViewWidth: 700
    };

    function GetProperties() {
        return [{ Label: "名称", Name: "Name", DataType: "string", MaxLength: 50, EditProperty: GetEditProperty(), IsNullable: false },
        { Label: "文件名", Name: "FileName", DataType: "string", MaxLength: 200, EditProperty: GetEditProperty(), IsReadonly: true },
        { Label: "文件类型", Name: "FileType", DataType: "string", Type: "Select", EditProperty: GetFileTypeEditProperty(), IsNullable: false, DataSource: GeDataSource() },
        { Label: "文件大小", Name: "FileSize", DataType: "string", EditProperty: GetEditProperty(), IsReadonly: true },
        { Label: "文件路径", Name: "FilePath", DataType: "string", Rows: 4, ControlType: "TextArea", EditProperty: GetEditProperty(), IsReadonly: true },
        { Label: "文件上传", Name: "FileUpload", UploadUrl: "?EntityName=StaticSource", DataType: "string", Type: "Upload", EditProperty: GetEditProperty(), IsEdit: false },
        { Label: "创建时间", Name: "CreateDate", DataType: "DateTime" }]
    }

    function GetEditProperty() {
        return { ColSpan: 22, LabelCol: 4, WrapperCol: 20 }
    }

    function GetFileTypeEditProperty() {
        return { ColSpan: 22, LabelCol: 4, WrapperCol: 20, DefaultValue: "html" }
    }

    function GeDataSource() {
        return [{ Value: "html", Text: "html", Accept: ".html,.htm,.txt", FileSize: 1024 * 1024, FileSizeText: "1M" },
        { Value: "js", Text: "js", Accept: ".js,.txt", FileSize: 1024 * 1024, FileSizeText: "1M" },
        { Value: "css", Text: "css", Accept: ".css,.txt", FileSize: 1024 * 1024, FileSizeText: "1M" },
        { Value: "text", Text: "text", Accept: ".js,.css,.html,.htm,.txt", FileSize: 1024 * 1024, FileSizeText: "1M" },
        { Value: "image", Text: "image", Accept: ".jpg,.png,.gif", FileSize: 1024 * 1024, FileSizeText: "1M" }]
    }

})();