const PageEntityConfigs = {
    Name: "表单",
    PageName: "ListPage",
    IsPage: true,
    IsDataRight: false,
    IsDataStatus: false,
    IsExcelExport: false,
    IsExcelImport: false,
    IsLookLog: false,
    IsBatchDelete: false,
    Entity: {
        Id: "A2FACD99-F429-4833-9173-B5E0CB2BF3F7",
        Name: "DataEntity",
        Label: "表单",
        PrimaryKey: "EntityId",
        IsSelectKey: true,
        ComplexQueryList: [{
            EntityName: "DataProperty",
            PropertyName: "Properties",
            SelectNames: ["PropertyId", "PropertyName", "DataType", "MaxLength", "IsIndex", "IsNullable"]
        }],
        Properties: [{
            Name: "EntityName",
            Label: "表单名",
            MaxLength: 50,
            IsNullable: false,
            SearchOptions: {
                X: 1,
                Y: 1,
                ControlWidth: 150,
                Logic: "like"
            },
            EditOptions: {
                X: 1,
                Y: 1,
                LabelWidth: 120,
                ControlWidth: 300
            },
            DataOptions: {
                X: 1,
                ColumnWidth: 200
            }
        },
        {
            Name: "KeyNames",
            Label: "唯一字段名集合",
            MaxLength: 50,
            ControlWidth: 300,
            EditOptions: {
                X: 1,
                Y: 2,
                LabelWidth: 120,
                ControlWidth: 300
            },
            DataOptions: {
                X: 2,
                ColumnWidth: 200
            }
        },
        {
            Name: "CreateDate",
            Label: "创建时间",
            DataOptions: {
                X: 3,
                ColumnWidth: 200
            }
        },
        {
            Name: "Properties",
            EditOptions: {
                X: 2,
                Y: 1,
                Height: 400,
                ControlWidth: 850
            },
            IsNullable: false,
            Label: "字段列表",
            ControlType: "GridView",
            Entity: {
                Id: "A2FACD99-F429-4833-9173-B5E0CB2BF3F8",
                Name: "DataProperty",
                Label: "字段",
                PrimaryKey: "PropertyId",
                Properties: [{
                    Name: "PropertyName",
                    Label: "字段名",
                    MaxLength: 50,
                    IsNullable: false,
                    EditOptions: {
                        X: 1,
                        Y: 1,
                        ControlWidth: 300
                    },
                    DataOptions: {
                        X: 1,
                        ColumnWidth: 200
                    }
                },
                {
                    Name: "DataType",
                    Label: "数据类型",
                    Options: [{ Value: "string", Text: "字符串" },
                    { Value: "int", Text: "整数" },
                    { Value: "long", Text: "长整数" },
                    { Value: "date", Text: "日期" },
                    { Value: "float", Text: "浮点数" },
                    { Value: "money", Text: "货币" },
                    { Value: "guid", Text: "全局唯一标识符（用于表单关联）" }],
                    ControlType: "DownList",
                    IsEmpty: false,
                    EditOptions: {
                        X: 2,
                        Y: 1,
                        ControlWidth: 300
                    },
                    DataOptions: {
                        X: 2,
                        ColumnWidth: 200
                    }
                },
                {
                    Name: "MaxLength",
                    Label: "字符串最大长度",
                    IsEmpty: false,
                    ControlType: "DownList",
                    Options: [{ Value: "50", Text: "50" },
                    { Value: "500", Text: "500" },
                    { Value: "2000", Text: "2000" },
                    { Value: "4000", Text: "4000" },
                    { Value: "0", Text: "不限" }],
                    EditOptions: {
                        X: 3,
                        Y: 1,
                        ControlWidth: 300
                    },
                    DataOptions: {
                        X: 3,
                        ColumnWidth: 120
                    }
                },
                {
                    Name: "IsIndex",
                    Label: "是否索引",
                    ControlType: "CheckBox",
                    CheckedValue: "1",
                    UnCheckedValue: "0",
                    EditOptions: {
                        X: 4,
                        Y: 1,
                        LabelWidth: 100
                    },
                    DataOptions: {
                        X: 4,
                        ColumnWidth: 100
                    }
                },
                {
                    Name: "IsNullable",
                    Label: "是否必填",
                    ControlType: "CheckBox",
                    CheckedValue: "0",
                    UnCheckedValue: "1",
                    EditOptions: {
                        X: 4,
                        Y: 2,
                        LabelWidth: 50
                    },
                    DataOptions: {
                        X: 5,
                        ColumnWidth: 100
                    }
                }]
            }
        }]
    }
}