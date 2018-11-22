using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JsonTest
{
    public class LoginRequest
    {
        //登录名
        public String LoginName { get; set; } = null;

        //登录密码
        public String LoginPassword { get; set; } = null;

        public List<UserInfo> UserList { get; set; } = null;

        public int[] UserTypes { get; set; } = null;
    }
}
