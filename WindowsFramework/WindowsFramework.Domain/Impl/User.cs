using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WindowsFramework.Domain.Impl
{
    public class User : IUser
    {
        Service.IUser _user;

        public User()
        {
            _user = new Service.Impl.User();
        }

        /// <summary>
        /// 登录
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public Entity.Service.User.LoginResponse Login(Entity.Action.User.LoginRequest request)
        {
            Entity.Service.User.LoginRequest entity = new Entity.Service.User.LoginRequest();
            entity.LoginName = request.LoginName;
            entity.LoginPasword = request.LoginPasword;

            return _user.Login(entity);
        }
    }
}
