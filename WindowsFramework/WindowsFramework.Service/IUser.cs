using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using WindowsFramework.Entity.Service.User;

namespace WindowsFramework.Service
{
    public interface IUser
    {
        /// <summary>
        /// 登录
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        LoginResponse Login(LoginRequest request);
    }
}
