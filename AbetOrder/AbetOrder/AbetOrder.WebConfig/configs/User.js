(function () {
    window.configs.User = {
        Name: "User",
        Title: "用户",
        EntityName: "User",
        PrimaryKey: "UserId",
        TemplateName: "EntityListPage",
        SelectNames: ["UserId", "RowVersion", "UserName", "DataRightName", "LogiNName", "Phone", "Telephone", "Fax", "Address", "LastLoginDate"],
        SearchNames: ["UserName,LoginName"],
        DataColumnNames: ["UserName", "LoginName", "Phone", "Telephone", "Fax", "Address", "DataRightName", "LastLoginDate"],
        EditNames: ["UserName", "LoginName", "LoginPassword", "AgainLoginPassword", "Phone", "Telephone", "Fax", "Address", "DataRight", "BankCardNo", "OpenBank"],
        OrderByList: [{ Name: "CreateDate", IsDesc: true }],
        Properties: GetProperties(),
        EditViewWidth: 900
    };

    function GetProperties() {
        return [{ Label: "名称", Name: "UserName,LoginName", DataType: "string", MaxLength: 50 },
        { Label: "用户名", X: 1, Y: 1, Name: "UserName", DataType: "string", MaxLength: 50, EditProperty: GetEditProperty(), IsNullable: false },
        { Label: "登录名", X: 1, Y: 2, Name: "LoginName", DataType: "string", MaxLength: 50, EditProperty: GetEditProperty(), IsNullable: false },
        { Label: "登录密码", X: 2, Y: 1, Name: "LoginPassword", ControlType: "password", DataType: "string", EditProperty: GetEditProperty(), MaxLength: 50 },
        { Label: "确认密码", X: 2, Y: 2, Name: "AgainLoginPassword", ControlType: "password", DataType: "string", EditProperty: GetEditProperty(), MaxLength: 50 },
        { Label: "手机", X: 3, Y: 1, Name: "Phone", DataType: "string", EditProperty: GetEditProperty(), MaxLength: 50 },
        { Label: "电话", X: 3, Y: 2, Name: "Telephone", DataType: "string", EditProperty: GetEditProperty(), MaxLength: 50 },
        { Label: "传真", X: 4, Y: 1, Name: "Fax", DataType: "string", EditProperty: GetEditProperty(), MaxLength: 50 },
        { Label: "银行账号", X: 5, Y: 1, Name: "BankCardNo", DataType: "string", EditProperty: GetEditProperty(), MaxLength: 50 },
        { Label: "开户行", X: 5, Y: 2, Name: "OpenBank", DataType: "string", EditProperty: GetEditProperty(), MaxLength: 50 },
        { Label: "地址", X: 6, Y: 1, ColSpan: 24, LabelCol: 3, WrapperCol: 20, Name: "Address", DataType: "string", MaxLength: 200 },
        { Label: "数据权限", X: 4, Y: 2, Name: "DataRight", DataType: "int", EditProperty: GetEditProperty(), Type: "Select", DefaultValue: "0", IsNullable: false, DataSource: GetDataSource() },
        { Label: "数据权限", Name: "DataRightName", DataType: "string" },
        { Label: "最近登录时间", Name: "LastLoginDate", DataType: "DateTime" }]
    }

    function GetEditProperty() {
        return { ColSpan: 12, LabelCol: 6, WrapperCol: 16 }
    }

    function GetDataSource() {
        return [{ Value: "1", Text: "公司" },
        { Value: "2", Text: "工厂" }, { Value: "3", Text: "管理员" }]
    }

})();