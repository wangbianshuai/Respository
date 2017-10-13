﻿(function () {
    window.configs.UserManage = {
        Text: "用户管理",
        Width: 1000,
        Height: 600,
        WindowsState: "Maximized",
        Properties: [{
            Name: "QueryGroupBox",
            ControlType: "GroupBox",
            Dock: "Top",
            Height: 100,
            View: GetQueryView()
        },
        {
            Name: "DataGroupBox",
            ControlType: "GroupBox",
            Dock: "Fill",
            View: GetDataView()
        }]
    };

    function GetQueryView() {
        return {
            Properties: [{
                Name: "LoginName",
                Label: "登录名：",
                ControlType: "TextBox",
                IsNullable: false,
                X: 1,
                Y: 1
            },
            {
                Name: "UserName",
                Label: "用户名：",
                ControlType: "TextBox",
                IsNullable: false,
                X: 1,
                Y: 2
            },
            {
                Name: "Query",
                Text: "查询",
                ControlType: "Button",
                X: 1,
                Y: 3
            },
            {
                Name: "Add",
                Text: "新增用户",
                ControlType: "Button",
                ControlWidth: 80,
                View: GetEditView(),
                X: 1,
                Y: 4
            }
            ]
        }
    }

    function GetDataView() {
        return {
            Properties: [{
                Name: "UserGridView",
                ControlType: "GridView",
                Dock: "Fill",
                View: GetDataColumnView()
            }]
        }
    }

    function GetDataColumnView() {
        return {
            Properties: [{
                Name: "LoginName",
                Label: "登录名",
                X: 1
            }, {
                Name: "UserName",
                Label: "用户名",
                X: 2
            },
            {
                Name: "CreateDate",
                Label: "创建时间",
                X: 3
            }
            ]
        }
    }

    function GetEditView() {
        return {
            Properties: [{
                Name: "LoginName",
                Label: "登录名：",
                ControlType: "TextBox",
                IsNullable: false,
                X: 1,
                Y: 1
            },
            {
                Name: "UserName",
                Label: "用户名：",
                ControlType: "TextBox",
                IsNullable: false,
                X: 1,
                Y: 2
            }]
        }
    }

})();