(function () {
    window.configs.Customer = {
        Name: "Customer",
        Title: "客户",
        EntityName: "Customer",
        PrimaryKey: "Id",
        TemplateName: "EntityListPage",
        SelectNames: ["Id", "RowVersion", "Name", "CompanyName", "Linkman", "Phone", "Telephone", "Fax", "Address", "Remark", "CreateDate"],
        SearchNames: ["Name,CompanyName"],
        DataColumnNames: ["Name", "CompanyName", "Linkman", "Phone", "Telephone", "Fax", "Address", "Remark", "CreateDate"],
        EditNames: ["Name", "CompanyName", "Linkman", "Phone", "Telephone", "Fax", "Address", "Remark"],
        OrderByList: [{ Name: "CreateDate", IsDesc: true }],
        Properties: GetProperties(),
        EditViewWidth: 700
    };

    function GetProperties() {
        return [{ Label: "名称", Name: "Name,CompanyName", DataType: "string", MaxLength: 50 },
        { Label: "名称", Name: "Name", DataType: "string", MaxLength: 50, IsNullable: false },
        { Label: "公司名称", Name: "CompanyName", DataType: "string", MaxLength: 50, IsNullable: false },
        { Label: "联系人", Name: "Linkman", DataType: "string", MaxLength: 50 },
        { Label: "手机", Name: "Phone", DataType: "string", MaxLength: 50 },
        { Label: "电话", Name: "Telephone", DataType: "string", MaxLength: 50 },
        { Label: "传真", Name: "Fax", DataType: "string", MaxLength: 50 },
        { Label: "地址", Name: "Address", DataType: "string", MaxLength: 200 },
        { Label: "备注", Name: "Remark", DataType: "string", MaxLength: 200 },
        { Label: "创建时间", Name: "CreateDate", DataType: "DateTime" }]
    }

    function GetEditProperty() {
        return { ColSpan: 12, LabelCol: 6, WrapperCol: 16 }
    }

})();