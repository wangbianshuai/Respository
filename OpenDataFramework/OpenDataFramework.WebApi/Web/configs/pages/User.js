const PageEntityConfigs = {
    Name: "用户",
    PageName: "ListPage",
    IsPage: true,
    IsDataRight: false,
    IsDataStatus: false,
    IsLookLog: false,
    IsBatchDelete: false,
    IsExcelImport: false,
    IsExcelExport: false,
    Entity: {
        Id: "A2FACD99-F429-4833-9173-B5E0CB2BF3F6",
        Name: "User",
        Label: "用户",
        PrimaryKey: "UserId",
        IsSelectKey: true,
        Properties: [{
            Name: "UserName",
            Label: "用户名",
            ControlType: "TextBox",
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
                Y: 1
            },
            DataOptions: {
                X: 1
            }
        },
        {
            Name: "LoginName",
            Label: "登录名",
            ControlType: "TextBox",
            MaxLength: 50,
            IsNullable: false,
            SearchOptions: {
                X: 1,
                Y: 2,
                ControlWidth: 150,
                Logic: "like"
            },
            EditOptions: {
                X: 2,
                Y: 1
            },
            DataOptions: {
                X: 2
            }
        },
        {
            Name: "LoginPassword",
            Label: "登录密码",
            ControlType: "Password",
            MaxLength: 50,
            EditOptions: {
                X: 3,
                Y: 1
            }
        },
        {
            Name: "AgainLoginPassword",
            Label: "确认密码",
            ControlType: "Password",
            MaxLength: 50,
            EditOptions: {
                X: 4,
                Y: 1
            }
        },
        {
            Name: "DepartId",
            Label: "部门",
            MaxLength: 50,
            ControlType: "DownList",
            DataSource: {
                EntityName: "部门",
                ValueName: "DataId",
                TextName: "名称",
                SelectNames: ["DataId", "名称"]
            },
            SearchOptions: {
                X: 2,
                Y: 1,
                ControlWidth: 150,
            },
            EditOptions: {
                X: 5,
                Y: 1
            },
            DataOptions: {
                X: 3
            }
        },
        {
            Name: "DataRight",
            Label: "数据权限",
            ControlType: "DownList",
            Options: [{ Value: 1, Text: "用户" }, { Value: 2, Text: "部门" }, { Value: 3, Text: "公司" }],
            SearchOptions: {
                X: 2,
                Y: 2,
                ControlWidth: 150,
            },
            EditOptions: {
                X: 6,
                Y: 1
            },
            DataOptions: {
                X: 4
            }
        },
        {
            Name: "CreateDate",
            Label: "创建时间",
            DataOptions: {
                X: 5
            }
        }],
        ExpandSetEditData: function (data, blUpdate, ns) {
            const { Common } = ns.utils
            let message = "", blSucceed = true
            if (!blUpdate) {
                if (!data.LoginPassword) {
                    message = "登录密码不能为空！"
                    blSucceed = false
                }
            }
            if (blSucceed && !Common.IsNullOrEmpty(data.LoginPassword) && data.LoginPassword !== data.AgainLoginPassword) {
                message = "登录密码与确认密码不一致！"
                blSucceed = false
            }
            if (!blSucceed) {
                Common.Alert(message)
                return false
            }

            if (data.AgainLoginPassword) delete data.AgainLoginPassword;
            if (data.LoginPassword) data.LoginPassword = Common.ComputeMd5(data.LoginPassword)

            return data
        }
    }
}