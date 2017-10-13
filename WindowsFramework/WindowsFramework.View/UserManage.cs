using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WindowsFramework.View
{
    public class UserManage
    {
        public object View = new
        {
            Text = "用户管理",
            Width = 1000,
            Height = 600,
            WindowsState = "Maximized",
            Properties = new object[]{
                new {   
                    Name = "QueryGroupBox",
                    ControlType = "GroupBox",
                    Dock = "Top",
                    View = new UserQuery().View,
                    Height = 100
                },
                new { 
                    Name = "DataGroupBox",
                    ControlType = "GroupBox",
                    Dock = "Fill",
                    View = new UserData().View
                }
            }
        };
    }

    public class UserQuery
    {
        public object View { get; set; }

        public UserQuery()
        {
            View = new
            {
                Properties = GetPropertyList()
            };
        }

        private List<object> GetPropertyList()
        {
            List<object> propertyList = new List<object>();

            propertyList.Add(LoginName);
            propertyList.Add(UserName);
            propertyList.Add(Query);
            propertyList.Add(Add);

            return propertyList;
        }

        //登录名
        private object LoginName = new
        {
            Name = "LoginName",
            Label = "登录名：",
            ControlType = "TextBox",
            IsNullable = false,
            X = 1,
            Y = 1
        };

        private object UserName = new
        {
            Name = "UserName",
            Label = "用户名：",
            ControlType = "TextBox",
            IsNullable = false,
            X = 1,
            Y = 2
        };

        private object Query = new
        {
            Name = "Query",
            Text = "查询",
            ControlType = "Button",
            X = 1,
            Y = 3
        };

        private object Add = new
        {
            Name = "Add",
            Text = "新增用户",
            ControlType = "Button",
            ControlWidth = 80,
            X = 1,
            Y = 4
        };
    }

    public class UserData
    {
        public object View { get; set; }

        public UserData()
        {
            View = new
            {
                Properties = GetPropertyList()
            };
        }

        private List<object> GetPropertyList()
        {
            List<object> propertyList = new List<object>();

            propertyList.Add(UserGridView);

            return propertyList;
        }

        private object UserGridView = new
        {
            Name = "UserGridView",
            ControlType = "GridView",
            Dock = "Fill",
            View = new UserColumn().View
        };
    }

    public class UserColumn
    {
        public object View { get; set; }

        public UserColumn()
        {
            View = new
            {
                Properties = GetPropertyList()
            };
        }

        private List<object> GetPropertyList()
        {
            List<object> propertyList = new List<object>();

            propertyList.Add(LoginName);
            propertyList.Add(UserName);
            propertyList.Add(CreateDate);

            return propertyList;
        }

        private object LoginName = new
        {
            Name = "LoginName",
            Label = "登录名",
            X = 1
        };

        private object UserName = new
        {
            Name = "UserName",
            Label = "用户名",
            X = 2
        };

        private object CreateDate = new
        {
            Name = "CreateDate",
            Label = "创建时间",
            X = 3
        };

    }

    public class UserEdit
    {
        public object View { get; set; }

        public UserEdit()
        {
            View = new
            {
                Properties = GetPropertyList()
            };
        }

        private List<object> GetPropertyList()
        {
            List<object> propertyList = new List<object>();

            propertyList.Add(LoginName);
            propertyList.Add(UserName);

            return propertyList;
        }

        //登录名
        private object LoginName = new
        {
            Name = "LoginName",
            Label = "登录名：",
            ControlType = "TextBox",
            IsNullable = false,
            X = 1,
            Y = 1
        };

        private object UserName = new
        {
            Name = "UserName",
            Label = "用户名：",
            ControlType = "TextBox",
            IsNullable = false,
            X = 1,
            Y = 2
        };
    }
}
