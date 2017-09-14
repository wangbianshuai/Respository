(function (config) {
    var optionsProperty = {
        Name: "Options",
        EditOptions: {
            X: 2,
            Y: 1,
            Height: 400,
            ControlWidth: 600,
        },
        Label: "选项集",
        ControlType: "GridView",
        Entity: {
            Name: "Option",
            Label: "选项",
            PrimaryKey: "Id",
            Properties: [{
                Name: "Value",
                Label: "值",
                MaxLength: 50,
                IsNullable: false,
                EditOptions: {
                    X: 1,
                    Y: 1,
                    ControlWidth: 300
                },
                DataOptions: {
                    X: 1,
                    ColumnWidth: 240
                }
            },
            {
                Name: "Text",
                Label: "文本",
                IsNullable: false,
                EditOptions: {
                    X: 2,
                    Y: 1,
                    ControlWidth: 300
                },
                DataOptions: {
                    X: 2,
                    ColumnWidth: 240
                }
            }]
        }
    };

    var property = config.Entity.Properties.filter(f => f.Name === "表单")[0];
    property.DataSource = {
        EntityName: "DataEntity",
        ValueName: "EntityId",
        TextName: "EntityName",
        SelectNames: ["EntityId", "EntityName"],
        Conditions: [{ Name: "KeyNames", Logic: "notnull" }]
    };

    config.Entity.ExpandSetEditData = function (data, blUpdate, ns) {
        data["选项集"] = JSON.stringify(data.Options);
        delete data.Options;
        return data;
    };

    config.Entity.ExpandGetEditData = function (data, ns) {
        data.Options = data["选项集"] ? JSON.parse(data["选项集"]) : [];
    };

    config.Entity.Properties.push({
        Name: "选项集",
        IsEdit: true,
        EditOptions: {
            IsVisible: false
        }
    });
    config.Entity.Properties.push(optionsProperty);
})(window.PageEntityConfigs);