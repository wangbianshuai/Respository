const PageEntityConfigs = {
    Name: "键值配置",
    PageName: "ListPage",
    IsPage: true,
    IsDataRight: false,
    IsDataStatus: false,
    IsLookLog: false,
    IsBatchDelete: false,
    Entity: {
        Id: "A2FACD99-F429-4833-9173-B5E0CB2BF3F5",
        Name: "键值配置",
        PrimaryKey: "DataId",
        IsSelectKey: true,
        Properties: [{
            Name: "键名",
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
                ControlWidth: 450
            },
            DataOptions: {
                X: 1
            }
        },
        {
            Name: "值",
            ControlType: "TextArea",
            MaxLength: 500,
            IsNullable: false,
            EditOptions: {
                X: 2,
                Y: 1,
                Height: 60,
                ControlWidth: 450
            },
            DataOptions: {
                X: 2
            }
        },
        {
            Name: "CreateDate",
            Label: "创建时间",
            DataOptions: {
                X: 3
            }
        }]
    }
}