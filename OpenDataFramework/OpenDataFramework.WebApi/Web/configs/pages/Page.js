const PageEntityConfigs = {
    Name: "页面",
    PageName: "ListPage",
    IsPage: true,
    IsDataRight: false,
    IsDataStatus: false,
    IsExcelExport: false,
    IsExcelImport: false,
    IsLookLog: false,
    IsBatchDelete: false
}

PageEntityConfigs.SearchLayoutEntity = {
    Id: "A2FACD99-F429-4833-9173-B5E0CB2BF3F5",
    Name: "页面",
    PrimaryKey: "DataId",
    Label: "查询布局",
    Properties: [
        {
            Name: "表单",
            IsEdit: true,
            EditOptions: {
                IsVisible: false
            }
        },
        {
            Name: "查询字段布局",
            IsEdit: true,
            EditOptions: {
                IsVisible: false
            }
        },
        {
            Name: "Properties",
            EditOptions: {
                X: 1,
                Y: 1,
                Height: 400,
                ControlWidth: 850
            },
            IsNullable: false,
            Label: "字段布局",
            ControlType: "GridView",
            Entity: {
                Name: "DataOption",
                Label: "字段",
                PrimaryKey: "Id",
                Properties: [{
                    Name: "PropertyId",
                    Label: "字段名",
                    MaxLength: 50,
                    IsNullable: false,
                    ControlType: "DownList",
                    DataSource: {
                        EntityName: "DataProperty",
                        SelectNames: ["PropertyId", "PropertyName"],
                        ValueName: "PropertyId",
                        TextName: "PropertyName",
                    },
                    EditOptions: {
                        X: 1,
                        Y: 1,
                        ControlWidth: 300
                    },
                    DataOptions: {
                        X: 1,
                        ColumnWidth: 180
                    }
                },
                {
                    Name: "ControlType",
                    Label: "控件类型",
                    Options: [{ Value: "TextBox", Text: "文本框" },
                    { Value: "DownList", Text: "下拉列表" },
                    { Value: "TextDate", Text: "日期文本框" },
                    { Value: "TextSelect", Text: "文本框选择" }],
                    ControlType: "DownList",
                    IsEmpty: false,
                    EditOptions: {
                        X: 2,
                        Y: 1,
                        ControlWidth: 300
                    },
                    DataOptions: {
                        X: 2,
                        ColumnWidth: 80
                    }
                },
                {
                    Name: "DataSourceId",
                    Label: "数据源",
                    IsEmpty: true,
                    ControlType: "TextSelect",
                    DataSource: {
                        EntityName: "数据源",
                        SelectNames: ["DataId", "名称"],
                        ValueName: "DataId",
                        TextName: "名称",
                    },
                    EditOptions: {
                        X: 3,
                        Y: 1,
                        ControlWidth: 300
                    }
                },
                {
                    Name: "LabelWidth",
                    Label: "标签宽度",
                    IsNullable: false,
                    MaxLength: 4,
                    DefaultValue: 100,
                    IsNumber: true,
                    EditOptions: {
                        X: 4,
                        Y: 1,
                        ControlWidth: 100
                    },
                    DataOptions: {
                        X: 3,
                        ColumnWidth: 60
                    }
                },
                {
                    Name: "ControlWidth",
                    Label: "控件宽度",
                    MaxLength: 4,
                    IsNullable: false,
                    DefaultValue: 200,
                    IsNumber: true,
                    EditOptions: {
                        X: 4,
                        Y: 2,
                        LabelWidth: 90,
                        ControlWidth: 100
                    },
                    DataOptions: {
                        X: 4,
                        ColumnWidth: 60
                    }
                },
                {
                    Name: "Point",
                    Label: "行列坐标",
                    DataOptions: {
                        X: 5,
                        ColumnWidth: 60
                    }
                },
                {
                    Name: "X",
                    Label: "行坐标X",
                    IsNumber: true,
                    IsEmpty: false,
                    ControlType: "DownList",
                    Options: (function () {
                        let options = [];
                        for (let i = 1; i <= 10; i++) options.push(i)
                        return options
                    })(),
                    EditOptions: {
                        X: 5,
                        Y: 1,
                        ControlWidth: 100
                    }
                },
                {
                    Name: "Y",
                    Label: "列坐标Y",
                    IsEmpty: false,
                    IsNumber: true,
                    ControlType: "DownList",
                    Options: (function () {
                        let options = [];
                        for (let i = 1; i <= 10; i++) options.push(i)
                        return options
                    })(),
                    EditOptions: {
                        X: 5,
                        Y: 2,
                        LabelWidth: 90,
                        ControlWidth: 100
                    }
                },
                {
                    Name: "Logic",
                    Label: "查询逻辑符",
                    IsEmpty: false,
                    ControlType: "DownList",
                    Options: [{ Value: "=", Text: "等于" },
                    { Value: ">=", Text: "大于等于" },
                    { Value: "<=", Text: "小于等于" },
                    { Value: "<", Text: "小于" },
                    { Value: "<>", Text: "不等于" },
                    { Value: "like", Text: "模糊匹配" },
                    { Value: "in", Text: "包含" },
                    { Value: "notin", Text: "不包含" },
                    { Value: "isnull", Text: "为空" },
                    { Value: "notnull", Text: "不为空" }],
                    EditOptions: {
                        X: 6,
                        Y: 1,
                        ControlWidth: 300
                    },
                    DataOptions: {
                        X: 3,
                        ColumnWidth: 80
                    }
                },
                {
                    Name: "DefaultValue",
                    Label: "默认值",
                    MaxLength: 500,
                    EditOptions: {
                        X: 7,
                        Y: 1,
                        ControlWidth: 300
                    },
                    DataOptions: {
                        X: 4,
                        ColumnWidth: 150
                    }
                },
                {
                    Name: "IsVisible",
                    Label: "是否显示",
                    ControlType: "CheckBox",
                    IsBool: true,
                    Checked: true,
                    EditOptions: {
                        X: 8,
                        Y: 1,
                        LabelWidth: 100
                    },
                    DataOptions: {
                        X: 5,
                        ColumnWidth: 60
                    }
                },
                {
                    Name: "IsEmpty",
                    Label: "是否空选项",
                    ControlType: "CheckBox",
                    IsBool: true,
                    Checked: true,
                    EditOptions: {
                        X: 8,
                        Y: 2,
                        LabelWidth: 50
                    }
                }],
                ExpandPageInit: function (ns) {
                    if (this.PageName === "EditPage" || this.ControlType === "GridView") {
                        let list = this.Entity.Properties.filter(f => f.Name === "PropertyId")
                        if (list.length === 1) {
                            let p = list[0];
                            let entityId = this.Entity.RowData["表单"]
                            p.DataSource.CacheName = "DataProperty_" + entityId.substring(0, 8);
                            p.DataSource.Conditions = [{ Name: "EntityId", Logic: "=", Value: entityId }]
                        }
                    }
                },
                ExpandSetEditData: function (data, blUpdate, ns) {
                    let x = data.X, y = data.Y;
                    data.Point = `(${x},${y})`;

                    let numberNames = [], boolNames = [];
                    this.Entity.Properties.forEach(p => {
                        if (p.IsNumber) numberNames.push(p.Name);
                        if (p.IsBool) boolNames.push(p.Name);
                    })

                    return ns.utils.Common.GetObjectValue(data, numberNames, boolNames);
                }
            }
        }
    ],
    ExpandPageInit: function (ns) {
        if (this.PageName === "EditPage" && this.IsUpdate) {
            let list = this.Entity.Properties.filter(f => f.Name === "Properties")
            if (list.length === 1) list[0].Entity.RowData = this.RowData
        }
    },
    ExpandSetEditData: function (data, blUpdate, ns) {
        data["查询字段布局"] = JSON.stringify(data.Properties);
        delete data.Properties

        return data
    },
    ExpandGetEditData: function (data, ns) {
        data.Properties = data["查询字段布局"] ? JSON.parse(data["查询字段布局"]) : []
    }
}

PageEntityConfigs.SelectGridViewOkAction = function (e, c) {
    var ns = window.OpenDataFramework;
    var Common = ns.utils.Common
    var editPage = this.Target.Page
    var id = editPage.EntityData["表单"]
    var dataGrid = editPage.GetDataGridComponent("Properties")
    if (dataGrid === null) return

    new ns.components.SelectGridView({
        Width: 880,
        Height: 420,
        GridWidth: 880,
        GridHeight: 380,
        Title: "选择字段列表",
        IsSingle: false,
        Entity: GetEntity(id),
        SelectDataGrid: dataGrid,
        SetSelectRowData: SetSelectRowData
    }).Load()

    function SetSelectRowData(p, i, len) {
        return {
            Id: Common.CreateGuid(),
            PropertyId: p.PropertyId,
            PropertyName: p.PropertyName,
            X: i + len,
            IsVisible: true
        }
    }
   
    function GetEntity(id) {
        return {
            Name: "DataProperty",
            Label: "字段",
            PrimaryKey: "PropertyId",
            IsSelectKey: true,
            IsRowVersion: false,
            OrderByList: [],
            Properties: [{
                Name: "EntityId",
                DefaultValue: id,
                SearchOptions: {
                    IsVisible: false
                }
            },
            {
                Name: "PropertyName",
                Label: "字段名",
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
                { Value: "guid", Text: "全局唯一标识符（用户于表单关联）" }],
                DataOptions: {
                    X: 2,
                    ColumnWidth: 200
                }
            },
            {
                Name: "MaxLength",
                Label: "字符串最大长度",
                Options: [{ Value: "50", Text: "50" },
                { Value: "500", Text: "500" },
                { Value: "2000", Text: "2000" },
                { Value: "4000", Text: "4000" },
                { Value: "0", Text: "不限" }],
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
                DataOptions: {
                    X: 5,
                    ColumnWidth: 100
                }
            }]
        }
    }
}

PageEntityConfigs.DataLayoutEntity = {
    Id: "A2FACD99-F429-4833-9173-B5E0CB2BF3F5",
    Name: "页面",
    PrimaryKey: "DataId",
    Label: "数据列布局",
    Properties: [
        {
            Name: "表单",
            IsEdit: true,
            EditOptions: {
                IsVisible: false
            }
        },
        {
            Name: "数据列字段布局",
            IsEdit: true,
            EditOptions: {
                IsVisible: false
            }
        },
        {
            Name: "SelectProperties",
            Label: "选择",
            ControlType: "Button",
            ActionInvoke: PageEntityConfigs.SelectGridViewOkAction,
            EditOptions: {
                X: 1,
                Y: 1
            },
        },
        {
            Name: "Properties",
            EditOptions: {
                X: 2,
                Y: 1,
                Height: 400,
                ControlWidth: 490
            },
            IsNullable: false,
            Label: "字段布局",
            ControlType: "GridView",
            Entity: {
                Name: "DataOption",
                Label: "字段",
                PrimaryKey: "Id",
                Properties: [{
                    Name: "PropertyId",
                    Label: "字段名",
                    MaxLength: 50,
                    IsNullable: false,
                    ControlType: "DownList",
                    DataSource: {
                        EntityName: "DataProperty",
                        SelectNames: ["PropertyId", "PropertyName"],
                        ValueName: "PropertyId",
                        TextName: "PropertyName",
                    },
                    ExpandSetDataList: function (dataList) {
                        dataList.push({ PropertyId: "A2FACD99-F429-4833-9173-B5E0CB5BF3F6", PropertyName: "创建时间" });
                        return dataList;
                    },
                    EditOptions: {
                        X: 1,
                        Y: 1,
                        ControlWidth: 300
                    },
                    DataOptions: {
                        X: 1,
                        ColumnWidth: 180
                    }
                },
                {
                    Name: "X",
                    Label: "列顺序",
                    IsNumber: true,
                    IsEmpty: false,
                    ControlType: "DownList",
                    Options: (function () {
                        let options = [];
                        for (let i = 1; i <= 50; i++) options.push(i)
                        return options
                    })(),
                    EditOptions: {
                        X: 2,
                        Y: 1,
                        ControlWidth: 100
                    },
                    DataOptions: {
                        X: 2,
                        ColumnWidth: 60
                    }
                },
                {
                    Name: "ColumnWidth",
                    Label: "列宽度",
                    MaxLength: 4,
                    IsNumber: true,
                    EditOptions: {
                        X: 2,
                        Y: 2,
                        LabelWidth: 90,
                        ControlWidth: 100
                    },
                    DataOptions: {
                        X: 3,
                        ColumnWidth: 60
                    }
                },
                {
                    Name: "IsVisible",
                    Label: "是否显示",
                    ControlType: "CheckBox",
                    IsBool: true,
                    Checked: true,
                    EditOptions: {
                        X: 3,
                        Y: 1,
                        LabelWidth: 100
                    },
                    DataOptions: {
                        X: 4,
                        ColumnWidth: 60
                    }
                }],
                ExpandPageInit: function (ns) {
                    if (this.PageName === "EditPage" || this.ControlType === "GridView") {
                        let list = this.Entity.Properties.filter(f => f.Name === "PropertyId")
                        if (list.length === 1) {
                            let p = list[0];
                            let entityId = this.Entity.RowData["表单"]
                            p.DataSource.CacheName = "DataProperty_" + entityId.substring(0, 8);
                            p.DataSource.Conditions = [{ Name: "EntityId", Logic: "=", Value: entityId }]
                        }
                    }
                },
                ExpandSetEditData: function (data, blUpdate, ns) {
                    let numberNames = [], boolNames = [];
                    this.Entity.Properties.forEach(p => {
                        if (p.IsNumber) numberNames.push(p.Name);
                        if (p.IsBool) boolNames.push(p.Name);
                    })

                    return ns.utils.Common.GetObjectValue(data, numberNames, boolNames);
                }
            }
        }
    ],
    ExpandPageInit: function (ns) {
        if (this.PageName === "EditPage" && this.IsUpdate) {
            let list = this.Entity.Properties.filter(f => f.Name === "Properties")
            if (list.length === 1) list[0].Entity.RowData = this.RowData
        }
    },
    ExpandSetEditData: function (data, blUpdate, ns) {
        data["数据列字段布局"] = JSON.stringify(data.Properties);
        delete data.Properties

        return data
    },
    ExpandGetEditData: function (data, ns) {
        data.Properties = data["数据列字段布局"] ? JSON.parse(data["数据列字段布局"]) : []
    }
}

PageEntityConfigs.EditLayoutEntity = {
    Id: "A2FACD99-F429-4833-9173-B5E0CB2BF3F5",
    Name: "页面",
    PrimaryKey: "DataId",
    Label: "编辑布局",
    Properties: [
        {
            Name: "表单",
            IsEdit: true,
            EditOptions: {
                IsVisible: false
            }
        },
        {
            Name: "编辑字段布局",
            IsEdit: true,
            EditOptions: {
                IsVisible: false
            }
        },
        {
            Name: "Properties",
            EditOptions: {
                X: 1,
                Y: 1,
                Height: 400,
                ControlWidth: 850
            },
            IsNullable: false,
            Label: "字段布局",
            ControlType: "GridView",
            Entity: {
                Name: "DataOption",
                Label: "字段",
                PrimaryKey: "Id",
                Properties: [{
                    Name: "PropertyId",
                    Label: "字段名",
                    MaxLength: 50,
                    IsNullable: false,
                    ControlType: "DownList",
                    DataSource: {
                        EntityName: "DataProperty",
                        SelectNames: ["PropertyId", "PropertyName"],
                        ValueName: "PropertyId",
                        TextName: "PropertyName",
                    },
                    EditOptions: {
                        X: 1,
                        Y: 1,
                        ControlWidth: 300
                    },
                    DataOptions: {
                        X: 1,
                        ColumnWidth: 180
                    }
                },
                {
                    Name: "ControlType",
                    Label: "控件类型",
                    Options: [{ Value: "TextBox", Text: "文本框" },
                    { Value: "DownList", Text: "下拉列表" },
                    { Value: "TextDate", Text: "日期文本框" },
                    { Value: "TextSelect", Text: "文本框选择" },
                    { Value: "TextArea", Text: "多文本框" },
                    { Value: "CheckBox", Text: "复选框" }],
                    ControlType: "DownList",
                    IsEmpty: false,
                    EditOptions: {
                        X: 2,
                        Y: 1,
                        ControlWidth: 300
                    },
                    DataOptions: {
                        X: 2,
                        ColumnWidth: 80
                    }
                },
                {
                    Name: "LabelWidth",
                    Label: "标签宽度",
                    IsNullable: false,
                    IsNumber: true,
                    MaxLength: 4,
                    DefaultValue: 100,
                    EditOptions: {
                        X: 3,
                        Y: 1,
                        ControlWidth: 100
                    },
                    DataOptions: {
                        X: 3,
                        ColumnWidth: 60
                    }
                },
                {
                    Name: "ControlWidth",
                    Label: "控件宽度",
                    MaxLength: 4,
                    IsNumber: true,
                    IsNullable: false,
                    DefaultValue: 200,
                    EditOptions: {
                        X: 3,
                        Y: 2,
                        LabelWidth: 90,
                        ControlWidth: 100
                    },
                    DataOptions: {
                        X: 4,
                        ColumnWidth: 60
                    }
                },
                {
                    Name: "Height",
                    Label: "控件高度",
                    MaxLength: 4,
                    IsNumber: true,
                    EditOptions: {
                        X: 4,
                        Y: 1,
                        ControlWidth: 300
                    }
                },
                {
                    Name: "Point",
                    Label: "行列坐标",
                    DataOptions: {
                        X: 5,
                        ColumnWidth: 60
                    }
                },
                {
                    Name: "X",
                    Label: "行坐标X",
                    IsEmpty: false,
                    IsNumber: true,
                    ControlType: "DownList",
                    Options: (function () {
                        let options = [];
                        for (let i = 1; i <= 20; i++) options.push(i)
                        return options
                    })(),
                    EditOptions: {
                        X: 5,
                        Y: 1,
                        ControlWidth: 100
                    }
                },
                {
                    Name: "Y",
                    Label: "列坐标Y",
                    IsEmpty: false,
                    IsNumber: true,
                    ControlType: "DownList",
                    Options: (function () {
                        let options = [];
                        for (let i = 1; i <= 10; i++) options.push(i)
                        return options
                    })(),
                    EditOptions: {
                        X: 5,
                        Y: 2,
                        LabelWidth: 90,
                        ControlWidth: 100
                    }
                },
                {
                    Name: "DataSourceId",
                    Label: "数据源",
                    IsEmpty: true,
                    ControlType: "TextSelect",
                    DataSource: {
                        EntityName: "数据源",
                        SelectNames: ["DataId", "名称"],
                        ValueName: "DataId",
                        TextName: "名称",
                    },
                    EditOptions: {
                        X: 6,
                        Y: 1,
                        ControlWidth: 300
                    },
                    DataOptions: {
                        X: 3,
                        ColumnWidth: 80
                    }
                },
                {
                    Name: "DefaultValue",
                    Label: "默认值",
                    MaxLength: 500,
                    EditOptions: {
                        X: 7,
                        Y: 1,
                        ControlWidth: 300
                    },
                    DataOptions: {
                        X: 4,
                        ColumnWidth: 150
                    }
                },
                {
                    Name: "CheckedValue",
                    Label: "复选框选中值",
                    MaxLength: 50,
                    EditOptions: {
                        X: 8,
                        Y: 1,
                        ControlWidth: 300
                    }
                },
                {
                    Name: "UnCheckedValue",
                    Label: "复选框未选值",
                    MaxLength: 50,
                    EditOptions: {
                        X: 9,
                        Y: 1,
                        ControlWidth: 300
                    }
                },
                {
                    Name: "IsVisible",
                    Label: "是否显示",
                    ControlType: "CheckBox",
                    IsBool: true,
                    Checked: true,
                    EditOptions: {
                        X: 10,
                        Y: 1,
                        LabelWidth: 100
                    },
                    DataOptions: {
                        X: 5,
                        ColumnWidth: 60
                    }
                },
                {
                    Name: "IsEmpty",
                    Label: "是否空选项",
                    ControlType: "CheckBox",
                    IsBool: true,
                    Checked: true,
                    EditOptions: {
                        X: 10,
                        Y: 2,
                        LabelWidth: 50
                    }
                }],
                ExpandPageInit: function (ns) {
                    if (this.PageName === "EditPage" || this.ControlType === "GridView") {
                        let list = this.Entity.Properties.filter(f => f.Name === "PropertyId")
                        if (list.length === 1) {
                            let p = list[0];
                            let entityId = this.Entity.RowData["表单"]
                            p.DataSource.CacheName = "DataProperty_" + entityId.substring(0, 8);
                            p.DataSource.Conditions = [{ Name: "EntityId", Logic: "=", Value: entityId }]
                        }
                    }
                },
                ExpandSetEditData: function (data, blUpdate, ns) {
                    let x = data.X, y = data.Y;
                    data.Point = `(${x},${y})`;

                    let numberNames = [], boolNames = [];
                    this.Entity.Properties.forEach(p => {
                        if (p.IsNumber) numberNames.push(p.Name);
                        if (p.IsBool) boolNames.push(p.Name);
                    })

                    return ns.utils.Common.GetObjectValue(data, numberNames, boolNames);
                }
            }
        }
    ],
    ExpandPageInit: function (ns) {
        if (this.PageName === "EditPage" && this.IsUpdate) {
            let list = this.Entity.Properties.filter(f => f.Name === "Properties")
            if (list.length === 1) list[0].Entity.RowData = this.RowData
        }
    },
    ExpandSetEditData: function (data, blUpdate, ns) {
        data["编辑字段布局"] = JSON.stringify(data.Properties);
        delete data.Properties

        return data
    },
    ExpandGetEditData: function (data, ns) {
        data.Properties = data["编辑字段布局"] ? JSON.parse(data["编辑字段布局"]) : []
    }
}

PageEntityConfigs.EditActionInvoke = function (e, c) {
    new PageEntityConfigs.ns.pages.EditPage({
        Entity: c.Entity,
        RowData: c.RowData,
        IsUpdate: true
    }).Load()
}

PageEntityConfigs.Entity = {
    Id: "A2FACD99-F429-4833-9173-B5E0CB2BF3F5",
    Name: "页面",
    PrimaryKey: "DataId",
    IsSelectKey: true,
    Properties: [{
        Name: "名称",
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
            ControlWidth: 400
        },
        DataOptions: {
            X: 1
        }
    },
    {
        Name: "表单",
        MaxLength: 50,
        IsNullable: false,
        DataSource: {
            EntityName: "DataEntity",
            ValueName: "EntityId",
            TextName: "EntityName",
            SelectNames: ["EntityId", "EntityName"]
        },
        EditOptions: {
            X: 2,
            Y: 1,
            ControlType: "TextSelect",
            ControlWidth: 400
        },
        DataOptions: {
            X: 2
        }
    },
    {
        Name: "查询布局",
        DataOptions: {
            ActionInvoke: PageEntityConfigs.EditActionInvoke,
            ControlType: "LinkButton",
            TextAlign: "center",
            X: 3
        },
        Entity: PageEntityConfigs.SearchLayoutEntity
    },
    {
        Name: "数据列布局",
        DataOptions: {
            ActionInvoke: PageEntityConfigs.EditActionInvoke,
            ControlType: "LinkButton",
            TextAlign: "center",
            X: 4
        },
        Entity: PageEntityConfigs.DataLayoutEntity
    },
    {
        Name: "编辑布局",
        DataOptions: {
            ActionInvoke: PageEntityConfigs.EditActionInvoke,
            ControlType: "LinkButton",
            TextAlign: "center",
            X: 5
        },
        Entity: PageEntityConfigs.EditLayoutEntity
    },
    {
        Name: "IsNewAdd",
        Label: "新增",
        ControlType: "CheckBox",
        CheckedValue: "1",
        UnCheckedValue: "0",
        Checked: true,
        EditOptions: {
            X: 3,
            Y: 1,
            LabelWidth: 100,
            ControlWidth: 50
        }
    },
    {
        Name: "IsEdit",
        Label: "修改",
        ControlType: "CheckBox",
        CheckedValue: "1",
        UnCheckedValue: "0",
        Checked: true,
        EditOptions: {
            X: 3,
            Y: 2,
            LabelWidth: 50,
            ControlWidth: 50
        }
    },
    {
        Name: "IsDelete2",
        Label: "删除",
        ControlType: "CheckBox",
        CheckedValue: "1",
        UnCheckedValue: "0",
        Checked: true,
        EditOptions: {
            X: 3,
            Y: 3,
            LabelWidth: 45,
            ControlWidth: 50
        }
    },
    {
        Name: "IsExcelExport",
        Label: "Excel导出",
        ControlType: "CheckBox",
        CheckedValue: "1",
        UnCheckedValue: "0",
        Checked: true,
        EditOptions: {
            X: 4,
            Y: 1,
            LabelWidth: 100,
            ControlWidth: 50
        }
    },
    {
        Name: "IsExcelImport",
        Label: "Excel导入",
        ControlType: "CheckBox",
        CheckedValue: "1",
        UnCheckedValue: "0",
        Checked: true,
        EditOptions: {
            X: 4,
            Y: 2,
            LabelWidth: 20,
            ControlWidth: 50
        }
    },
    {
        Name: "IsDataRight",
        Label: "数据权限",
        ControlType: "CheckBox",
        CheckedValue: "1",
        UnCheckedValue: "0",
        Checked: true,
        EditOptions: {
            X: 4,
            Y: 3,
            LabelWidth: 20,
            ControlWidth: 50
        }
    },
    {
        Name: "IsDataStatus",
        Label: "数据状态",
        ControlType: "CheckBox",
        CheckedValue: "1",
        UnCheckedValue: "0",
        Checked: true,
        EditOptions: {
            X: 3,
            Y: 4,
            LabelWidth: 45,
            ControlWidth: 50
        }
    },
    {
        Name: "IsLookLog",
        Label: "操作日志",
        ControlType: "CheckBox",
        CheckedValue: "1",
        UnCheckedValue: "0",
        Checked: true,
        EditOptions: {
            X: 4,
            Y: 4,
            LabelWidth: 20,
            ControlWidth: 50
        }
    },
    {
        Name: "IsBatchDelete",
        Label: "批量删除",
        ControlType: "CheckBox",
        CheckedValue: "1",
        UnCheckedValue: "0",
        Checked: true,
        EditOptions: {
            X: 5,
            Y: 1,
            LabelWidth: 100,
            ControlWidth: 50
        }
    },
    {
        Name: "IsBatchSubmit",
        Label: "批量提交",
        ControlType: "CheckBox",
        CheckedValue: "1",
        UnCheckedValue: "0",
        Checked: true,
        EditOptions: {
            X: 5,
            Y: 2,
            LabelWidth: 25,
            ControlWidth: 50
        }
    },
    {
        Name: "IsBatchReject",
        Label: "批量驳回",
        ControlType: "CheckBox",
        CheckedValue: "1",
        UnCheckedValue: "0",
        Checked: true,
        EditOptions: {
            X: 5,
            Y: 3,
            LabelWidth: 25,
            ControlWidth: 50
        }
    },
    {
        Name: "CreateDate",
        Label: "创建时间",
        DataOptions: {
            X: 6
        }
    },
    {
        Name: "操作权限",
        IsEdit: true,
        EditOptions: {
            IsVisible: false
        }
    }],
    ExpandSetEditData: function (data, blUpdate, ns) {
        const { IsNewAdd, IsEdit, IsDelete2, IsExcelExport, IsExcelImport, IsDataRight,
            IsDataStatus, IsLookLog, IsBatchDelete, IsBatchSubmit, IsBatchReject } = data;
        data["操作权限"] = JSON.stringify({
            IsNewAdd, IsEdit, IsDelete2, IsExcelExport, IsExcelImport,
            IsDataRight, IsDataStatus, IsLookLog, IsBatchDelete, IsBatchSubmit, IsBatchReject
        });

        delete data.IsNewAdd;
        delete data.IsEdit;
        delete data.IsDelete2;
        delete data.IsExcelExport;
        delete data.IsExcelImport;
        delete data.IsDataRight;
        delete data.IsDataStatus;
        delete data.IsLookLog;
        delete data.IsBatchDelete;
        delete data.IsBatchSubmit;
        delete data.IsBatchReject;

        return data
    },
    ExpandGetEditData: function (data, ns) {
        let obj = data["操作权限"] ? JSON.parse(data["操作权限"]) : {}
        for (var key in obj) data[key] = obj[key]
    }
}
