(function () {
    window.configs.Login = {
        Text: "登录",
        Width: 450,
        Height: 300,
        MaximizeBox: false,
        FormBorderStyle: "FixedSingle",
        StartPosition: "CenterScreen",
        Properties: [{
            Name: "LoginName",
            Label: "登录名：",
            ControlType: "TextBox",
            LabelWidth: 100,
            ControlWidth: 200,
            Width: 310,
            Height: 40,
            IsNullable: false,
            X: 1,
            Y: 1
        },
        {
            Name: "LoginPassword",
            Label: "登录密码：",
            ControlType: "Password",
            IsNullable: false,
            X: 2,
            Y: 1
        },
        {
            Name: "Login",
            Text: "登录",
            ControlType: "Button",
            X: 275,
            Y: 100,
            IsPoint: true
        }]
    };
})();