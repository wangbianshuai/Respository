using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WindowsFramework.Domain
{
    public interface IUser
    {
        /// <summary>
        /// 登录
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        Entity.Service.User.LoginResponse Login(Entity.Action.User.LoginRequest request);
    }
}
