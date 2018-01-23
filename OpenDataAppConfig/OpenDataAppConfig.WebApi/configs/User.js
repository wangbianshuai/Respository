(function () {
    window.configs.User = {
        GridRows: "*",
        GridColumns: "*",
        Properties: [{
            Name: "SignLoginPanel",
            Type: "DockPanel",
            Height: 710,
            GridRowColumn: "0,0",
            ControlAlign: "TopLeft",
            Width: 1250,
            View: GetSignLoginPanelView(),
            X: 335,
            Y: 110
        }]
    };

    function GetSignLoginPanelView() {
        return {
            Properties: [{
                Name: "SignLoginTopPanel",
                Type: "DockPanel",
                Height: 7,
                Dock: "Top",
                BackColor: "#3B91FB"
            },
            {
                Name: "SignLoginBottomPanel",
                Type: "DockPanel",
                Opacity: 10,
                BackColor: "#060001",
                View: GetSignLoginPanelView2()
            }]
        }
    }

    function GetSignLoginPanelView2() {
        return {
            Properties: [{
                Name: "SignBorderPanel",
                Type: "Border",
                BackColor: "#657b9e",
                BorderColor: "#FFFFFF",
                BorderThickness: "1,1,1,1",
                X: 68,
                Y: 125,
                ControlAlign: "TopLeft",
                Width: 500,
                Height: 400,
                View: GetSignBorderPanel2()
            },
            {
                Name: "SignInfoPanel",
                Type: "DockPanel",
                Dock: "Left",
                Width: 568,
                Visible: false,
                View: GetSignInfoPanel()
            },
            {
                Name: "MiddleLine",
                Type: "Border",
                BorderColor: "#BFBFBF",
                BorderThickness: "1,0,0,0",
                X: 68,
                Y: 83,
                ControlAlign: "TopLeft",
                Radius: 0,
                Width: 1,
                Height: 480
            },
            {
                Name: "LoginPanel",
                Type: "StackPanel",
                X: 56,
                Y: 125,
                ControlAlign: "TopLeft",
                Width: 500,
                Height: 400,
                View: GetLoginPanel2View()
            }]
        }
    }

    function GetSignInfoPanel() {
        return {
            Properties: [{
                Name: "SignSucceedPanel",
                Type: "DockPanel",
                Dock: "Top",
                Height: 170,
                View: GetSignSucceedPanel()
            },
            {
                Name: "SignMeegintInfoPanel",
                Type: "DockPanel",
                View: GetSignMeegintInfoPanel()
            }]
        }
    }

    function GetSignSucceedPanel() {
        return {
            Properties: [{
                Name: "SignBorderSucceedPanel",
                Type: "Border",
                BackColor: "#cccccc",
                Opacity: 20,
                Width: 400,
                Height: 70,
                X: 121,
                Y: 60,
                ControlAlign: "TopLeft",
                View: {
                    Properties: [{
                        Name: "SignSucceedPanel2",
                        Type: "StackPanel",
                        IsHorizontal: true,
                        View: GetSignSucceedPanel2()
                    }]
                }
            }]
        }
    }

    function GetSignSucceedPanel2() {
        return {
            Properties: [{
                Name: "SignSucceedImage",
                Type: "Image",
                ImageUrl: "images/SignSucceed.png",
                X: 105,
                Y: 0
            },
            {
                Name: "SignSucceedText",
                Type: "Label",
                Label: "签到成功",
                FontColor: "#ffffff",
                FontSize: 30,
                X: 20,
                Y: 0,
                TextAlign: "MiddleLeft",
                Height: 60,
                LabelWidth: 150
            }]
        }
    }

    function GetLabelView(name, label) {
        return {
            Properties: [{
                Name: name + "Label",
                Type: "Label",
                Label: label,
                FontColor: "#ffffff",
                FontSize: 26,
                ControlAlign: "TopLeft",
                X: 68,
                Y: 0,
                TextAlign: "TopLeft",
                Padding: "0,0,0,0",
                LabelWidth: 200,
                IsDefaultValue: false
            },
            {
                Name: name + "Text",
                Type: "LabelTextBlock",
                FontColor: "#ffffff",
                FontSize: 26,
                X: 12,
                Y: 0,
                TextAlign: "TopRight",
                ControlAlign: "TopLeft",
                Padding: "0,0,0,0",
                ControlWidth: 260,
                IsDefaultValue: false
            }]
        }
    }

    function GetSignMeegintInfoPanel() {
        return {
            Properties: [{
                Name: "MeetingSubjectPanel",
                Type: "StackPanel",
                Dock: "Top",
                Height: 70,
                IsHorizontal: true,
                View: GetLabelView("MeetingSubject", "会议题")
            },
            {
                Name: "EmceePanel",
                Type: "StackPanel",
                Height: 70,
                Dock: "Top",
                IsHorizontal: true,
                View: GetLabelView("Emcee", "主持人")
            },
            {
                Name: "MeetingSecretaryPanel",
                Type: "StackPanel",
                Height: 70,
                Dock: "Top",
                IsHorizontal: true,
                View: GetLabelView("MeetingSecretary", "会议秘书")
            },
            {
                Name: "MeetingServerPanel",
                Type: "StackPanel",
                Height: 70,
                Dock: "Top",
                IsHorizontal: true,
                View: GetLabelView("MeetingServer", "会议服务")
            },
            {
                Name: "MeetingRoomPanel",
                Type: "StackPanel",
                Height: 70,
                Dock: "Top",
                IsHorizontal: true,
                View: GetLabelView("MeetingRoom", "当前会议室")
            },
            {
                Name: "MeetingRightPanel",
                Type: "StackPanel",
                IsHorizontal: true,
                View: GetLabelView("MeetingRight", "会议权限")
            }]
        }
    }

    function GetSignBorderPanel2() {
        return {
            Properties: [{
                Name: "SignBorderPanel2",
                Type: "DockPanel",
                View: GetSignPanelView()
            }]
        }
    }

    function GetLoginPanel2View() {
        return {
            Properties: [{
                Name: "LoginNamePanel",
                Type: "Border",
                BackColor: "#657b9e",
                BorderColor: "#FFFFFF",
                BorderThickness: "1,1,1,1",
                ControlAlign: "TopLeft",
                X: 50,
                Y: 30,
                Width: 400,
                Height: 70,
                View: { Properties: [{ Name: "LoginNamePanel2", Type: "StackPanel", IsHorizontal: true, View: GetLoginNamePanelView() }] }
            },
            {
                Name: "LoginPasswordPanel",
                Type: "Border",
                BackColor: "#657b9e",
                BorderColor: "#FFFFFF",
                BorderThickness: "1,1,1,1",
                ControlAlign: "TopLeft",
                X: 50,
                Y: 40,
                Width: 400,
                Height: 70,
                View: { Properties: [{ Name: "LoginPasswordPanel2", Type: "StackPanel", IsHorizontal: true, View: GetLoginPasswordPanelView() }] }
            },
            {
                Name: "Login",
                ImageUrl: "images/Login.png",
                Type: "ImageTextButton",
                ControlAlign: "TopLeft",
                X: 190,
                Y: 54
            },
            {
                Name: "LoginGoMeeting",
                ImageUrl: "images/LoginGoMeeting.png",
                Type: "ImageTextButton",
                ControlAlign: "TopLeft",
                X: 190,
                Y: 54,
                Visible: false
            }]
        }
    }

    function GetLoginNamePanelView() {
        return {
            Properties: [{
                Name: "UserNameImage",
                ImageUrl: "images/UserName.png",
                Type: "Image",
                X: 25,
                Y: 0
            },
            {
                Name: "UserNameMiddleLine",
                Type: "Border",
                BorderColor: "#BFBFBF",
                BorderThickness: "1,0,0,0",
                X: 22,
                Y: 0,
                Radius: 0,
                Width: 1,
                Height: 50
            },
            {
                Name: "UserNameLabel",
                Type: "Label",
                X: 46,
                Y: 0,
                LabelWidth: 200,
                IsDefaultValue: false,
                Label: "请输入用户名",
                TextAlign: "MiddleLeft",
                FontColor: "#D8D6D6",
                FontSize: 26,
                IsClick: true,
                Visible: false
            },
            {
                Name: "UserName",
                Type: "TextBox",
                X: 46,
                Y: 0,
                Height: 40,
                TextAlign: "MiddleLeft",
                Padding: "0,0,0,0",
                ControlWidth: 200,
                FontSize: 26
            }]
        }
    }

    function GetLoginPasswordPanelView() {
        return {
            Properties: [{
                Name: "PasswordImage",
                ImageUrl: "images/Password.png",
                Type: "Image",
                X: 25,
                Y: 0
            },
            {
                Name: "PasswordMiddleLine",
                Type: "Border",
                BorderColor: "#BFBFBF",
                BorderThickness: "1,0,0,0",
                X: 22,
                Y: 0,
                Radius: 0,
                Width: 1,
                Height: 50
            },
            {
                Name: "LoginPasswordLabel",
                Type: "Label",
                X: 46,
                Y: 0,
                LabelWidth: 200,
                IsDefaultValue: false,
                Label: "请输入密码",
                TextAlign: "MiddleLeft",
                FontColor: "#D8D6D6",
                FontSize: 26,
                IsClick: true,
                Visible: false
            },
            {
                Name: "LoginPassword",
                Type: "Password",
                X: 46,
                Y: 0,
                Height: 40,
                TextAlign: "MiddleLeft",
                Padding: "0,0,0,0",
                ControlWidth: 200,
                FontSize: 26
            }]
        }
    }

    function GetSignPanelView() {
        return {
            Properties: [{
                Name: "SignName",
                Type: "InkCanvas",
                DefaultWidth: 5,
                BackColor: "Transparent",
                Width: 490,
                Height: 390,
                IsKeyUp: true,
                IsMouseEnter: true,
                IsBackKey: true,
                View: {
                    Properties: [{
                        Name: "SignNameLabel",
                        Type: "Label",
                        FontSize: 26,
                        LabelWidth: 490,
                        Height: 390,
                        FontColor: "#ffffff",
                        TextAlign: "MiddleCenter",
                        IsDefaultValue: false,
                        Label: "手写签到(按Back键清除)"
                    }]
                }
            }]
        }
    }
})();