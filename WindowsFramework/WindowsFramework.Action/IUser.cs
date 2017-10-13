using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace WindowsFramework.Action
{
    public interface IUser
    {
        /// <summary>
        /// 登录
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        Entity.Action.User.LoginResponse Login(Entity.Action.User.LoginRequest request);
    }
}
