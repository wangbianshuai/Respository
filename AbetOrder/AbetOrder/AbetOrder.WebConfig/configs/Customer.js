(function () {
    window.configs.Customer = {
        Name: "Customer",
        Title: "客户",
        EntityName: "Customer",
        PrimaryKey: "Id",
        TemplateName: "EntityListPage",
        SelectNames: ["Id", "RowVersion", "Name", "CompanyName", "Linkman", "Phone", "Consignee", "ConsigneePhone", "Remark", "CreateDate"],
        SearchNames: ["Name,CompanyName"],
        DataColumnNames: ["Name", "CompanyName", "Linkman", "Phone", "Consignee", "ConsigneePhone", "Remark", "CreateDate"],
        EditNames: ["Name", "CompanyName", "Linkman", "Phone", "Telephone", "Fax", "Consignee", "ConsigneePhone", "DepotName", "DepotAddress", "Address", "Remark"],
        OrderByList: [{ Name: "CreateDate", IsDesc: true }],
        Properties: GetProperties(),
        EditViewWidth: 900
    };

    function GetProperties() {
        return [{ Label: "名称", Name: "Name,CompanyName", DataType: "string", MaxLength: 50 },
        { Label: "名称", X: 1, Y: 1, Name: "Name", DataType: "string", MaxLength: 50, EditProperty: GetEditProperty(), IsNullable: false },
        { Label: "公司名称", X: 1, Y: 2, Name: "CompanyName", DataType: "string", EditProperty: GetEditProperty(), MaxLength: 50 },
        { Label: "联系人", X: 2, Y: 1, Name: "Linkman", DataType: "string", EditProperty: GetEditProperty(), MaxLength: 50 },
        { Label: "手机", X: 2, Y: 2, Name: "Phone", DataType: "string", EditProperty: GetEditProperty(), MaxLength: 50 },
        { Label: "电话", X: 3, Y: 1, Name: "Telephone", DataType: "string", EditProperty: GetEditProperty(), MaxLength: 50 },
        { Label: "传真", X: 3, Y: 2, Name: "Fax", DataType: "string", EditProperty: GetEditProperty(), MaxLength: 50 },
        { Label: "公司地址", X: 4, Y: 1, Name: "Address", DataType: "string", EditProperty: GetEditProperty(), MaxLength: 200 },
        { Label: "收货人", X: 4, Y: 2, Name: "Consignee", DataType: "string", EditProperty: GetEditProperty(), MaxLength: 50 },
        { Label: "收货人电话", X: 5, Y: 1, Name: "ConsigneePhone", DataType: "string", EditProperty: GetEditProperty(), MaxLength: 50 },
        { Label: "仓库名称", X: 5, Y: 2, Name: "DepotName", DataType: "string", EditProperty: GetEditProperty(), MaxLength: 50 },
        { Label: "仓库地址", X: 6, Y: 1, Name: "DepotAddress", DataType: "string", EditProperty: GetEditProperty(), MaxLength: 200 },
        { Label: "备注", X: 6, Y: 2, Name: "Remark", DataType: "string", EditProperty: GetEditProperty(), MaxLength: 200 },
        { Label: "创建时间", Name: "CreateDate", DataType: "DateTime" }]
    }


    function GetEditProperty() {
        return { ColSpan: 12, LabelCol: 6, WrapperCol: 16 }
    }

})();