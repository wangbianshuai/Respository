using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WindowsFramework.View
{
    /// <summary>
    /// 登录
    /// </summary>
    public class Login
    {
        public object View { get; set; }

        public Login()
        {
            View = new
            {
                Text = "登录",
                Width = 450,
                Height = 300,
                MaximizeBox = false,
                FormBorderStyle = "FixedSingle",
                StartPosition = "CenterScreen",
                Properties = GetPropertyList()
            };
        }

        private List<object> GetPropertyList()
        {
            List<object> propertyList = new List<object>();

            propertyList.Add(LoginName);
            propertyList.Add(LoginPassword);
            propertyList.Add(LoginButton);

            return propertyList;
        }

        //登录名
        private object LoginName = new
        {
            Name = "LoginName",
            Label = "登录名：",
            ControlType = "TextBox",
            LabelWidth = 100,
            ControlWidth = 200,
            Width = 310,
            Height = 40,
            IsNullable = false,
            X = 1,
            Y = 1
        };

        //登录密码
        private object LoginPassword = new
        {
            Name = "LoginPassword",
            Label = "登录密码：",
            ControlType = "Password",
            IsNullable = false,
            X = 2,
            Y = 1
        };

        private object LoginButton = new
        {
            Name = "Login",
            Text = "登录",
            ControlType = "Button",
            X = 275,
            Y = 100,
            IsPoint = true
        };
    }
}
