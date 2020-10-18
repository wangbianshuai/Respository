using Marriage.Entity.Application.User;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Application
{
    public interface IUser
    {
        /// <summary>
        /// 同步微信用户
        /// </summary>
        /// <param name="request"></param>
        /// <param name="token"></param>
        /// <returns></returns>
        SyncWeChatUserResponse SyncWeChatUser(SyncWeChatUserRequest request, string token);
    }
}
